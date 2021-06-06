import { Construction } from '../../components/Construction';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Admin() {
  useAuthGuard();

  return (
    <Construction/>
  );
}
