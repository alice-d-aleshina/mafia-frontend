from django.urls import path, include

from rest_framework import routers

from mafia.apiv1.list.views import RoomsViewSet, UserRolesViewSet, PlayersViewSet, \
    RecordsViewSet, ActionsViewSet, ActivePlayersAPIView


router = routers.DefaultRouter()
router.register(r'rooms', RoomsViewSet)
router.register(r'roles', UserRolesViewSet)
router.register(r'actions', ActionsViewSet)
router.register(r'players', PlayersViewSet)
router.register(r'records', RecordsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('active/', ActivePlayersAPIView.as_view(), name='active')
]
