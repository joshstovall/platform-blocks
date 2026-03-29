import { useLocalSearchParams } from 'expo-router';
import ExampleDetailScreen from '../../screens/ExampleDetailScreen';

export default function ExampleDetailPage() {
  const { exampleName } = useLocalSearchParams<{
    exampleName: string
  }>();

  return <ExampleDetailScreen category={exampleName} />
}
