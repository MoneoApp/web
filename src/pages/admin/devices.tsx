import { Overview } from '../../components/devices/Overview';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Devices() {
  useAuthGuard();

  return (
    <div>
      moneo devices
      <Overview/>
    </div>
  );
}
