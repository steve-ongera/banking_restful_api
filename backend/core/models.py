from django.db import models
from django.contrib.auth.models import User

class BankAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    account_number = models.CharField(max_length=20, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.account_number

class Transaction(models.Model):
    sender = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name="sent")
    receiver = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name="received")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # ← newest transactions first