import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Heart, ShoppingCart, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { t } = useLanguage();

  const menuItems = [
    {
      id: 1,
      title: t('profile.savedRecipes'),
      subtitle: t('profile.savedRecipes.desc'),
      icon: Heart,
      onPress: () => console.log('Saved recipes'),
    },
    {
      id: 2,
      title: t('profile.shoppingList'),
      subtitle: t('profile.shoppingList.desc'),
      icon: ShoppingCart,
      onPress: () => console.log('Shopping list'),
    },
    {
      id: 3,
      title: t('profile.dietary'),
      subtitle: t('profile.dietary.desc'),
      icon: Settings,
      onPress: () => console.log('Dietary preferences'),
    },
    {
      id: 4,
      title: t('profile.help'),
      subtitle: t('profile.help.desc'),
      icon: HelpCircle,
      onPress: () => console.log('Help & Support'),
    },
  ];

  const stats = [
    {
      label: t('profile.stats.tried'),
      value: '23',
      color: '#2a8540',
    },
    {
      label: t('profile.stats.favorites'),
      value: '12',
      color: '#4ECDC4',
    },
    {
      label: t('profile.stats.scanned'),
      value: '89',
      color: '#45B7D1',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#2a8540', '#1e6b32']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.userName}>{t('profile.name')}</Text>
            <Text style={styles.userEmail}>{t('profile.email')}</Text>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          
          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#4ECDC4' }]}>
                <Bell size={20} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{t('profile.notifications')}</Text>
                <Text style={styles.settingSubtitle}>{t('profile.notifications.desc')}</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#2a8540' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#BDC3C7'}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
          
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#F8F9FA' }]}>
                  <item.icon size={20} color="#7F8C8D" strokeWidth={2} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#BDC3C7" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Student Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.studentTips')}</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>{t('profile.studyTip')}</Text>
            <Text style={styles.tipText}>
              {t('profile.studyTip.text')}
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#E74C3C" strokeWidth={2} />
          <Text style={styles.logoutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>{t('profile.version')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5f3dc',
  },
  profileHeader: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#2C3E50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  logoutText: {
    fontSize: 16,
    color: '#E74C3C',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 24,
  },
});