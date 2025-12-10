import csv
import os
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, FileResponse, Http404
from django.contrib import messages
from django.utils import timezone
from .models import Project, Task, ExportJob
from .tasks import export_tasks_to_csv


@login_required
def project_settings(request, project_id):
    """Display project settings page with export option."""
    project = get_object_or_404(Project, id=project_id)
    recent_exports = ExportJob.objects.filter(
        project=project,
        user=request.user
    ).order_by('-created_at')[:5]
    
    context = {
        'project': project,
        'recent_exports': recent_exports,
    }
    return render(request, 'projects/project_settings.html', context)


@login_required
def export_tasks(request, project_id):
    """Export tasks to CSV - handles both small and large exports."""
    project = get_object_or_404(Project, id=project_id)
    
    if request.method != 'POST':
        return redirect('project_settings', project_id=project_id)
    
    # Get task count
    task_count = Task.objects.filter(project=project).count()
    
    # For large exports (1000+ items), use background processing
    if task_count >= 1000:
        # Create export job
        export_job = ExportJob.objects.create(
            project=project,
            user=request.user,
            status='pending',
            task_count=task_count
        )
        
        # Queue background task
        export_tasks_to_csv.delay(export_job.id)
        
        messages.success(
            request,
            f'Export queued for {task_count} tasks. You will receive an email when it\'s ready.'
        )
        return redirect('project_settings', project_id=project_id)
    
    # For small exports, return CSV immediately
    else:
        return _generate_csv_response(project)


def _generate_csv_response(project):
    """Generate and return CSV file for immediate download."""
    tasks = Task.objects.filter(project=project).select_related('assignee', 'project')
    
    # Create the HttpResponse object with CSV header
    # Sanitize project ID (ensure it's an integer)
    safe_project_id = int(project.id)
    timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
    filename = f"tasks_export_{safe_project_id}_{timestamp}.csv"
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    writer = csv.writer(response)
    
    # Write header
    writer.writerow([
        'Task ID',
        'Title',
        'Assignee',
        'Status',
        'Created Date',
        'Due Date'
    ])
    
    # Write task data
    for task in tasks:
        assignee_name = task.assignee.get_full_name() or task.assignee.username if task.assignee else 'Unassigned'
        status_display = dict(Task.STATUS_CHOICES).get(task.status, task.status)
        created_date = task.created_date.strftime('%Y-%m-%d %H:%M:%S') if task.created_date else ''
        due_date = task.due_date.strftime('%Y-%m-%d %H:%M:%S') if task.due_date else ''
        
        writer.writerow([
            task.id,
            task.title,
            assignee_name,
            status_display,
            created_date,
            due_date
        ])
    
    return response


@login_required
def download_export(request, project_id, export_id):
    """Download a completed export file."""
    project = get_object_or_404(Project, id=project_id)
    export_job = get_object_or_404(
        ExportJob,
        id=export_id,
        project=project,
        user=request.user
    )
    
    if export_job.status != 'completed':
        messages.error(request, 'Export is not ready yet.')
        return redirect('project_settings', project_id=project_id)
    
    if not export_job.file_path or not os.path.exists(export_job.file_path):
        raise Http404('Export file not found.')
    
    # Serve the file with proper resource management
    file_handle = open(export_job.file_path, 'rb')
    response = FileResponse(
        file_handle,
        content_type='text/csv',
        as_attachment=True
    )
    filename = os.path.basename(export_job.file_path)
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response


@login_required
def project_list(request):
    """List all projects."""
    projects = Project.objects.all()
    return render(request, 'projects/project_list.html', {'projects': projects})


@login_required
def project_detail(request, project_id):
    """Display project details and task list."""
    project = get_object_or_404(Project, id=project_id)
    tasks = Task.objects.filter(project=project)
    
    context = {
        'project': project,
        'tasks': tasks,
    }
    return render(request, 'projects/project_detail.html', context)

