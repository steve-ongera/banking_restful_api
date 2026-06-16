from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BankAccount, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class BankAccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = BankAccount
        fields = ['id', 'user', 'account_number', 'balance']

class TransactionSerializer(serializers.ModelSerializer):
    sender_account = serializers.CharField(source='sender.account_number', read_only=True)
    receiver_account = serializers.CharField(source='receiver.account_number', read_only=True)
    sender_name = serializers.CharField(source='sender.user.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.user.username', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'receiver', 'sender_account', 'receiver_account', 
                 'sender_name', 'receiver_name', 'amount', 'created_at']
        read_only_fields = ['created_at']

class TransactionCreateSerializer(serializers.Serializer):
    receiver_account = serializers.CharField(max_length=20)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)