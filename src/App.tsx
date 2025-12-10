import { Header } from './components/Header/Header';
import { RecentActivity } from './components/RecentActivity/RecentActivity';
import { QuickActions } from './components/QuickActions/QuickActions';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content" role="main">
        <div className="content-wrapper">
          <section className="hero-section">
            <h1 className="hero-title">Welcome back!</h1>
            <p className="hero-subtitle">
              Manage your subscriptions and stay on top of your spending.
            </p>
          </section>
          
          <div className="widgets-grid">
            <div className="widget-column">
              <QuickActions />
            </div>
            <div className="widget-column">
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
