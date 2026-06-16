
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import BankAccount, Transaction
from .serializers import BankAccountSerializer, TransactionSerializer

@api_view(["GET"])
def accounts(request):
    data = BankAccount.objects.all()
    return Response(BankAccountSerializer(data, many=True).data)


@api_view(["POST"])
def send_money(request):
    sender_id = request.data.get("sender")
    receiver_id = request.data.get("receiver")
    amount = float(request.data.get("amount"))

    sender = BankAccount.objects.get(id=sender_id)
    receiver = BankAccount.objects.get(id=receiver_id)

    if sender.balance < amount:
        return Response({"error": "Insufficient funds"}, status=400)

    sender.balance -= amount
    receiver.balance += amount

    sender.save()
    receiver.save()

    tx = Transaction.objects.create(sender=sender, receiver=receiver, amount=amount)

    return Response(TransactionSerializer(tx).data)
