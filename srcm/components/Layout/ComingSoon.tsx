interface ComingSoonPageProps {
  title: string;
  icon: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-6">{icon}</div>
        <h1 className="text-3xl font-bold text-theme mb-4">{title}</h1>
        <p className="text-lg text-neutral-500 mb-8 max-w-md">
          This feature is coming soon. We're working hard to bring you the best SMS AI experience.
        </p>
        <div className="bg-primary/10 dark:bg-primary-dark/20 border border-primary/20 dark:border-primary-dark/20 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-theme mb-2">Want early access?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Join our beta program and be the first to try new features.
          </p>
          <button className="btn btn-primary w-full">
            Join Beta Program
          </button>
        </div>
      </div>
    </div>
  );
};