import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#18382c',
        tabBarInactiveTintColor: '#8b9891',
        tabBarStyle: { height: 70, paddingTop: 8, paddingBottom: 10 }
      }}>
        <Tabs.Screen name="index" options={{ title: '홈' }} />
        <Tabs.Screen name="word" options={{ title: '말씀' }} />
        <Tabs.Screen name="news" options={{ title: '소식' }} />
        <Tabs.Screen name="church" options={{ title: '교회' }} />
      </Tabs>
    </>
  );
}