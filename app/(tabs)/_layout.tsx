import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { House, Camera, BookOpen, User } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2a8540',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#d5f3dc',
          borderTopWidth: 1,
          borderTopColor: '#2a8540',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 32 : 16,
          height: Platform.OS === 'ios' ? 88 : 80,
          paddingHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          marginBottom: Platform.OS === 'android' ? 8 : 0,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'android' ? 4 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ size, color }) => (
            <House size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: t('nav.scan'),
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: t('nav.recipes'),
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}