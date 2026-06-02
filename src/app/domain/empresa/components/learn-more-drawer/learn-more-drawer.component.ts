import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { GenericStepperComponent } from '@shared/components/stepper/components/generic-stepper/generic-stepper.component';
import { StepRevisionComponent } from '@shared/components/stepper/components/step-revision/step-revision.component';
import { StepTextHtmlComponent } from '@shared/components/stepper/components/step-text-html/step-text-html.component';
import { StepperService } from '@shared/components/stepper/services/stepper.service';
import { Step, StepperConfig } from '@shared/components/stepper/interfaces/stepper.interface';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { EmpresaProductApi } from '@shared/apis/empresa-product.api';
import { EmpresaSubmissionApi } from '@shared/apis/empresa-submission.api';
import { ApiResponse } from '@shared/interfaces/base/api-response';
import { Product } from '@shared/interfaces/entity/empresa-product';
import { LearnMoreLauncherService } from '@domain/empresa/services/learn-more-launcher.service';
import { ProductLearnMoreAdapter } from '@domain/empresa/services/product-learn-more.adapter';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

type ViewState = 'loading' | 'stepper' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-learn-more-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DrawerComponent,
    DynamicFormComponent,
    GenericStepperComponent,
    StepRevisionComponent,
    StepTextHtmlComponent,
  ],
  templateUrl: './learn-more-drawer.component.html',
  styleUrl: './learn-more-drawer.component.scss',
})
export class LearnMoreDrawerComponent {
  private readonly launcher = inject(LearnMoreLauncherService);
  private readonly productApi = inject(EmpresaProductApi);
  private readonly submissionApi = inject(EmpresaSubmissionApi);
  private readonly adapter = inject(ProductLearnMoreAdapter);
  protected readonly stepperService = inject(StepperService);

  protected readonly target = this.launcher.target;
  protected readonly isOpen = this.launcher.isOpen;

  protected readonly product = signal<Product | null>(null);
  protected readonly stepperConfig = signal<StepperConfig | null>(null);
  protected readonly viewState = signal<ViewState>('loading');
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const target = this.target();
      if (target) {
        this.loadProduct(target.slug, target.productId);
      } else {
        this.resetState();
      }
    });
  }

  protected get title(): string {
    return this.product()?.title ?? this.target()?.productTitle ?? 'Saiba mais';
  }

  protected onClose(): void {
    this.launcher.close();
  }

  protected onVisibleChange(visible: boolean): void {
    if (!visible) this.launcher.close();
  }

  protected onFormChange(value: unknown, stepNumber: number): void {
    this.stepperService.updateStepData(value, stepNumber);
  }

  protected onPrivacyAccepted(accepted: boolean): void {
    const revision = this.stepperService
      .getAllData()
      .find((s) => s.identifier === 'revisionStepper');
    if (revision) {
      this.stepperService.updateStepValidity(revision.step, accepted);
    }
  }

  protected onAllStepsCompleted(steps: Step[]): void {
    const target = this.target();
    const product = this.product();
    if (!target || !product) return;

    const answers = this.buildAnswers(steps);
    this.viewState.set('submitting');
    this.error.set(null);

    this.submissionApi
      .create(target.slug, product.id, { answers })
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.viewState.set('success');
          } else {
            this.error.set(response.message || 'Não foi possível enviar.');
            this.viewState.set('error');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível enviar.');
          this.viewState.set('error');
          return EMPTY;
        }),
      )
      .subscribe();
  }

  protected retry(): void {
    this.viewState.set('stepper');
    this.error.set(null);
  }

  // ---------- internals ----------

  private loadProduct(slug: string, productId: string): void {
    this.resetState();
    this.viewState.set('loading');
    this.productApi
      .detail(slug, productId)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.product.set(response.data);
            const config = this.adapter.toStepperConfig(response.data);
            this.stepperService.initializeStepper(config);
            this.stepperConfig.set(config);
            this.viewState.set('stepper');
          } else {
            this.error.set(response.message || 'Produto não encontrado.');
            this.viewState.set('error');
          }
        }),
        catchError((err: ApiResponse) => {
          this.error.set(err?.message || 'Não foi possível carregar o formulário.');
          this.viewState.set('error');
          return EMPTY;
        }),
        finalize(() => {
          // viewState already set inside tap/catch
        }),
      )
      .subscribe();
  }

  private resetState(): void {
    this.product.set(null);
    this.stepperConfig.set(null);
    this.error.set(null);
    this.viewState.set('loading');
  }

  private buildAnswers(steps: Step[]): Array<{ fieldId: string; value: string }> {
    const result: Array<{ fieldId: string; value: string }> = [];
    for (const step of steps) {
      if (step.identifier !== 'dynamicForm' || !step.data) continue;
      for (const [id, raw] of Object.entries(step.data as Record<string, unknown>)) {
        const value = raw === null || raw === undefined ? '' : String(raw);
        result.push({ fieldId: id, value });
      }
    }
    return result;
  }
}
