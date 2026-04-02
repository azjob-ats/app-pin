import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { GenericStepperComponent } from '@shared/components/stepper/components/generic-stepper/generic-stepper.component';
import { StepRevisionComponent } from '@shared/components/stepper/components/step-revision/step-revision.component';
import { StepTextHtmlComponent } from '@shared/components/stepper/components/step-text-html/step-text-html.component';
import { StepperService } from '@shared/components/stepper/services/stepper.service';
import { LottiePlayerComponent } from '@shared/components/lottie-player/lottie-player.component';
import { Step, StepperConfig } from '@shared/components/stepper/interfaces/stepper.interface';
import { LearnMoreApi } from '@shared/apis/learn-more.api';
import { LearnMoreSubmitRequest } from '@shared/interfaces/dto/request/learn-more';
import { DynamicLearnMoreService } from './dynamic-learn-more.service';
import { delay } from 'rxjs';

type ViewState = 'loading' | 'stepper' | 'submitting' | 'success' | 'error';
type ErrorContext = 'config' | 'submit';

@Component({
  selector: 'app-learn-more',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynamicLearnMoreService],
  imports: [
    ButtonComponent,
    DynamicFormComponent,
    GenericStepperComponent,
    StepRevisionComponent,
    StepTextHtmlComponent,
    LottiePlayerComponent,
  ],
  templateUrl: './learn-more.component.html',
  styleUrl: './learn-more.component.scss',
})
export class LearnMoreComponent implements OnInit {
  readonly pinId = input<string>('');
  readonly onClose = output<void>();
  readonly onTrackApplication = output<void>();

  protected readonly viewState = signal<ViewState>('loading');
  protected readonly stepperConfig = signal<StepperConfig | null>(null);
  private readonly errorContext = signal<ErrorContext>('config');

  protected readonly stepperService = inject(StepperService);
  private readonly learnMoreApi = inject(LearnMoreApi);
  private readonly dynamicLearnMoreService = inject(DynamicLearnMoreService);

  ngOnInit(): void {
    this.loadConfig();
  }

  // ── Public handlers ─────────────────────────────────────────────────────

  protected loadConfig(): void {
    this.viewState.set('loading');
    this.errorContext.set('config');

    this.dynamicLearnMoreService
    .buildStepperConfig(this.pinId() || 'default')
    .pipe(delay(1500))
    .subscribe({
      next: (config) => {
        this.stepperService.initializeStepper(config);
        this.stepperConfig.set(config);
        this.viewState.set('stepper');
      },
      error: () => this.viewState.set('error'),
    });
  }

  protected onFormChange(formValue: unknown, stepNumber: number): void {
    this.stepperService.updateStepData(formValue, stepNumber);
  }

  protected onAllStepsCompleted(steps: Step[]): void {
    this.submitAllData(steps);
  }

  protected onPrivacyAccepted(accepted: boolean): void {
    const revisionStep = this.stepperService
      .getAllData()
      .find((s) => s.identifier === 'revisionStepper');
    if (revisionStep) {
      this.stepperService.updateStepValidity(revisionStep.step, accepted);
    }
  }

  protected retry(): void {
    if (this.errorContext() === 'submit') {
      this.submitAllData(this.stepperService.getAllData());
    } else {
      this.loadConfig();
    }
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private submitAllData(steps: Step[]): void {
    this.viewState.set('submitting');
    this.errorContext.set('submit');

    const payload = this.buildPayload(steps);

    this.learnMoreApi.submit(payload)
    .pipe(delay(1500))
    .subscribe({
      next: () => this.viewState.set('success'),
      error: () => this.viewState.set('error'),
    });
  }

  private buildPayload(steps: Step[]): LearnMoreSubmitRequest {
    const fields: { id: string; value: unknown }[] = [];

    for (const step of steps) {
      if (step.identifier !== 'dynamicForm' || !step.data) continue;
      for (const [id, value] of Object.entries(step.data as Record<string, unknown>)) {
        fields.push({ id, value });
      }
    }

    return { pinId: this.pinId(), fields };
  }
}
