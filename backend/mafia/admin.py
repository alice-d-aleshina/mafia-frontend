from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from mafia.models import RoomAdmin, Player


admin.site.register(RoomAdmin)
admin.site.register(Player)
