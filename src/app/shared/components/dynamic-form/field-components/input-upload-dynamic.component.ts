import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonUploadComponent } from '@shared/components/button-upload/button-upload.component';
import { FormElement } from '../interfaces/form-element.interface';

@Component({
  selector: 'app-input-upload-dynamic',
  imports: [ButtonUploadComponent],
  template: `
    <div class="upload-field">
      @if (element.label) {
        <label class="upload-field__label">
            @if (element.validators?.required) {<span class="required-star" aria-hidden="true">*</span>}{{ element.label }}
          </label>
      }
      <app-button-upload
        [accept]="element.validators?.accept ?? ''"
        [maxFileSizeMB]="element.validators?.maxFileSizeMB ?? 15"
        [multiple]="element.validators?.multiple ?? false"
        (fileChange)="onFileChange($event)" />
    </div>
  `,
  styles: [
    `
      .upload-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .upload-field__label {
        font-size: 0.875rem;
        font-weight: 500;

        .required-star {
          color: #e53e3e;
          font-weight: 700;
          margin-right: 0.2rem;
        }
      }
    `,
  ],
})
export class InputUploadDynamicComponent implements OnChanges {
  @Input() element!: FormElement;
  @Input() form!: FormGroup;

  protected control!: FormControl;

  ngOnChanges(): void {
    this.control = this.form.get(this.element.id) as FormControl;
  }

  protected onFileChange(file: File | null): void {
    this.control.setValue(file?.name ?? null);
    this.control.markAsTouched();
  }
}
