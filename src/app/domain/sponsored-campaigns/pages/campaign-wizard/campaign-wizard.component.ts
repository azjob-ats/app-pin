import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { CampaignBuilderFacade } from '@domain/sponsored-campaigns/services/campaign-builder.facade';
import { WizardCheckoutStepComponent } from '@domain/sponsored-campaigns/components/wizard-checkout-step/wizard-checkout-step.component';
import { WizardKeywordStepComponent } from '@domain/sponsored-campaigns/components/wizard-keyword-step/wizard-keyword-step.component';
import { WizardStepperComponent } from '@domain/sponsored-campaigns/components/wizard-stepper/wizard-stepper.component';
import { WizardVideoStepComponent } from '@domain/sponsored-campaigns/components/wizard-video-step/wizard-video-step.component';
import { WizardWindowStepComponent } from '@domain/sponsored-campaigns/components/wizard-window-step/wizard-window-step.component';
import { Campaign } from '@shared/interfaces/entity/campaign';
import { take } from 'rxjs';

@Component({
  selector: 'app-campaign-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink,
    WizardStepperComponent,
    WizardKeywordStepComponent,
    WizardWindowStepComponent,
    WizardVideoStepComponent,
    WizardCheckoutStepComponent,
  ],
  templateUrl: './campaign-wizard.component.html',
  styleUrl: './campaign-wizard.component.scss',
})
export class CampaignWizardComponent implements OnInit {
  private readonly facade = inject(CampaignBuilderFacade);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly step = this.facade.step;
  readonly keyword = this.facade.keyword;
  readonly windowFrom = this.facade.windowFrom;
  readonly pricingCalendar = this.facade.pricingCalendar;
  readonly hoursIndex = this.facade.hoursIndex;
  readonly selectedHours = this.facade.selectedHours;
  readonly totalCost = this.facade.totalCost;
  readonly hoursWithPrice = this.facade.selectedHoursWithPrice;
  readonly eligibleVideos = this.facade.eligibleVideos;
  readonly videoId = this.facade.videoId;
  readonly selectedVideo = this.facade.selectedVideo;
  readonly projection = this.facade.projection;
  readonly error = this.facade.error;
  readonly isSubmitting = this.facade.isSubmitting;
  readonly pricingLoading = this.facade.pricingLoading;
  readonly videosLoading = this.facade.videosLoading;
  readonly keywordReady = this.facade.keywordReady;
  readonly windowReady = this.facade.windowReady;
  readonly videoReady = this.facade.videoReady;

  readonly hubLink = `/${environment.ROUTES.SPONSORED_CAMPAIGNS.ROOT}`;

  readonly canAdvance = computed(() => {
    switch (this.step()) {
      case 1:
        return this.keywordReady();
      case 2:
        return this.windowReady();
      case 3:
        return this.videoReady();
      case 4:
        return true;
      default:
        return false;
    }
  });

  readonly hoursCount = computed(() => this.selectedHours().length);

  readonly checkoutCard = computed(() => null);

  ngOnInit(): void {
    this.facade.reset();
    this.facade.loadEligibleVideos();
  }

  onKeywordChange(value: string): void {
    this.facade.setKeyword(value);
  }

  onWindowChange(value: string): void {
    this.facade.setWindowFrom(value || null);
  }

  onHourToggle(payload: { date: string; hour: number }): void {
    this.facade.toggleHour(payload.date, payload.hour);
  }

  onDayToggle(payload: { date: string; hours: number[] }): void {
    const allSelected = payload.hours.every((h) =>
      this.hoursIndex().has(`${payload.date}|${h}`),
    );
    if (allSelected) {
      this.facade.clearDay(payload.date);
    } else {
      this.facade.selectAllHoursForDay(payload.date, payload.hours);
    }
  }

  onVideoSelect(id: string): void {
    this.facade.setVideoId(id);
  }

  goNext(): void {
    this.facade.goNext();
  }

  goBack(): void {
    this.facade.goBack();
  }

  submit(): void {
    this.facade
      .submit()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((campaign: Campaign | null) => {
        if (campaign) {
          void this.router.navigate([
            '/',
            ...environment.ROUTES.SPONSORED_CAMPAIGNS.SUCCESS_PATH.split('/'),
            campaign.id,
          ]);
        }
      });
  }
}
