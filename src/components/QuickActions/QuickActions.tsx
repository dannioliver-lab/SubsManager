import './QuickActions.css';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

const actions: QuickAction[] = [
  {
    id: 'add-subscription',
    title: 'Add Subscription',
    description: 'Track a new subscription',
    icon: '➕',
    href: '#add'
  },
  {
    id: 'view-all',
    title: 'View All',
    description: 'See all subscriptions',
    icon: '📋',
    href: '#all'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'View spending insights',
    icon: '📊',
    href: '#analytics'
  },
  {
    id: 'reminders',
    title: 'Reminders',
    description: 'Manage payment alerts',
    icon: '🔔',
    href: '#reminders'
  }
];

export function QuickActions() {
  return (
    <section className="quick-actions" aria-label="Quick Actions">
      <h2 className="widget-title">Quick Actions</h2>
      <div className="actions-grid">
        {actions.map(action => (
          <a
            key={action.id}
            href={action.href}
            className="action-card"
            aria-label={`${action.title}: ${action.description}`}
          >
            <div className="action-icon" aria-hidden="true">
              {action.icon}
            </div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
