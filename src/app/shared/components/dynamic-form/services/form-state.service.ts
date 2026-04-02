import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormState, FormStructure } from '../interfaces/form-element.interface';

@Injectable({ providedIn: 'root' })
export class FormStateService {
  private readonly stateSubject = new BehaviorSubject<FormState | null>(null);
  readonly state$: Observable<FormState | null> = this.stateSubject.asObservable();

  private current: FormState | null = null;

  initializeState(form: FormGroup, structure: FormStructure): void {
    this.current = {
      form,
      structure,
      isValid: form.valid,
      isSubmitted: false,
      values: form.value,
      errors: this.extractErrors(form),
    };
    this.stateSubject.next(this.current);

    form.valueChanges.subscribe(() => this.sync());
    form.statusChanges.subscribe(() => this.sync());
  }

  setSubmitted(): void {
    if (!this.current) return;
    this.current.isSubmitted = true;
    this.stateSubject.next(this.current);
  }

  resetForm(): void {
    if (!this.current) return;
    this.current.form.reset();
    this.current.isSubmitted = false;
    this.stateSubject.next(this.current);
  }

  getCurrentState(): FormState | null {
    return this.current;
  }

  private sync(): void {
    if (!this.current) return;
    this.current.isValid = this.current.form.valid;
    this.current.values = this.current.form.value;
    this.current.errors = this.extractErrors(this.current.form);
    this.stateSubject.next(this.current);
  }

  private extractErrors(form: FormGroup): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const key of Object.keys(form.controls)) {
      const ctrl = form.get(key);
      if (!ctrl?.errors || !ctrl.touched) continue;
      if (ctrl.errors['required']) errors[key] = 'Este campo é obrigatório';
      else if (ctrl.errors['email']) errors[key] = 'E-mail inválido';
      else if (ctrl.errors['minlength'])
        errors[key] = `Mínimo ${ctrl.errors['minlength'].requiredLength} caracteres`;
      else if (ctrl.errors['maxlength'])
        errors[key] = `Máximo ${ctrl.errors['maxlength'].requiredLength} caracteres`;
    }
    return errors;
  }
}
