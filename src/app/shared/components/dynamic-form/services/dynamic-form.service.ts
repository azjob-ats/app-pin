import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FormElement,
  FormStructure,
  INPUT_FORM_CONTROLS,
} from '../interfaces/form-element.interface';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {
  private readonly fb = inject(FormBuilder);

  createForm(structure: FormStructure): FormGroup {
    const controls: Record<string, unknown> = {};

    for (const element of structure.elements) {
      if (this.isFormControl(element)) {
        controls[element.id] = [element.defaultValue ?? element.value ?? '', this.buildValidators(element)];
      }
    }

    return this.fb.group(controls);
  }

  validateStructure(structure: FormStructure): boolean {
    return (
      Array.isArray(structure.elements) &&
      structure.elements.length > 0 &&
      structure.elements.every((el) => el.id && el.type)
    );
  }

  isFormControl(element: FormElement): boolean {
    return INPUT_FORM_CONTROLS.includes(element.type as (typeof INPUT_FORM_CONTROLS)[number]);
  }

  private buildValidators(element: FormElement) {
    const v = element.validators;
    if (!v) return [];

    const fns = [];
    if (v.required) fns.push(Validators.required);
    if (v.minLength) fns.push(Validators.minLength(v.minLength));
    if (v.maxLength) fns.push(Validators.maxLength(v.maxLength));
    if (v.pattern) fns.push(Validators.pattern(v.pattern));
    if (v.email) fns.push(Validators.email);
    return fns;
  }
}
