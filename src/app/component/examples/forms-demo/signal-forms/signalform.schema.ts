import {
  applyEach,
  createMetadataKey,
  email,
  maxLength,
  metadata,
  minLength,
  PathKind,
  required,
  schema,
  Schema,
  SchemaPathTree,
  validate,
  validateAsync,
} from '@angular/forms/signals';
import { ProfileModel } from './signal-forms';
export const PLACEHOLDER = createMetadataKey<string>();

const PLACEHOLDERS = new Map<keyof ProfileModel, string>([
  ['username', 'e.g. angular_dev'],
  ['email', 'you@example.com'],
  ['bio', 'Tell us about yourself...'],
]);

export const signalFormSchema: Schema<ProfileModel> = schema<ProfileModel>((path) => {
  addPlaceHolders(path);
  required(path.username, { message: 'Username is required' });
  minLength(path.username, 3, { message: 'At least 3 characters' });
  // maxLength(path.username, 10, { message: 'Max 10 characters' });
  required(path.email, { message: 'Email is required' });
  email(path.email, { message: 'Enter a valid email address' });
  required(path.role, { message: 'Please select a role' });
  maxLength(path.bio, 200, { message: 'Bio must be 200 characters or less' });
  validate(path.username, (childField) => {
    return childField.value().length > 10
      ? { kind: 'maxLength', message: 'Max 10 characters' }
      : undefined;
  });
  applyEach(path, (childField) => {
    for (let item in path.username){
      console.log(item);
    }
    console.log(path.username);
    for (let pathKey in path) {
      console.log(pathKey);

    }
  })
});

const addPlaceHolders = (path: SchemaPathTree<ProfileModel>) => {
  for (const [key, text] of PLACEHOLDERS) {
    metadata(path[key], PLACEHOLDER, () => text);
  }
};
