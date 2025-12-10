import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import './RecentActivity.css';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'payment' | 'renewal' | 'cancellation';
}

// Simulated data - in a real app, this would come from an API
const mockActivities: Activity[] = [
  {
    id: 1,
    title: 'Netflix Premium',
    description: 'Monthly payment processed',
    date: '2 hours ago',
    type: 'payment'
  },
  {
    id: 2,
    title: 'Spotify Family',
    description: 'Subscription renewed',
    date: '1 day ago',
    type: 'renewal'
  },
  {
    id: 3,
    title: 'Adobe Creative Cloud',
    description: 'Payment processed',
    date: '3 days ago',
    type: 'payment'
  }
];

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'payment':
        return '💳';
      case 'renewal':
        return '🔄';
      case 'cancellation':
        return '❌';
    }
  };

  if (isLoading) {
    return (
      <section className="recent-activity" aria-label="Recent Activity">
        <h2 className="widget-title">Recent Activity</h2>
        <div className="activity-list">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="recent-activity" aria-label="Recent Activity">
        <h2 className="widget-title">Recent Activity</h2>
        <div className="empty-state" role="status">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No Recent Activity</h3>
          <p className="empty-state-description">
            Your subscription activity will appear here once you add your first subscription.
          </p>
          <button className="cta-button" type="button">
            Add Your First Subscription
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-activity" aria-label="Recent Activity">
      <h2 className="widget-title">Recent Activity</h2>
      <div className="activity-list">
        {activities.map(activity => (
          <article key={activity.id} className="activity-item">
            <div className="activity-icon" aria-hidden="true">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <h3 className="activity-title">{activity.title}</h3>
              <p className="activity-description">{activity.description}</p>
            </div>
            <time className="activity-date" dateTime={activity.date}>
              {activity.date}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
