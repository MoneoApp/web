import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Support() {
  useAuthGuard();

  return (
    <div>
      moneo support
    </div>
  );
}
