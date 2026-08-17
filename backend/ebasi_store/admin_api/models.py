from django.db import models
from django.contrib.auth.models import User


class AuditLog(models.Model):
    """
    Lightweight audit log for staff activities and business operations.
    """
    actor = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='audit_logs'
    )
    actor_username = models.CharField(max_length=150, blank=True)
    action = models.CharField(max_length=64, db_index=True)
    target_type = models.CharField(max_length=64, blank=True)
    target_id = models.CharField(max_length=64, blank=True)
    target_repr = models.CharField(max_length=255, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'

    def __str__(self):
        actor_name = self.actor_username or (self.actor.username if self.actor else 'System')
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {actor_name}: {self.action} ({self.target_repr})"


def get_client_ip(request):
    """Extracts client IP address from request."""
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def log_audit(request, action: str, target=None, target_repr: str = '', details: dict = None):
    """
    Utility function to record an audit log event.
    """
    actor = getattr(request, 'user', None) if request else None
    if actor and not actor.is_authenticated:
        actor = None

    actor_username = actor.username if actor else 'System'
    ip_address = get_client_ip(request)

    target_type = ''
    target_id = ''
    if target is not None:
        target_type = target.__class__.__name__
        target_id = str(getattr(target, 'pk', getattr(target, 'id', '')))
        if not target_repr:
            target_repr = str(target)

    return AuditLog.objects.create(
        actor=actor,
        actor_username=actor_username,
        action=action,
        target_type=target_type,
        target_id=target_id,
        target_repr=str(target_repr)[:255],
        details=details or {},
        ip_address=ip_address
    )
