import { useAllIncompleteProcesses } from '@/hooks/useAllIncompleteProcesses';
import { ContinueProcessCard } from './ContinueProcessCard';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

export const AllIncompleteProcesses = () => {
  const { processes, loading } = useAllIncompleteProcesses();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (processes.length === 0) {
    return null;
  }

  const handleContinue = (activeProcess: string, lastLocation: string | null) => {
    // Navigate to the appropriate feature based on active process
    const routes: Record<string, string> = {
      'Palace Study': '/palace',
      'Daily Devotional': '/devotional',
      'Memory Palace': '/memory-palace'
    };

    const route = routes[activeProcess] || '/dashboard';
    navigate(route, { state: { resumeLocation: lastLocation } });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Continue Where You Left Off</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {processes.map((process) => (
          <ContinueProcessCard
            key={process.id}
            featureName={process.active_process || 'Unknown Process'}
            stepName={process.last_location || 'In Progress'}
            stepNumber={process.process_step || 1}
            totalSteps={process.process_total_steps || 1}
            lastAccessedAt={process.last_timestamp || new Date().toISOString()}
            onContinue={() => handleContinue(process.active_process || '', process.last_location)}
          />
        ))}
      </div>
    </div>
  );
};
