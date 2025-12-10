# Production Configuration

## Environment Variables

For production deployment, set the following environment variables:

### Required
- `DJANGO_SECRET_KEY`: A secure secret key for Django (generate using `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- `DJANGO_DEBUG`: Set to `False` for production
- `DJANGO_ALLOWED_HOSTS`: Comma-separated list of allowed hostnames (e.g., `example.com,www.example.com`)

### Email Configuration
For production email notifications, configure these settings in `settings.py`:
- `EMAIL_BACKEND`: Use `django.core.mail.backends.smtp.EmailBackend`
- `EMAIL_HOST`: Your SMTP server
- `EMAIL_PORT`: SMTP port (typically 587 or 465)
- `EMAIL_HOST_USER`: SMTP username
- `EMAIL_HOST_PASSWORD`: SMTP password
- `EMAIL_USE_TLS`: Set to `True` for TLS
- `DEFAULT_FROM_EMAIL`: Default sender email address

### Celery Configuration
For production, use a proper message broker instead of memory:
- Install Redis: `pip install redis`
- Update `CELERY_BROKER_URL` to `redis://localhost:6379/0`
- Update `CELERY_RESULT_BACKEND` to `redis://localhost:6379/0`
- Run Celery worker: `celery -A subsmanager worker -l info`

## Example Production Settings

```bash
export DJANGO_SECRET_KEY="your-very-secret-key-here"
export DJANGO_DEBUG="False"
export DJANGO_ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
```

## Security Checklist

- [ ] Generate and set a unique `DJANGO_SECRET_KEY`
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Configure specific domains in `DJANGO_ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper email backend (SMTP)
- [ ] Set up Redis for Celery (instead of in-memory broker)
- [ ] Configure database backups
- [ ] Set up proper logging
- [ ] Review and update CORS settings if needed
- [ ] Enable CSRF protection (enabled by default)
