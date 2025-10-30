import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Button, Input, Switch, Flex, Icon, useTheme, Divider, Alert } from '@platform-blocks/ui';
import { Settings, Profile } from './types';
import { initialSettings, initialProfile } from './mockData';
import { PageWrapper } from 'components/PageWrapper';

export function SettingsExample() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const theme = useTheme();

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateProfile = (key: keyof typeof profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      flex: 1,
      overflow: 'hidden'
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3],
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      marginBottom: 16,
    },
    settingItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    profileCard: {
      padding: 16,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary[5],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    dangerZone: {
      borderWidth: 1,
      borderColor: theme.colors.error[5],
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.error[9] : theme.colors.error[0],
    }
  });

  return (
    <PageWrapper>
      <View style={dynamicStyles.header}>
        <Flex direction="row" align="center" justify="space-between">
          <View>
            <Text size="2xl" weight="bold">
              Settings
            </Text>
            <Text color="muted" style={{ marginTop: 4 }}>
              Manage your account and app preferences
            </Text>
          </View>
          <Button 
            variant="outline" 
            title="Save Changes"
            size="sm"
            startIcon={<Icon name="check" size="sm" />}
            onPress={() => {}}
          />
        </Flex>
      </View>

      <ScrollView style={dynamicStyles.content}>
        {/* Profile Section */}
        <View style={dynamicStyles.section}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            Profile Information
          </Text>
          
          <Card style={dynamicStyles.profileCard} variant="outline">
            <Flex direction="row" align="center" style={{ marginBottom: 20 }}>
              <View style={dynamicStyles.avatar}>
                <Text size="xl" color="white" weight="bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text size="lg" weight="semibold">
                  {profile.name}
                </Text>
                <Text color="muted">
                  {profile.email}
                </Text>
                <Button 
                  variant="outline" 
                  title="Change Avatar"
                  size="sm"
                  style={{ marginTop: 8, alignSelf: 'flex-start' }}
                  onPress={() => {}}
                />
              </View>
            </Flex>

            <View style={dynamicStyles.inputGroup}>
              <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>
                Full Name
              </Text>
              <Input
                value={profile.name}
                onChangeText={(value) => updateProfile('name', value)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={dynamicStyles.inputGroup}>
              <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>
                Email Address
              </Text>
              <Input
                value={profile.email}
                onChangeText={(value) => updateProfile('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={dynamicStyles.inputGroup}>
              <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>
                Phone Number
              </Text>
              <Input
                value={profile.phone}
                onChangeText={(value) => updateProfile('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          </Card>
        </View>

        {/* Notification Preferences */}
        <View style={dynamicStyles.section}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            Notifications
          </Text>
          
          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Push Notifications</Text>
                <Text size="sm" color="muted">
                  Receive notifications about updates and messages
                </Text>
              </View>
              <Switch
                checked={settings.notifications}
                onChange={() => updateSetting('notifications')}
              />
            </Flex>
          </Card>

          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Newsletter</Text>
                <Text size="sm" color="muted">
                  Get weekly updates and product news
                </Text>
              </View>
              <Switch
                checked={settings.newsletter}
                onChange={() => updateSetting('newsletter')}
              />
            </Flex>
          </Card>
        </View>

        {/* App Preferences */}
        <View style={dynamicStyles.section}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            App Preferences
          </Text>
          
          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Dark Mode</Text>
                <Text size="sm" color="muted">
                  Use dark theme throughout the app
                </Text>
              </View>
              <Switch
                checked={settings.darkMode}
                onChange={() => updateSetting('darkMode')}
              />
            </Flex>
          </Card>

          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Auto-Save</Text>
                <Text size="sm" color="muted">
                  Automatically save your work
                </Text>
              </View>
              <Switch
                checked={settings.autoSave}
                onChange={() => updateSetting('autoSave')}
              />
            </Flex>
          </Card>

          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Sound Effects</Text>
                <Text size="sm" color="muted">
                  Play sounds for interactions
                </Text>
              </View>
              <Switch
                checked={settings.soundEffects}
                onChange={() => updateSetting('soundEffects')}
              />
            </Flex>
          </Card>
        </View>

        {/* Privacy & Security */}
        <View style={dynamicStyles.section}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            Privacy & Security
          </Text>
          
          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Location Services</Text>
                <Text size="sm" color="muted">
                  Allow app to access your location
                </Text>
              </View>
              <Switch
                checked={settings.locationServices}
                onChange={() => updateSetting('locationServices')}
              />
            </Flex>
          </Card>

          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Data Sync</Text>
                <Text size="sm" color="muted">
                  Sync data across your devices
                </Text>
              </View>
              <Switch
                checked={settings.dataSync}
                onChange={() => updateSetting('dataSync')}
              />
            </Flex>
          </Card>

          <Card style={dynamicStyles.settingItem} variant="outline">
            <Flex direction="row" align="center" justify="space-between">
              <View style={{ flex: 1 }}>
                <Text weight="semibold">Biometric Authentication</Text>
                <Text size="sm" color="muted">
                  Use Touch ID or Face ID to unlock
                </Text>
              </View>
              <Switch
                checked={settings.biometricAuth}
                onChange={() => updateSetting('biometricAuth')}
              />
            </Flex>
          </Card>

          <Flex direction="row" gap={12} style={{ marginTop: 16 }}>
            <Button 
              variant="outline" 
              title="Change Password"
              style={{ flex: 1 }}
              startIcon={<Icon name="eye" size="sm" />}
              onPress={() => {}}
            />
            <Button 
              variant="outline" 
              title="Two-Factor Auth"
              style={{ flex: 1 }}
              startIcon={<Icon name="check" size="sm" />}
              onPress={() => {}}
            />
          </Flex>
        </View>

        {/* Support */}
        <View style={dynamicStyles.section}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            Support
          </Text>
          
          <Flex direction="row" gap={12}>
            <Button 
              variant="outline" 
              title="Help Center"
              style={{ flex: 1 }}
              startIcon={<Icon name="chevronRight" size="sm" />}
              onPress={() => {}}
            />
            <Button 
              variant="outline" 
              title="Contact Us"
              style={{ flex: 1 }}
              startIcon={<Icon name="chevronRight" size="sm" />}
              onPress={() => {}}
            />
          </Flex>
        </View>

        {/* Danger Zone */}
        <Alert sev='error'>
          <Flex direction="column" align="center" justify="space-between" style={{ marginBottom: 16 }}>
          <Text size="lg" weight="semibold" style={dynamicStyles.sectionTitle}>
            Danger Zone
          </Text>
          
          {/* <View style={dynamicStyles.dangerZone}> */}
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Delete Account
            </Text>
            <Text size="sm" color="muted" style={{ marginBottom: 16 }}>
              Once you delete your account, there is no going back. Please be certain.
            </Text>
            <Button 
              variant="outline" 
              title="Delete My Account"
              color="error"
              startIcon={<Icon name="trash" size="sm" />}
              onPress={() => {}}
            />
          {/* </View> */}
          </Flex>
        </Alert>
      </ScrollView>
      </PageWrapper>
  );
}
