import { Stack } from 'expo-router';

export default function PlatformsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Platforms' }}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ios" options={{ title: 'iOS Platform' }} />
      <Stack.Screen name="android" options={{ title: 'Android Platform' }}
        options={{
          // headerTransparent: true,
          // headerBackButtonDisplayMode: 'minimal',
          headerBackVisible: true,
          headerTintColor: '#000',
          headerStyle: { backgroundColor: '#A4C639', },
        }} />
      <Stack.Screen name="web" options={{ title: 'Web Platform' }} />
    </Stack>
  );
}