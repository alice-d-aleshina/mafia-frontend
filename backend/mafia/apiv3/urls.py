from django.urls import path

from .views import AdminManage, AdminDelete, PlayerManage, PlayerSetRole

urlpatterns = [
    # Admin API URLs
    path('admins/', AdminManage.as_view(), name='admin_list_and_create'),
    path('admins/<str:username>', AdminDelete.as_view(), name='admin_delete'),

    # Rooms API URLs
    path('rooms/<int:room_id>/players/', PlayerManage.as_view(), name='player_list_and_create'),
    path('rooms/<int:room_id>/players/<int:seat>/<str:setting>', PlayerSetRole.as_view(), name='player_detail'),
]
