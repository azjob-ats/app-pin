import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ToggleCheckComponent } from '@shared/components/toggle-check/toggle-check.component';
import { Step } from '../../interfaces/stepper.interface';

@Component({
  selector: 'app-step-revision',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleCheckComponent],
  templateUrl: './step-revision.component.html',
  styleUrl: './step-revision.component.scss',
})
export class StepRevisionComponent {
  readonly steps = input<Step[]>([]);
  readonly showPrivacyPolicy = input(false);
  readonly privacyChecked = input(false);
  readonly privacyAccepted = output<boolean>();

  readonly formSteps = computed(() =>
    this.steps().filter((s) => s.identifier === 'dynamicForm'),
  );

  getDisplayValue(stepData: unknown, elementId: string, elementType: string, options?: { name: string; code: string }[]): string {
    const data = stepData as Record<string, unknown>;
    const value = data?.[elementId];

    if (value === undefined || value === null || value === '') return '—';

    if (elementType === 'select' && options) {
      return options.find((o) => o.code === value)?.name ?? String(value);
    }
    if (elementType === 'checkboxAuthorize') {
      return value ? 'Sim' : 'Não';
    }
    return String(value);
  }
}
