from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class RoomAdminManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The username must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


class RoomAdmin(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = RoomAdminManager()

    def __str__(self):
        return self.username


class Player(models.Model):
    ROLES_CHOICES = {
        "CIV": "civilian",
        "MAF": "mafia",
        "SRF": "sheriff",
        "BSS": "boss"
    }

    username = models.CharField(max_length=30)
    room_id = models.PositiveSmallIntegerField()
    seat = models.PositiveSmallIntegerField()
    role = models.CharField(
        max_length=3,
        choices=ROLES_CHOICES,
        default=ROLES_CHOICES['CIV']
    )
    active = models.BooleanField()
    points = models.PositiveSmallIntegerField(default=0)
