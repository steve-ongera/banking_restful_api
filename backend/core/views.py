from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.db import transaction as db_transaction
from .models import BankAccount, Transaction
from .serializers import (
    UserSerializer, UserRegistrationSerializer, 
    BankAccountSerializer, TransactionSerializer, TransactionCreateSerializer
)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create bank account for user
        from django.utils.crypto import get_random_string
        account_number = get_random_string(12, allowed_chars='0123456789')
        BankAccount.objects.create(user=user, account_number=account_number)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'account_number': account_number
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'account': BankAccountSerializer(user.bankaccount).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        return Response({'message': 'Logged out successfully'})

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        account = BankAccount.objects.get(user=request.user)
        return Response({'balance': account.balance})

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_account = BankAccount.objects.get(user=self.request.user)
        return Transaction.objects.filter(sender=user_account) | Transaction.objects.filter(receiver=user_account)
    
    def create(self, request):
        serializer = TransactionCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                receiver_account = serializer.validated_data['receiver_account']
                amount = serializer.validated_data['amount']
                sender_account = BankAccount.objects.get(user=request.user)
                receiver = BankAccount.objects.get(account_number=receiver_account)
                
                if sender_account == receiver:
                    return Response({'error': 'Cannot send money to yourself'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                if sender_account.balance < amount:
                    return Response({'error': 'Insufficient balance'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                with db_transaction.atomic():
                    sender_account.balance -= amount
                    sender_account.save()
                    receiver.balance += amount
                    receiver.save()
                    
                    transaction = Transaction.objects.create(
                        sender=sender_account,
                        receiver=receiver,
                        amount=amount
                    )
                
                return Response(TransactionSerializer(transaction).data, 
                              status=status.HTTP_201_CREATED)
                
            except BankAccount.DoesNotExist:
                return Response({'error': 'Invalid account number'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, 
                              status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)