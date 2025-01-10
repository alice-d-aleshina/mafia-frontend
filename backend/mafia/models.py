from django.db import models


class Room(models.Model):
    room_id = models.IntegerField(unique=True)


class Role(models.Model):
    role = models.CharField(max_length=10, unique=True)


class Action(models.Model):
    action = models.CharField(max_length=20, unique=True)


class RoomAdmin(models.Model):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30)


class Player(models.Model):
    username = models.CharField(max_length=30)
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
    seat = models.IntegerField()
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    active = models.BooleanField()


class Record(models.Model):
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
    action = models.ForeignKey(Action, on_delete=models.CASCADE)
    actor_role = models.ForeignKey(Role, on_delete=models.CASCADE)
    victim_name = models.CharField(max_length=20)
