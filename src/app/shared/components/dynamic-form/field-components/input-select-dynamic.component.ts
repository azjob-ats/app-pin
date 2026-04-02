import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { FormElement } from '../interfaces/form-element.interface';

@Component({
  selector: 'app-input-select-dynamic',
  imports: [ReactiveFormsModule, SelectComponent],
  template: `
    <app-select
      [formControl]="control"
      [label]="element.label ?? ''"
      [placeholder]="element.placeholder ?? ''"
      [options]="options"
      [required]="element.validators?.required ?? false" />
  `,
})
export class InputSelectDynamicComponent implements OnChanges {
  @Input() element!: FormElement;
  @Input() form!: FormGroup;

  protected control!: FormControl;
  protected options: SelectOption[] = [];

  ngOnChanges(): void {
    this.control = this.form.get(this.element.id) as FormControl;
    this.options = (this.element.options ?? []).map((o) => ({ value: o.code, label: o.name }));
  }
}
