from django.contrib.auth.forms import UserCreationForm

from mafia.models import RoomAdmin


class RoomAdminRegistrationForm(UserCreationForm):
    class Meta:
        model = RoomAdmin
        fields = ['username', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user
