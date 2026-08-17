"""
Ebasi Store - Role-Based Access Control (RBAC) Permissions Module.

Defines explicit permissions, role mappings, and DRF permission classes
to authoritatively enforce authorization across all admin endpoints.
"""

from rest_framework import permissions

# ==============================================================================
# Role Definitions
# ==============================================================================
class Roles:
    OWNER = 'owner'
    MANAGER = 'manager'
    STAFF = 'staff'
    VIEWER = 'viewer'

    CHOICES = (
        (OWNER, 'Owner / Super Admin'),
        (MANAGER, 'Manager'),
        (STAFF, 'Staff'),
        (VIEWER, 'Viewer'),
    )

    ALL_ROLES = [OWNER, MANAGER, STAFF, VIEWER]


# ==============================================================================
# Explicit Permissions Matrix
# ==============================================================================
ROLE_PERMISSIONS = {
    Roles.OWNER: {
        # Full unrestricted access
        'dashboard.view',
        'analytics.view',
        'products.view',
        'products.create',
        'products.update',
        'products.delete',
        'categories.view',
        'categories.create',
        'categories.update',
        'categories.delete',
        'reviews.view',
        'reviews.moderate',
        'messages.view',
        'messages.update',
        'messages.delete',
        'settings.view',
        'staff.view',
        'staff.create',
        'staff.update',
        'staff.deactivate',
        'staff.change_role',
        'audit.view',
        'content.view',
        'content.create',
        'content.update',
        'content.delete',
        'content.publish',
    },
    Roles.MANAGER: {
        # Operational business management without staff/system administration
        'dashboard.view',
        'analytics.view',
        'products.view',
        'products.create',
        'products.update',
        'products.delete',
        'categories.view',
        'categories.create',
        'categories.update',
        'categories.delete',
        'reviews.view',
        'reviews.moderate',
        'messages.view',
        'messages.update',
        'messages.delete',
        'settings.view',
        'content.view',
        'content.create',
        'content.update',
        'content.delete',
        'content.publish',
    },
    Roles.STAFF: {
        # Daily catalog, review, and inquiry operations
        'dashboard.view',
        'products.view',
        'products.create',
        'products.update',
        'products.delete',
        'categories.view',  # Read categories to assign to products
        'reviews.view',
        'reviews.moderate',
        'messages.view',
        'messages.update',
        'messages.delete',
        'content.view',
    },
    Roles.VIEWER: {
        # Strict read-only role across store data
        'dashboard.view',
        'analytics.view',
        'products.view',
        'categories.view',
        'reviews.view',
        'messages.view',
        'content.view',
    },
}


# ==============================================================================
# Helper Functions
# ==============================================================================
def get_user_role(user) -> str:
    """
    Resolves the canonical RBAC role string for a given Django User.
    Superusers always resolve to 'owner'.
    """
    if not user or not user.is_authenticated:
        return ''
    if user.is_superuser:
        return Roles.OWNER
    
    # Check associated StaffProfile if present
    profile = getattr(user, 'staff_profile', None)
    if profile and profile.role:
        return profile.role

    # Default fallback for staff users without an explicit profile
    if user.is_staff:
        return Roles.STAFF
    
    return ''


def get_user_permissions(user) -> set:
    """
    Returns the set of permission codenames granted to the given User.
    """
    if not user or not user.is_authenticated or not user.is_active:
        return set()
    if user.is_superuser:
        return ROLE_PERMISSIONS[Roles.OWNER]
    
    role = get_user_role(user)
    return ROLE_PERMISSIONS.get(role, set())


def has_staff_permission(user, permission_codename: str) -> bool:
    """
    Checks if an active staff/superuser user has the requested permission.
    """
    if not user or not user.is_authenticated or not user.is_active:
        return False
    if user.is_superuser:
        return True
    if not user.is_staff:
        return False

    perms = get_user_permissions(user)
    return permission_codename in perms


# ==============================================================================
# DRF Permission Classes
# ==============================================================================
class RequireStaffPermission(permissions.BasePermission):
    """
    Authoritative DRF permission class.
    Checks that the user is an active staff/superuser, then validates that the user
    has the permission required for the specific view action or HTTP method.
    """
    message = "You do not have permission to perform this action."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and user.is_active and (user.is_staff or user.is_superuser)):
            return False

        # Superuser always has full access
        if user.is_superuser:
            return True

        # 1. Check action-level permissions mapping on ViewSets
        action = getattr(view, 'action', None)
        action_permissions = getattr(view, 'action_permissions', {})
        if action and action in action_permissions:
            required_perm = action_permissions[action]
            if required_perm:
                return has_staff_permission(user, required_perm)

        # 2. Check view-level required_permission
        required_perm = getattr(view, 'required_permission', None)
        if required_perm:
            return has_staff_permission(user, required_perm)

        # 3. Check method-level mapping fallback
        method_permissions = getattr(view, 'method_permissions', {})
        if request.method in method_permissions:
            required_perm = method_permissions[request.method]
            if required_perm:
                return has_staff_permission(user, required_perm)

        # If no specific permission is declared, default to verifying staff status
        return user.is_staff


class IsOwnerUser(permissions.BasePermission):
    """
    Permission class allowing access only to Owner / Super Admin users.
    """
    message = "Owner administrator privileges required for this operation."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and user.is_active):
            return False
        return user.is_superuser or get_user_role(user) == Roles.OWNER
