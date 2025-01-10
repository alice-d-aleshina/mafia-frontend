from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from mafia.models import Room, Player, UserRole


class CheckSheriffAPIView(APIView):
    def get(self, request) -> Response:
        data = request.data
        player = Player.objects.get(
            place=data['place'],
            room_id=Room.objects.get(room_id=data['room_id']),
        )
        if player.role == UserRole.objects.get(role='sheriff'):
            return Response({'is_sheriff': True}, status=status.HTTP_200_OK)
        else:
            return Response({'is_sheriff': False}, status=status.HTTP_200_OK)


class CheckMafiaBossAPIView(APIView):
    def get(self, request) -> Response:
        data = request.data
        player = Player.objects.get(
            place=data['place'],
            room_id=Room.objects.get(room_id=data['room_id']),
        )
        if player.role == UserRole.objects.get(role='mafia_boss'):
            return Response({'is_mafia_boss': True}, status=status.HTTP_200_OK)
        else:
            return Response({'is_mafia_boss': False}, status=status.HTTP_200_OK)
