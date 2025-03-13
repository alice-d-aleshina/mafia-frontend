from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema, OpenApiResponse

from mafia.models import RoomAdmin, Player
from .serializers import PlayerSerializer, AdminSerializer


class AdminManage(APIView):
    @extend_schema(
        summary="List of all room administrators",
        description="Prints a list of all game room administrators.",
        responses={
            200: OpenApiResponse(response=AdminSerializer(many=True), description="Admin list"),
        }
    )
    def get(self, request):
        admins = RoomAdmin.objects.all()
        serializer = AdminSerializer(admins, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Register new room administrator",
        description="Registers new room administrator with username and password provided as parameters. "
                    "Administrator's username and password must be strings up to 30 characters long. "
                    "The username must be unique.",
        request=AdminSerializer,
        responses={
            201: OpenApiResponse(response=AdminSerializer, description="Administrator created successfully"),
            400: OpenApiResponse(description="Internal error")
        }
    )
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.save()
            return Response({'status': 'Admin created', 'username': admin.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDelete(APIView):
    @extend_schema(
        summary="Delete room administrator",
        description="Deletes room administrator by username. If username not found, returns error.",
        responses={
            201: OpenApiResponse(description="Admin deleted successfully"),
            404: OpenApiResponse(description="Admin not found"),
            400: OpenApiResponse(description="Username not provided")
        }
    )
    def delete(self, request, username):
        if username:
            try:
                admin = RoomAdmin.objects.get(username=username)
                admin.delete()
                return Response({'status': 'Admin deleted'}, status=status.HTTP_200_OK)
            except Room.DoesNotExist:
                return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Username not provided'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerManage(APIView):
    @extend_schema(
        summary="List of all players in game room",
        description="Prints a list of all players in game room with Room ID.",
        responses={
            200: OpenApiResponse(response=PlayerSerializer(many=True), description="Player list"),
            400: OpenApiResponse(description="Room ID not provided")
        }
    )
    def get(self, request, room_id):
        players = Player.objects.filter(room_id=room_id)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Add new player to the game room",
        description="Adds new player action to the game room with specified Room ID "
                    "with their seat number provided as parameter. Seat number must be between 1 and 10",
        request=PlayerSerializer,
        responses={
            201: OpenApiResponse(response=PlayerSerializer, description="Player added successfully"),
            400: OpenApiResponse(description="Room ID not provided")
        }
    )
    def post(self, request, room_id):
        serializer = PlayerSerializer(data=[request.data, room_id])
        if serializer.is_valid():
            player = serializer.save()
            return Response({'status': 'Player added', 'name': player.username}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Room ID not provided'}, status=status.HTTP_400_BAD_REQUEST)


class PlayerSetRole(APIView):
    @extend_schema(
        summary="Set player role",
        description="Sets player role by their seat and Room ID.",
        responses={
            201: OpenApiResponse(description="Action deleted successfully"),
            400: OpenApiResponse(description="Seat or role not provided")
        }
    )
    def put(self, request, room_id, seat, setting):
        player = Player.objects.get(
            room_id=room_id,
            seat=seat
        )
        if setting:
            player.role = setting
        player.save()
        return Response({'status': 'Player role changed'}, status=status.HTTP_200_OK)
