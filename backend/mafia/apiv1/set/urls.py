from django.urls import path

from mafia.apiv1.set.views import SetPlayerRoleAPIView, SetKillPlayerAPIView

urlpatterns = [
    path('role/', SetPlayerRoleAPIView.as_view(), name='set-player-role'),
    path('kill/', SetKillPlayerAPIView.as_view(), name='kill-or-remove-player'),
]
