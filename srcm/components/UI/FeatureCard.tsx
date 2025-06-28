import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  iconBg = 'from-blue-500 to-blue-600'
}) => {
  return (
    <div className="card group text-center">
      <div className="card-body">
        <div className={`w-16 h-16 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-bounce text-white`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};