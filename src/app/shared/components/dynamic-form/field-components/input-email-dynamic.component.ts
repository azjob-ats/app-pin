import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { FormElement } from '../interfaces/form-element.interface';

@Component({
  selector: 'app-input-email-dynamic',
  imports: [ReactiveFormsModule, InputComponent],
  template: `
    <app-input
      [formControl]="control"
      [label]="element.label ?? ''"
      [placeholder]="element.placeholder ?? ''"
      [required]="element.validators?.required ?? false"
      type="email" />
  `,
})
export class InputEmailDynamicComponent implements OnChanges {
  @Input() element!: FormElement;
  @Input() form!: FormGroup;

  protected control!: FormControl;

  ngOnChanges(): void {
    this.control = this.form.get(this.element.id) as FormControl;
  }
}
