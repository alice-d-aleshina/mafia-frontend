from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from mafia.models import Room, UserRole, Player, Record, Action
from mafia.apiv1.list.serializers import RoomSerializer, UserRoleSerializer, PlayerSerializer, RecordSerializer, ActionSerializer


class RoomsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class ActionsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer


class UserRolesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer


class PlayersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class RecordsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer


class ActivePlayersAPIView(APIView):
    def get(self, request) -> Response:
        players = Player.objects.filter(
            room_id=request.data['room_id'],
            active=True
        )
        return Response({'active_players': [p.username for p in players]})