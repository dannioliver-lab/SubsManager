from django.urls import path
from . import views

urlpatterns = [
    path('', views.project_list, name='project_list'),
    path('<int:project_id>/', views.project_detail, name='project_detail'),
    path('<int:project_id>/settings/', views.project_settings, name='project_settings'),
    path('<int:project_id>/export/', views.export_tasks, name='export_tasks'),
    path('<int:project_id>/export/<int:export_id>/download/', views.download_export, name='download_export'),
]
