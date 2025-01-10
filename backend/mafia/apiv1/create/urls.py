from django.urls import path

from mafia.apiv1.create.views import CreateRoomAPIView, CreatePlayerAPIView, CreateRecordAPIView

urlpatterns = [
    path('room/', CreateRoomAPIView.as_view(), name='room-create'),
    path('player/', CreatePlayerAPIView.as_view(), name='player-create'),
    path('record/', CreateRecordAPIView.as_view(), name='action-create')
]
