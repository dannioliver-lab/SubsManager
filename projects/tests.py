import os
import csv
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .models import Project, Task, ExportJob
from .tasks import export_tasks_to_csv


class ExportTasksTestCase(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client = Client()
        self.client.login(username='testuser', password='testpass123')
        
        # Create test project
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description'
        )
        
        # Create test tasks
        self.task1 = Task.objects.create(
            project=self.project,
            title='Task 1',
            assignee=self.user,
            status='todo',
            due_date=timezone.now() + timedelta(days=7)
        )
        
        self.task2 = Task.objects.create(
            project=self.project,
            title='Task 2',
            assignee=self.user,
            status='in_progress'
        )
        
        self.task3 = Task.objects.create(
            project=self.project,
            title='Task 3',
            status='done'
        )

    def test_project_settings_view(self):
        """Test that project settings page loads correctly."""
        response = self.client.get(
            reverse('project_settings', args=[self.project.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Export Project Data')
        self.assertContains(response, 'Export Tasks to CSV')

    def test_small_export_immediate_download(self):
        """Test that small exports (< 1000 tasks) download immediately."""
        response = self.client.post(
            reverse('export_tasks', args=[self.project.id])
        )
        
        # Should return CSV response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertIn('attachment', response['Content-Disposition'])
        
        # Check CSV content
        content = response.content.decode('utf-8')
        lines = content.split('\n')
        
        # Check header
        self.assertIn('Task ID', lines[0])
        self.assertIn('Title', lines[0])
        self.assertIn('Assignee', lines[0])
        self.assertIn('Status', lines[0])
        self.assertIn('Created Date', lines[0])
        self.assertIn('Due Date', lines[0])
        
        # Check data rows (should have 3 tasks)
        self.assertIn('Task 1', content)
        self.assertIn('Task 2', content)
        self.assertIn('Task 3', content)

    def test_csv_export_content_accuracy(self):
        """Test that CSV content matches task data."""
        response = self.client.post(
            reverse('export_tasks', args=[self.project.id])
        )
        
        content = response.content.decode('utf-8')
        csv_reader = csv.reader(content.splitlines())
        rows = list(csv_reader)
        
        # Skip header
        data_rows = rows[1:]
        
        # Should have 3 tasks
        self.assertEqual(len(data_rows), 3)
        
        # Check first task data
        task1_row = [row for row in data_rows if 'Task 1' in row][0]
        self.assertEqual(task1_row[0], str(self.task1.id))  # Task ID
        self.assertEqual(task1_row[1], 'Task 1')  # Title
        self.assertIn('testuser', task1_row[2])  # Assignee
        self.assertEqual(task1_row[3], 'To Do')  # Status (display name)
        
        # Check unassigned task
        task3_row = [row for row in data_rows if 'Task 3' in row][0]
        self.assertEqual(task3_row[2], 'Unassigned')

    def test_large_export_creates_job(self):
        """Test that large exports (1000+ tasks) create background jobs."""
        # Create 1000 additional tasks
        tasks = []
        for i in range(1000):
            tasks.append(Task(
                project=self.project,
                title=f'Task {i+4}',
                status='todo'
            ))
        Task.objects.bulk_create(tasks)
        
        # Should now have 1003 tasks total
        self.assertEqual(Task.objects.filter(project=self.project).count(), 1003)
        
        # Attempt export
        response = self.client.post(
            reverse('export_tasks', args=[self.project.id]),
            follow=True
        )
        
        # Should redirect back to settings with a message
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Export queued')
        
        # Should have created an export job
        export_job = ExportJob.objects.filter(
            project=self.project,
            user=self.user
        ).first()
        
        self.assertIsNotNone(export_job)
        self.assertEqual(export_job.status, 'pending')
        self.assertEqual(export_job.task_count, 1003)

    def test_export_job_model(self):
        """Test ExportJob model creation."""
        export_job = ExportJob.objects.create(
            project=self.project,
            user=self.user,
            status='pending',
            task_count=100
        )
        
        self.assertEqual(export_job.project, self.project)
        self.assertEqual(export_job.user, self.user)
        self.assertEqual(export_job.status, 'pending')
        self.assertEqual(export_job.task_count, 100)
        self.assertIsNone(export_job.completed_at)

    def test_task_model_str_method(self):
        """Test Task model string representation."""
        task = Task.objects.create(
            project=self.project,
            title='Test Task'
        )
        self.assertEqual(str(task), f'{task.id} - Test Task')

    def test_project_model_str_method(self):
        """Test Project model string representation."""
        self.assertEqual(str(self.project), 'Test Project')

    def test_export_requires_login(self):
        """Test that export views require authentication."""
        self.client.logout()
        
        # Try to access project settings
        response = self.client.get(
            reverse('project_settings', args=[self.project.id])
        )
        self.assertEqual(response.status_code, 302)  # Redirect to login
        
        # Try to export
        response = self.client.post(
            reverse('export_tasks', args=[self.project.id])
        )
        self.assertEqual(response.status_code, 302)  # Redirect to login

    def test_export_get_request_redirects(self):
        """Test that GET requests to export redirect to settings."""
        response = self.client.get(
            reverse('export_tasks', args=[self.project.id])
        )
        self.assertEqual(response.status_code, 302)
        self.assertIn(f'/projects/{self.project.id}/settings/', response.url)


class BackgroundExportTaskTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description'
        )
        
        # Create several tasks
        for i in range(5):
            Task.objects.create(
                project=self.project,
                title=f'Task {i+1}',
                assignee=self.user if i % 2 == 0 else None,
                status='todo'
            )

    def test_background_export_task(self):
        """Test the background export task functionality."""
        # Create export job
        export_job = ExportJob.objects.create(
            project=self.project,
            user=self.user,
            status='pending'
        )
        
        # Run the background task
        result = export_tasks_to_csv(export_job.id)
        
        # Refresh from database
        export_job.refresh_from_db()
        
        # Check job was completed
        self.assertEqual(export_job.status, 'completed')
        self.assertIsNotNone(export_job.file_path)
        self.assertIsNotNone(export_job.completed_at)
        self.assertEqual(export_job.task_count, 5)
        
        # Check file was created
        self.assertTrue(os.path.exists(export_job.file_path))
        
        # Verify CSV content
        with open(export_job.file_path, 'r') as f:
            csv_reader = csv.reader(f)
            rows = list(csv_reader)
            
            # Header + 5 tasks
            self.assertEqual(len(rows), 6)
            
            # Check header
            self.assertEqual(rows[0][0], 'Task ID')
            self.assertEqual(rows[0][1], 'Title')
            
        # Clean up test file
        if os.path.exists(export_job.file_path):
            os.remove(export_job.file_path)
