import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToggleCheckComponent } from '@shared/components/toggle-check/toggle-check.component';
import { FormElement } from '../interfaces/form-element.interface';

@Component({
  selector: 'app-input-checkbox-authorize-dynamic',
  imports: [ToggleCheckComponent],
  template: `
    <div class="checkbox-authorize">
      <app-toggle-check
        [checked]="control.value"
        [ariaLabel]="element.label ?? ''"
        (checkedChange)="onChange($event)" />
      <span class="checkbox-authorize__label">
        @if (element.validators?.required) {<span class="required-star" aria-hidden="true">*</span>}{{ element.label }}
      </span>
    </div>
  `,
  styles: [
    `
      .checkbox-authorize {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.25rem 0;
      }
      .checkbox-authorize__label {
        font-size: 0.825rem;
        line-height: 1.5;
        flex: 1;

        .required-star {
          color: #e53e3e;
          font-weight: 700;
          margin-right: 0.2rem;
        }
      }
    `,
  ],
})
export class InputCheckboxAuthorizeDynamicComponent implements OnChanges {
  @Input() element!: FormElement;
  @Input() form!: FormGroup;

  protected control!: FormControl;

  ngOnChanges(): void {
    this.control = this.form.get(this.element.id) as FormControl;
  }

  protected onChange(checked: boolean): void {
    this.control.setValue(checked);
    this.control.markAsTouched();
  }
}
