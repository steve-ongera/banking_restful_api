from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import BankAccount, Transaction
from decimal import Decimal
import random


class Command(BaseCommand):
    help = "Seed database with sample users, bank accounts, and transactions"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # Clear old data (optional but useful in dev)
        Transaction.objects.all().delete()
        BankAccount.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        users_data = [
            {"username": "john", "password": "password123"},
            {"username": "alice", "password": "password123"},
            {"username": "bob", "password": "password123"},
            {"username": "mary", "password": "password123"},
        ]

        accounts = []

        # Create users + bank accounts
        for i, data in enumerate(users_data, start=1):
            user = User.objects.create_user(
                username=data["username"],
                password=data["password"]
            )

            account = BankAccount.objects.create(
                user=user,
                account_number=f"ACC100{i:03d}",
                balance=Decimal(random.randint(1000, 10000))
            )

            accounts.append(account)

        self.stdout.write(self.style.SUCCESS("Users and accounts created."))

        # Create sample transactions
        for _ in range(5):
            sender = random.choice(accounts)
            receiver = random.choice(accounts)

            if sender == receiver:
                continue

            amount = Decimal(random.randint(100, 1000))

            # ensure sender has enough balance
            if sender.balance < amount:
                continue

            sender.balance -= amount
            receiver.balance += amount

            sender.save()
            receiver.save()

            Transaction.objects.create(
                sender=sender,
                receiver=receiver,
                amount=amount
            )

        self.stdout.write(self.style.SUCCESS("Transactions created successfully."))
        self.stdout.write(self.style.SUCCESS("Seeding completed ✔"))