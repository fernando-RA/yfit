from rest_framework.permissions import BasePermission, SAFE_METHODS

from users.models import User
from trainer_classes.models import TrainerClass


class IsTrainer(BasePermission):
    def has_permission(self, request, view):
        """
        Return `True` if user is author.
        """
        trainer_class = TrainerClass.objects.filter(pk=view.kwargs.get('pk')).first()
        return bool(
            not trainer_class or
            request.method in SAFE_METHODS or 
            request.user.user_type == User.TRAINER and 
            trainer_class.author_id == request.user.id
            )
