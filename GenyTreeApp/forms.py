from django import forms
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _

class UserLogInForm(forms.Form):
    username = forms.CharField(label=_('Nombre de usuario'), min_length=4, max_length=100)
    password = forms.CharField(label=_('Contraseña'), widget=forms.PasswordInput)
    next = forms.CharField(initial='',  widget=forms.HiddenInput)

class UserSingUpForm(forms.Form):
    username = forms.CharField(label=_('Nombre de usuario'), min_length=4, max_length=100)
    email = forms.EmailField(label=_('Correo electrónico'))
    password1 = forms.CharField(label=_('Contraseña'), min_length=8, widget=forms.PasswordInput)
    password2 = forms.CharField(label=_('Confirmar contraseña'), min_length=8, widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data['username']
        user = User.objects.filter(username=username)
        if len(username) < 4:
            self.add_error('username', _("Nombre de usuario demasiado corto"))
        if user.count():
            self.add_error('username', _("Nombre de usuario ya en uso, escoge uno nuevo"))
        return username

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        user = User.objects.filter(email=email)
        if user.count():
            self.add_error('email', _("Correo electrónico ya en uso, escoge uno diferente"))
        return email

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 8 or (not any(char.isdigit() for char in password1)) or (not any(char.islower() for char in password1)) or (not any(char.isupper() for char in password1)):
            self.add_error('password2', _("La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y dígitos"))
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            self.add_error('password2', _("Las contraseñas no coinciden"))
        return password2


    def save(self):
        user = User.objects.create_user(
            self.cleaned_data['username'],
            self.cleaned_data['email'],
            self.cleaned_data['password1']
        )

        # Profile.objects.create(user=user)
        return user