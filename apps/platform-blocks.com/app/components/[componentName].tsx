import { useLocalSearchParams } from 'expo-router';
import ComponentDetailScreen from '../../screens/ComponentDetailScreen'

export default function ComponentDetailPage() {
  const { componentName } = useLocalSearchParams<{
    componentName: string
  }>();

  return <ComponentDetailScreen component={componentName} />;
}
