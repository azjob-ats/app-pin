import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAttribute } from '@shared/interfaces/entity/search-filter';
import { RadioGroupComponent } from '@shared/components/radio-group/radio-group.component';
import { CheckboxGroupComponent } from '@shared/components/checkbox-group/checkbox-group.component';
import { SelectComponent } from '@shared/components/select/select.component';

@Component({
  selector: 'app-filter-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RadioGroupComponent, CheckboxGroupComponent, SelectComponent],
  templateUrl: './filter-detail.component.html',
  styleUrl: './filter-detail.component.scss',
})
export class FilterDetailComponent implements OnInit {
  readonly attribute = input.required<IAttribute>();
  readonly back = output<void>();
  readonly valueChange = output<string | string[]>();
  readonly reset = output<void>();

  readonly radioValue = signal('');
  readonly checkboxValues = signal<string[]>([]);
  readonly selectValue = signal('');

  ngOnInit(): void {
    const current = this.attribute().selectedValue;
    const type = this.attribute().filterComponent.type;

    if (type === 'radio' || type === 'select') {
      this.radioValue.set((current as string) ?? '');
      this.selectValue.set((current as string) ?? '');
    } else if (type === 'checkbox') {
      this.checkboxValues.set((current as string[]) ?? []);
    }
  }

  onRadioChange(value: string): void {
    this.radioValue.set(value);
    this.valueChange.emit(value);
  }

  onCheckboxChange(values: string[]): void {
    this.checkboxValues.set(values);
    this.valueChange.emit(values);
  }

  onSelectChange(value: string): void {
    this.selectValue.set(value);
    this.valueChange.emit(value);
  }

  onReset(): void {
    const type = this.attribute().filterComponent.type;
    if (type === 'checkbox') {
      this.checkboxValues.set([]);
    } else {
      this.radioValue.set('');
      this.selectValue.set('');
    }
    this.reset.emit();
  }
}
