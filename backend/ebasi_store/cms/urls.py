from django.urls import path
from . import views

app_name = 'cms'

urlpatterns = [
    path('config/', views.PublicCmsConfigView.as_view(), name='public-config'),
    path('pages/<slug:slug>/', views.PublicPageContentView.as_view(), name='public-page'),
]
