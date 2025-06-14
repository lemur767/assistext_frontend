import React from 'react';
import { Users } from 'lucide-react';

const AISettings: React.FC = () => {
  return (
    <div className="card p-6 text-center">
      <Users className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-primary mb-2">Client Management</h2>
      <p className="text-muted">Client contact management and analytics</p>
    </div>
  );
};

export default AISettings;