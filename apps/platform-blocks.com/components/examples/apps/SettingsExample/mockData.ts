import { Settings, Profile } from './types';

export const initialSettings: Settings = {
  notifications: true,
  darkMode: false,
  autoSave: true,
  soundEffects: false,
  locationServices: true,
  dataSync: true,
  biometricAuth: false,
  newsletter: true
};

export const initialProfile: Profile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567'
};
