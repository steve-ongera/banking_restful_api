
from django.urls import path
from . import views

urlpatterns = [
    path("accounts/", views.accounts),
    path("send/", views.send_money),
]
