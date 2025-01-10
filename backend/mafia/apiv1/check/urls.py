from django.urls import path

from mafia.apiv1.check.views import CheckSheriffAPIView, CheckMafiaBossAPIView

urlpatterns = [
    path('sheriff/', CheckSheriffAPIView.as_view(), name='sheriff-check'),
    path('boss/', CheckMafiaBossAPIView.as_view(), name='boss-check'),
]
