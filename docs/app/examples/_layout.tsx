import { Stack } from 'expo-router';

export default function ExamplesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Examples' }} />
      <Stack.Screen name="[exampleName]" options={{ title: 'Example Detail' }} />
    </Stack>
  );
}
