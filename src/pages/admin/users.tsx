import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Users() {
  useAuthGuard();

  return (
    <div>
      moneo users
    </div>
  );
}
