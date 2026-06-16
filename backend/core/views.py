from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
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
        bank_account = BankAccount.objects.create(user=user, account_number=account_number)
        
        # Create token for user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'account': BankAccountSerializer(bank_account).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Get or create bank account
        try:
            bank_account = BankAccount.objects.get(user=user)
        except BankAccount.DoesNotExist:
            from django.utils.crypto import get_random_string
            account_number = get_random_string(12, allowed_chars='0123456789')
            bank_account = BankAccount.objects.create(user=user, account_number=account_number)
        
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'account': BankAccountSerializer(bank_account).data
        })

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({'message': 'Logged out successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def balance(self, request):
        try:
            account = BankAccount.objects.get(user=request.user)
            return Response({'balance': account.balance})
        except BankAccount.DoesNotExist:
            return Response({'error': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            user_account = BankAccount.objects.get(user=self.request.user)
            return Transaction.objects.filter(sender=user_account) | Transaction.objects.filter(receiver=user_account)
        except BankAccount.DoesNotExist:
            return Transaction.objects.none()
    
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