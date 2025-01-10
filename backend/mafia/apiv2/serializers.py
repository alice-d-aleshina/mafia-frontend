from django.core.exceptions import ValidationError

from rest_framework import serializers

from mafia.models import Room, RoomAdmin, Role, Action, Player, Record


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('room_id', )


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomAdmin
        fields = ('username', 'password')


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = ('action', )


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('role', )


class PlayerSerializer(serializers.ModelSerializer):
    seat = serializers.IntegerField(min_value=1, max_value=10)
    role = serializers.CharField(required=False, default="citizen")
    active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = Player
        fields = ('username', 'seat', 'role', 'active', 'room_id')

    def validate(self, data):
        if data['seat'] < 1 or data['seat'] > 10:
            raise ValidationError('Seat number must be between 1 and 10')
        return data

    def create(self, validated_data):
        if 'role' not in validated_data or not validated_data['role'].strip():
            validated_data['role'] = 'citizen'
        if 'active' not in validated_data or not validated_data['active'].strip():
            validated_data['role'] = True
        return super().create(validated_data)


class RecordSerializer(serializers.ModelSerializer):
    actor_role = serializers.CharField(required=False, default="all")
    action = serializers.CharField(required=False)

    class Meta:
        model = Record
        fields = ('room_id', 'action', 'actor_role', 'victim_name')

    def create(self, validated_data):
        if 'actor_role' not in validated_data or not validated_data['actor_role'].strip():
            validated_data['role'] = 'all'
        return super().create(validated_data)
