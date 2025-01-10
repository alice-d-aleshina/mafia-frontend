from django.urls import path

from .views import RoomManage, RoomDelete, AdminManage, AdminDelete, \
                   ActionManage, ActionDelete, RoleManage, RoleDelete, \
                   PlayerManage, PlayerSettings, RecordManage

urlpatterns = [
    # Room API URLs
    path('rooms/', RoomManage.as_view(), name='room_list_and_create'),
    path('rooms/<int:room_id>/', RoomDelete.as_view(), name='room_delete'),

    # Admin API URLs
    path('admins/', AdminManage.as_view(), name='admin_list_and_create'),
    path('admins/<str:username>', AdminDelete.as_view(), name='admin_delete'),

    # Actions API URLs
    path('actions/', ActionManage.as_view(), name='action_list_and_create'),
    path('actions/<str:action_name>', ActionDelete.as_view(), name='action_delete'),

    # Roles API URLs
    path('roles/', RoleManage.as_view(), name='role_list_and_create'),
    path('roles/<str:role_name>', RoleDelete.as_view(), name='role_delete'),

    # Rooms API URLs
    path('rooms/<int:room_id>/players/', PlayerManage.as_view(), name='player_list_and_create'),
    path('rooms/<int:room_id>/players/<int:seat>/<str:setting>', PlayerSettings.as_view(), name='player_detail'),

    # Records API URLs
    path('records/<int:room_id>/', RecordManage.as_view(), name='record_list_and_create'),
]
