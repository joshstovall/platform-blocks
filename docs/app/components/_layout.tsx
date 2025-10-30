import { Stack } from 'expo-router';

export default function ComponentsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Components' }} />
      <Stack.Screen name="[componentName]" options={{ title: 'Component Detail' }} />
    </Stack>
  );
}
