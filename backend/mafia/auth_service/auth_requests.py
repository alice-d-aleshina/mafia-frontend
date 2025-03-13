from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm

from mafia.models import RoomAdmin
from .forms import RoomAdminRegistrationForm


def register_request(request):
    if request.method == 'POST':
        form = RoomAdminRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            form.save()
            login(request, user)
            messages.success(request, 'Registration successful. You can now log in.')
            return redirect('/admin/')  # TODO: Redirect to game
        else:
            messages.error(request, "Unsuccessful registration. Invalid information.")
    form = RoomAdminRegistrationForm()
    return render(request, 'register.html', {'form': form})


def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("/admin/") # TODO: Redirect to game
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request=request, template_name="login.html", context={"login_form": form})
