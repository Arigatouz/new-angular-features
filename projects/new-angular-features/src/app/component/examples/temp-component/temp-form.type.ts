export type TempUserGender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export type TempUserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface TempUserAddress {
  street: string;
  city: string;
  state: string;
  zip: number;
  country: string;
}

export interface TempUserEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface TempUserPreferences {
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface TempUserFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    emails: Array<string>;
    phone: string;
    age: number;
    gender: TempUserGender;
    dateOfBirth: string;
  };
  accountInfo: {
    username: string;
    password: string;
    confirmPassword: string;
    role: TempUserRole;
    isActive: boolean;
  };
  address: TempUserAddress;
  emergencyContact: TempUserEmergencyContact;
  preferences: TempUserPreferences;
  skills: string[];
  termsAccepted: boolean;
}
