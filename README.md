# SubsManager

A Django-based subscription/task management system with CSV export capabilities.

## Features

- Project and task management
- User assignment and task tracking
- **CSV Export Functionality**:
  - Export tasks to CSV with: Task ID, Title, Assignee, Status, Created Date, Due Date
  - Immediate download for small exports (< 1000 tasks)
  - Background processing for large exports (1000+ tasks)
  - Email notifications when large exports are ready
  - Export history tracking

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dannioliver-lab/SubsManager.git
cd SubsManager
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

6. Access the application at `http://localhost:8000`

### Using CSV Export

1. Navigate to a project's page
2. Click on "Project Settings & Export"
3. Click the "Export Tasks to CSV" button
4. For small exports (< 1000 tasks), the CSV will download immediately
5. For large exports (1000+ tasks), you'll receive an email when the export is ready

## Running Tests

```bash
python manage.py test projects
```

## Project Structure

```
SubsManager/
├── manage.py
├── subsmanager/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── celery.py        # Celery configuration for background tasks
└── projects/            # Main application
    ├── models.py        # Project, Task, and ExportJob models
    ├── views.py         # Views for export functionality
    ├── tasks.py         # Celery tasks for background export
    ├── admin.py         # Admin interface
    ├── tests.py         # Test suite
    └── templates/       # HTML templates
```

## Technologies Used

- Django 5.0+
- Celery (for background task processing)
- SQLite (database)
- Python 3.12+