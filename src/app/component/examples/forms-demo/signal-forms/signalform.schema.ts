import {
  email,
  maxLength,
  minLength,
  PathKind,
  required,
  schema,
  Schema, validateAsync,
} from '@angular/forms/signals';
import { ProfileModel } from './signal-forms';

export const signalFormSchema: Schema<ProfileModel> = schema<ProfileModel>((path) => {
  required(path.username, { message: 'Username is required' });
  minLength(path.username, 3, { message: 'At least 3 characters' });
  maxLength(path.username, 20, { message: 'Max 20 characters' });

  required(path.email, { message: 'Email is required' });
  email(path.email, { message: 'Enter a valid email address' });
 // validateAsync(path.email, {
 //  
 // })
  required(path.role, { message: 'Please select a role' });

  maxLength(path.bio, 200, { message: 'Bio must be 200 characters or less' });
});
