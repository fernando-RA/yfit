from django import forms

from .models import TrainerClass


class TrainerClassForm(forms.ModelForm):
    password = forms.CharField(
        required=False, widget=forms.PasswordInput(render_value=True)
    )

    class Meta:
        model = TrainerClass
        fields = "__all__"
