import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputTextDynamicComponent } from '../field-components/input-text-dynamic.component';
import { InputEmailDynamicComponent } from '../field-components/input-email-dynamic.component';
import { InputSelectDynamicComponent } from '../field-components/input-select-dynamic.component';
import { InputUploadDynamicComponent } from '../field-components/input-upload-dynamic.component';
import { InputCheckboxAuthorizeDynamicComponent } from '../field-components/input-checkbox-authorize-dynamic.component';

// ── Component registry ──────────────────────────────────────────────────────
// To add a new field type: create a component and register it here.
// No other file needs to change.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENTS: Record<string, Type<any>> = {
  text: InputTextDynamicComponent,
  email: InputEmailDynamicComponent,
  select: InputSelectDynamicComponent,
  uploadFile: InputUploadDynamicComponent,
  checkboxAuthorize: InputCheckboxAuthorizeDynamicComponent,
  // Register new field types here ↑
};

export const INPUT_FORM_CONTROLS: FormElement['type'][] = [
  'text',
  'email',
  'select',
  'checkbox',
  'checkboxAuthorize',
  'uploadFile',
];

// ── Interfaces ──────────────────────────────────────────────────────────────

export type FormElementType =
  | 'text'
  | 'email'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'checkboxAuthorize'
  | 'uploadFile'
  | 'textHTML';

export interface FormElementValidators {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  erroRequired?: string;
  erroMinLength?: string;
  erroMaxLength?: string;
  accept?: string;
  multiple?: boolean;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

export interface FormElement {
  id: string;
  type: FormElementType;
  label?: string;
  placeholder?: string;
  value?: unknown;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  options?: { name: string; code: string }[];
  validators?: FormElementValidators;
  classes?: string[];
}

export interface FormStructure {
  id: string;
  title?: string;
  elements: FormElement[];
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface FormState {
  form: FormGroup;
  structure: FormStructure;
  isValid: boolean;
  isSubmitted: boolean;
  values: unknown;
  errors: Record<string, string>;
}
