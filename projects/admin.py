from django.contrib import admin
from .models import Project, Task, ExportJob


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'updated_at']
    search_fields = ['name', 'description']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'project', 'assignee', 'status', 'created_date', 'due_date']
    list_filter = ['status', 'project', 'assignee']
    search_fields = ['title', 'description']
    date_hierarchy = 'created_date'


@admin.register(ExportJob)
class ExportJobAdmin(admin.ModelAdmin):
    list_display = ['id', 'project', 'user', 'status', 'task_count', 'created_at', 'completed_at']
    list_filter = ['status', 'project']
    readonly_fields = ['created_at', 'completed_at']
