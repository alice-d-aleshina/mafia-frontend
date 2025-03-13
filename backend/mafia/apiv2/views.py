from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema, OpenApiResponse

from mafia.models import Room, RoomAdmin, Player, Role, Record, Action
from .serializers import RoomSerializer, RoleSerializer, AdminSerializer, \
                         ActionSerializer, PlayerSerializer, RecordSerializer


class RoomManage(APIView):
    @extend_schema(
        summary="List of all rooms",
        description="Prints a list of all game rooms created by users.",
        responses={
            200: OpenApiResponse(response=RoomSerializer(many=True), description="Room list"),
        }
    )
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Create a new room",
        description="Creates a new room with Room ID provided as parameter. "
                    "Room ID must be an integer in range 1 to 999",
        request=RoomSerializer,
        responses={
            201: OpenApiResponse(response=RoomSerializer, description="Room created successfully"),
            400: OpenApiResponse(description="Validation error")
        }
    )
    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            room = serializer.save()
            return Response({"status": "Room created", "id": room.room_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomDelete(APIView):
    @extend_schema(
        summary="Delete room",
        description="Deletes room with Room ID provided as parameter. If room not found, returns error.",
        responses={
            201: OpenApiResponse(description="Room deleted successfully"),
            404: OpenApiResponse(description="Room not found"),
            400: OpenApiResponse(description="Room ID not provided")
        }
    )
    def delete(self, request, room_id):
        if room_id:
            try:
                room = Room.objects.get(room_id=room_id)
                room.delete()
                return Response({'status': 'Room deleted'}, status=status.HTTP_200_OK)
            except Room.DoesNotExist:
                return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Room ID not provided'}, status=status.HTTP_400_BAD_REQUEST)


class RoleManage(APIView):
    @extend_schema(
        summary="List of all player roles",
        description="Prints a list of all existing game roles.",
        responses={
            200: OpenApiResponse(response=RoleSerializer(many=True), description="Role list"),
        }
    )
    def get(self, request):
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Create a new game role",
        description="Creates a new game role with the given name.",
        request=RoomSerializer,
        responses={
            201: OpenApiResponse(response=RoleSerializer, description="Role created successfully"),
            400: OpenApiResponse(description="Validation error")
        }
    )
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            role = serializer.save()
            return Response({"status": "Role created", "name": role.role}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleDelete(APIView):
    @extend_schema(
        summary="Delete game role",
        description="Deletes game role with the given name.",
        responses={
            201: OpenApiResponse(description="Role deleted successfully"),
            404: OpenApiResponse(description="Role not found"),
            400: OpenApiResponse(description="Role name not provided")
        }
    )
    def delete(self, request, role_name):
        if role_name:
            try:
                role = Role.objects.get(role=role_name)
                role.delete()
                return Response({'status': 'Role deleted'}, status=status.HTTP_200_OK)
            except Room.DoesNotExist:
                return Response({'error': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Role name not provided'}, status=status.HTTP_400_BAD_REQUEST)


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
        description="Registers new room administrator with username and password provided as parameter. "
                    "The username and password must be strings up to 30 characters long. "
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


class ActionManage(APIView):
    @extend_schema(
        summary="List of all actions",
        description="Prints a list of all actions available to players.",
        responses={
            200: OpenApiResponse(response=ActionSerializer(many=True), description="Actions list"),
        }
    )
    def get(self, request):
        actions = Action.objects.all()
        serializer = ActionSerializer(actions, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Add new player action",
        description="Adds new player action with its name provided as parameter. "
                    "The action name must be a unique string up to 10 characters long.",
        request=ActionSerializer,
        responses={
            201: OpenApiResponse(response=ActionSerializer, description="Action created successfully"),
            400: OpenApiResponse(description="Internal error")
        }
    )
    def post(self, request):
        serializer = ActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.save()
            return Response({'status': 'Action created', 'name': action.action}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActionDelete(APIView):
    @extend_schema(
        summary="Delete player action",
        description="Deletes player action by its name. If action not found, returns error.",
        responses={
            201: OpenApiResponse(description="Action deleted successfully"),
            404: OpenApiResponse(description="Action not found"),
            400: OpenApiResponse(description="Action name not provided")
        }
    )
    def delete(self, request, action_name):
        if action_name:
            try:
                action = RoomAdmin.objects.get(action=action_name)
                action.delete()
                return Response({'status': 'Action deleted'}, status=status.HTTP_200_OK)
            except Room.DoesNotExist:
                return Response({'error': 'Action not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Action name not provided'}, status=status.HTTP_400_BAD_REQUEST)


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
        room = get_object_or_404(Room, id=room_id)
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


class PlayerSettings(APIView):
    @extend_schema(
        summary="Set player role",
        description="Sets player role by their seat and Room ID.",
        responses={
            201: OpenApiResponse(description="Action deleted successfully"),
            400: OpenApiResponse(description="Seat or role not provided")
        }
    )
    def put(self, request, room_id, seat, setting):

        if setting in Role.objects.values_list('role', flat=True):
            player = Player.objects.get(
                room_id=room_id,
                seat=seat
            )
            player.role = setting
            player.save()
            return Response({'status': 'Player role changed'}, status=status.HTTP_200_OK)
        elif not setting:
            player = Player.objects.get(
                room_id=room_id,
                seat=seat
            )
            player.active = False
            player.save()
            return Response({'status': 'Player killed'}, status=status.HTTP_200_OK)
        return Response({'error': 'Wrong setting'}, status=status.HTTP_400_BAD_REQUEST)


class RecordManage(APIView):
    @extend_schema(
        summary="List of all records in game room",
        description="Prints a list of all action records in game room with given Room ID.",
        responses={
            200: OpenApiResponse(response=RecordSerializer(many=True), description="Records list"),
            400: OpenApiResponse(description="Room ID not provided")
        }
    )
    def get(self, request, room_id):
        records = Record.objects.filter(room_id=room_id)
        serializer = RecordSerializer(records, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Add new action record",
        description="Adds new action record in game room with given ID ",
        request=RecordSerializer,
        responses={
            201: OpenApiResponse(response=RecordSerializer, description="Action recorded successfully"),
            400: OpenApiResponse(description="Room ID not provided")
        }
    )
    def post(self, request, room_id):
        serializer = ActionSerializer(data=[request.data, room_id])
        if serializer.is_valid():
            record = serializer.save()
            return Response({'status': 'Action recorded', 'id': record.id}, status=status.HTTP_201_CREATED)
        return Response({'error': 'Room ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
