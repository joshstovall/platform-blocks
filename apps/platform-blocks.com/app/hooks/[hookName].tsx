import { useLocalSearchParams } from 'expo-router';
import HookDetailScreen from '../../screens/HookDetailScreen';

export default function HookDetailPage() {
  const params = useLocalSearchParams<{ hookName?: string | string[] }>();
  const value = params?.hookName;
  const hookName = Array.isArray(value) ? value[0] : value;

  return <HookDetailScreen hook={hookName} />;
}
