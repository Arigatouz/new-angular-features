import { resource } from '@angular/core';
import {
  required,
  schema,
  min,
  minLength,
  applyEach,
  pattern,
  apply,
  validate,
  validateAsync,
} from '@angular/forms/signals';
import { TempUserFormData } from './temp-form.type';

const REGISTERED_PHONE_NUMBERS = ['01020003587', '01555223587'];

export const tempFormSchema = schema<TempUserFormData>((path) => {
  required(path.personalInfo.firstName, { message: 'First name is required' });
  minLength(path.personalInfo.firstName, 3, {
    message: 'First name must be at least 3 characters',
  });
  min(path.personalInfo.age, 10, { message: 'Age must be at least 10' });


  applyEach(path.personalInfo.emails, (email) => {
    pattern(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email format' });
    required(email, { message: 'Email is required' });
    validate(
      email,
      ({ value, valueOf, fieldTreeOf, fieldTree, key, index, pathKeys, state, stateOf }) => {
        const allEmails = valueOf(path.personalInfo.emails);

        // console.log({ value: value() });
        // console.log({ valueOf: valueOf(path.personalInfo.emails) });
        // console.log({ fieldTreeOf: fieldTreeOf(path.personalInfo.firstName) });
        // console.log({ key: key() });
        // console.log({ index: index() });
        // console.log({ pathKeys: pathKeys() });
        // console.log({ state: state.required() });
        // console.log({ stateOf: stateOf(path.personalInfo.firstName).required() });
        // console.log({ fieldTree: fieldTree() });

        return allEmails.filter((email) => email === value()).length > 1
          ? { kind: 'duplicateEmail', message: 'Email is duplicated' }
          : null;
      },
    );
  });


  validateAsync(path.personalInfo.phone, {
    params: ({ value }) => value(),
    when: ({ value  }) => value().trim().length > 0,
    debounce: 500,
    factory: (params) =>
      resource({
        params: () => params(),
        loader: async ({ params }) => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return REGISTERED_PHONE_NUMBERS.includes(params);
        },
      }),
    onSuccess: (isRegistered) =>
      isRegistered
        ? { kind: 'phoneTaken', message: 'This phone number is already registered' }
        : null,
    onError: () => ({ kind: 'phoneCheckFailed', message: 'Could not verify this phone number' }),
  });
});


// type PartialTempUserFormData = {
//   [K in keyof TempUserFormData]: TempUserFormData[K] extends object ? Partial<TempUserFormData[K]> : TempUserFormData[K];
// }
//
// type DotKeys<T> = {
//   [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${DotKeys<T[K]>}` | K : K;
// }[keyof T & string];
//
// const PLACEHOLDERS = new Map<DotKeys<PartialTempUserFormData>, string>([
//   ['personalInfo.firstName', 'Enter personal information'],
// ]);

