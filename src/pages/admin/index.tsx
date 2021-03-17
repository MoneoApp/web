import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Admin() {
  useAuthGuard();

  return (
    <div>
      moneo admin
    </div>
  );
}
