from django.forms import model_to_dict

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from mafia.models import Room, Player, UserRole, Record, Action


class CreateRoomAPIView(APIView):
    def post(self, request) -> Response:
        room = Room.objects.create(
            room_id=request.data['room_id'],
        )
        return Response({'post': model_to_dict(room)}, status=status.HTTP_201_CREATED)


class CreatePlayerAPIView(APIView):
    def post(self, request) -> Response:
        data = request.data
        if data['role'] != '':
            role = UserRole.objects.get(role=data['role'])
        else:
            role = UserRole.objects.get(role='civilian')

        player = Player.objects.create(
            username=data['username'],
            password=data['password'] if data['role'] == 'admin' else '',
            room_id=Room.objects.get(room_id=data['room_id']),
            role=role,
            active=False if data['role'] == 'admin' else True,
            place=data['place'],
        )
        return Response({'post': model_to_dict(player)}, status=status.HTTP_201_CREATED)


class CreateRecordAPIView(APIView):
    def post(self, request) -> Response:
        data = request.data
        victim = Player.objects.get(username=data['victim_name'])

        action = Record.objects.create(
            room_id=Room.objects.get(room_id=data['room_id']),
            action=Action.objects.get(action=data['action']),
            actor_role=UserRole.objects.get(role=data['actor_role']) if data['action'] != 'remove' else '',
            victim_name=victim.username,
        )
        return Response({'post': model_to_dict(action)}, status=status.HTTP_201_CREATED)
