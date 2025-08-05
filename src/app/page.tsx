import Dashboard from '@/components/Dashboard';
import { MapboxDrawProvider } from '@/providers/MapboxDrawProvider';

export default function Home() {
  return (
    <MapboxDrawProvider>
      <Dashboard />
    </MapboxDrawProvider>
  );
}