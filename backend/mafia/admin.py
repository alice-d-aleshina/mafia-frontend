from django.contrib import admin

from mafia.models import Room, Role, RoomAdmin, Player, Record, Action

admin.site.register(Room)
admin.site.register(Role)
admin.site.register(RoomAdmin)
admin.site.register(Player)
admin.site.register(Record)
admin.site.register(Action)