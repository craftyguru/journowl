// Route to appropriate dashboard based on interface mode

import { useState } from 'react';
import { InterfaceMode } from '@/lib/modes';
import WellnessDashboard from './WellnessDashboard';
import ProductivityDashboard from './ProductivityDashboard';
import TraderDashboard from './TraderDashboard';
import TeamDashboard from './TeamDashboard';
import ManagerDashboard from './ManagerDashboard';
import HRAdminConsole from './HRAdminConsole';
import TherapyDashboard from './TherapyDashboard';
import { Button } from '@/components/ui/button';

interface ModeDashboardProps {
  mode: InterfaceMode;
  user: any;
  stats: any;
  entries: any[];
  onNewEntry: () => void;
}

export function ModeDashboard({ mode, user, stats, entries, onNewEntry }: ModeDashboardProps) {
  const [teamView, setTeamView] = useState<'employee' | 'manager' | 'admin'>('employee');

  // For team mode, allow switching between employee/manager/admin views
  if (mode === 'team') {
    return (
      <div className="space-y-4">
        {/* Role Switcher */}
        <div className="flex gap-2">
          <Button
            onClick={() => setTeamView('employee')}
            variant={teamView === 'employee' ? 'default' : 'outline'}
            className="text-sm"
            data-testid="button-employee-view"
          >
            Employee View
          </Button>
          <Button
            onClick={() => setTeamView('manager')}
            variant={teamView === 'manager' ? 'default' : 'outline'}
            className="text-sm"
            data-testid="button-manager-view"
          >
            Manager View
          </Button>
          <Button
            onClick={() => setTeamView('admin')}
            variant={teamView === 'admin' ? 'default' : 'outline'}
            className="text-sm"
            data-testid="button-admin-view"
          >
            HR Admin
          </Button>
        </div>

        {/* Render appropriate view */}
        {teamView === 'employee' && <TeamDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />}
        {teamView === 'manager' && <ManagerDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />}
        {teamView === 'admin' && <HRAdminConsole user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />}
      </div>
    );
  }

  switch (mode) {
    case 'wellness':
      return <WellnessDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'productivity':
      return <ProductivityDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'trader':
      return <TraderDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    case 'therapy':
      return <TherapyDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
    default:
      return <WellnessDashboard user={user} stats={stats} entries={entries} onNewEntry={onNewEntry} />;
  }
}
