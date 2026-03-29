import { useLocalSearchParams } from 'expo-router';
import ChartDetailScreen from '../../screens/ChartDetailScreen';

export default function ChartDetailPage() {
  const { chartName } = useLocalSearchParams<{ chartName: string }>();
  return <ChartDetailScreen chart={chartName} />;
}
