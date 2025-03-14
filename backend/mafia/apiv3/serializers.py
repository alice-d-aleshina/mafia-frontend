from django.core.exceptions import ValidationError

from rest_framework import serializers

from mafia.models import Player, RoomAdmin


class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = RoomAdmin
        fields = ('username', 'password')

    def create(self, validated_data):
        user = RoomAdmin.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        return user


class PlayerSerializer(serializers.ModelSerializer):
    ROLES_CHOICES = {
        "CIV": "civilian",
        "MAF": "mafia",
        "SRF": "sheriff",
        "BSS": "boss"
    }

    seat = serializers.IntegerField(min_value=1, max_value=10)
    role = serializers.CharField(required=False, default=ROLES_CHOICES['CIV'])
    active = serializers.BooleanField(required=False, default=True)
    points = serializers.IntegerField(min_value=0, max_value=100, default=0)

    class Meta:
        model = Player
        fields = ('room_id', 'seat', 'username', 'role', 'active')

    def validate(self, data):
        if data['seat'] < 1 or data['seat'] > 10:
            raise ValidationError('Seat number must be between 1 and 10')
        if data['points'] < 0 or data['seat'] > 100:
            raise ValidationError('Forbidden points value')
        return data

    def create(self, validated_data):
        if 'role' not in validated_data or not validated_data['role'].strip():
            validated_data['role'] = 'citizen'
        if 'active' not in validated_data or not validated_data['active'].strip():
            validated_data['role'] = True
        if 'points' not in validated_data or not validated_data['points'].strip():
            validated_data['role'] = 0
        return super().create(validated_data)
