import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Devices() {
  useAuthGuard();

  return (
    <div>
      moneo devices
    </div>
  );
}
