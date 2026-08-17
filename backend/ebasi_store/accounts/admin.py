from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import ContactMessage, StaffProfile


class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False
    verbose_name_plural = 'Staff RBAC Profile'
    fk_name = 'user'


class CustomUserAdmin(BaseUserAdmin):
    inlines = (StaffProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'staff_profile__role')

    def get_role(self, instance):
        if instance.is_superuser:
            return 'Owner / Super Admin'
        profile = getattr(instance, 'staff_profile', None)
        return profile.get_role_display() if profile else 'Staff'
    get_role.short_description = 'RBAC Role'


# Re-register UserAdmin with StaffProfileInline
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
