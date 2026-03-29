export interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
  soundEffects: boolean;
  locationServices: boolean;
  dataSync: boolean;
  biometricAuth: boolean;
  newsletter: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
}
