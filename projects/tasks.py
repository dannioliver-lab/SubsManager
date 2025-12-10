import csv
import os
from datetime import datetime
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import ExportJob, Task


@shared_task
def export_tasks_to_csv(export_job_id):
    """
    Background task to export tasks to CSV.
    Used for large exports (1000+ items).
    """
    try:
        export_job = ExportJob.objects.get(id=export_job_id)
        export_job.status = 'processing'
        export_job.save()

        # Get all tasks for the project
        tasks = Task.objects.filter(project=export_job.project).select_related('assignee', 'project')
        export_job.task_count = tasks.count()
        export_job.save()

        # Create media/exports directory if it doesn't exist
        exports_dir = os.path.join(settings.MEDIA_ROOT, 'exports')
        os.makedirs(exports_dir, exist_ok=True)

        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"tasks_export_{export_job.project.id}_{timestamp}.csv"
        file_path = os.path.join(exports_dir, filename)

        # Write CSV
        with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
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

        # Update export job
        export_job.status = 'completed'
        export_job.file_path = file_path
        export_job.completed_at = timezone.now()
        export_job.save()

        # Send email notification
        _send_export_notification(export_job)

        return f"Export completed: {filename}"

    except ExportJob.DoesNotExist:
        return f"Export job {export_job_id} not found"
    except Exception as e:
        # Update export job with error
        try:
            export_job = ExportJob.objects.get(id=export_job_id)
            export_job.status = 'failed'
            export_job.error_message = str(e)
            export_job.completed_at = timezone.now()
            export_job.save()
        except:
            pass
        raise


def _send_export_notification(export_job):
    """Send email notification when export is complete."""
    subject = f'Export Complete: {export_job.project.name}'
    
    # Generate download URL (in production, this would be a proper URL)
    download_url = f'/projects/{export_job.project.id}/export/{export_job.id}/download/'
    
    message = f"""
Your export for project "{export_job.project.name}" is ready.

Total tasks exported: {export_job.task_count}
Export completed at: {export_job.completed_at.strftime('%Y-%m-%d %H:%M:%S')}

Download your export file here: {download_url}

This link will be available for 7 days.
"""
    
    from_email = settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@subsmanager.com'
    recipient_list = [export_job.user.email]
    
    send_mail(
        subject,
        message,
        from_email,
        recipient_list,
        fail_silently=True,
    )
