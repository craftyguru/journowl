// Route to appropriate dashboard based on interface mode

import { InterfaceMode } from '@/lib/modes';
import WellnessDashboard from './WellnessDashboard';
import ProductivityDashboard from './ProductivityDashboard';
import TraderDashboard from './TraderDashboard';
import TeamDashboard from './TeamDashboard';
import TherapyDashboard from './TherapyDashboard';

interface ModeDashboardProps {
  mode: InterfaceMode;
  user: any;
  stats: any;
  entries: any[];
  onNewEntry: () => void;
}

export function ModeDashboard({ mode, user, stats, entries, onNewEntry }: ModeDashboardProps) {
  switch (mode) {
    case 'wellness':
      return <WellnessDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'productivity':
      return <ProductivityDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'trader':
      return <TraderDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'team':
      return <TeamDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'therapy':
      return <TherapyDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    default:
      return <WellnessDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
  }
}
