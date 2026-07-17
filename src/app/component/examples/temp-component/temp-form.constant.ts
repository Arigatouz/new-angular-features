import { TempUserFormData } from './temp-form.type';
import { signal, WritableSignal } from '@angular/core';

export const tempFormInitialization: WritableSignal<TempUserFormData> = signal({
  personalInfo: {
    firstName: '',
    lastName: '',
    emails: [''],
    phone: '',
    age: 10,
    gender: 'prefer-not-to-say',
    dateOfBirth: '',
  },
  accountInfo: {
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    isActive: true,
  },
  address: {
    street: '',
    city: '',
    state: '',
    zip: 0,
    country: '',
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
    email: '',
  },
  preferences: {
    newsletter: false,
    notifications: {
      email: false,
      sms: false,
      push: false,
    },
    theme: 'light',
    language: 'en',
  },
  skills: [],
  termsAccepted: false,
});
