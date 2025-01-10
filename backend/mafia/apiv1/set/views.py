from django.forms import model_to_dict

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from mafia.models import Room, Player, UserRole


class SetPlayerRoleAPIView(APIView):
    def put(self, request) -> Response:
        data = request.data
        player = Player.objects.get(
            place=data['place'],
            room_id=Room.objects.get(room_id=data['room_id']),
        )
        player.role = UserRole.objects.get(role=data['role'])
        player.save()
        return Response({'put': model_to_dict(player)}, status=status.HTTP_200_OK)


class SetKillPlayerAPIView(APIView):
    def put(self, request) -> Response:
        data = request.data
        player = Player.objects.get(
            place=data['place'],
            room_id=Room.objects.get(room_id=data['room_id']),
        )
        player.active = False
        player.save()
        return Response({'put': model_to_dict(player)}, status=status.HTTP_200_OK)
