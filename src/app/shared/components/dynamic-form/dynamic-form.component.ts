import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DynamicFieldDirective } from './directives/dynamic-field.directive';
import { DynamicFormService } from './services/dynamic-form.service';
import { FormStateService } from './services/form-state.service';
import { FormStructure } from './interfaces/form-element.interface';

@Component({
  selector: 'app-dynamic-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DynamicFieldDirective],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formStructure!: FormStructure;

  readonly formChange = output<unknown>();
  readonly formStatusChange = output<{ valid: boolean }>();

  protected form!: FormGroup;

  private readonly dynamicFormService = inject(DynamicFormService);
  private readonly formStateService = inject(FormStateService);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formStructure'] && !changes['formStructure'].firstChange) {
      this.subscriptions.unsubscribe();
      this.initializeForm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.form = this.dynamicFormService.createForm(this.formStructure);
    this.formStateService.initializeState(this.form, this.formStructure);

    this.subscriptions.add(
      this.form.valueChanges.subscribe((v) => this.formChange.emit(v)),
    );
    this.subscriptions.add(
      this.form.statusChanges.subscribe(() =>
        this.formStatusChange.emit({ valid: this.form.valid }),
      ),
    );
  }
}
