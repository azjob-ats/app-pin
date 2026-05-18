import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';
import { SponsoredEligibilityListComponent } from '@domain/sponsored-campaigns/components/sponsored-eligibility-list/sponsored-eligibility-list.component';
import { EligibleVideo } from '@shared/interfaces/entity/sponsored-campaigns';

@Component({
  selector: 'app-wizard-video-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SponsoredEligibilityListComponent],
  template: `
    <section class="wizard-video" aria-labelledby="wizard-video-title">
      <header class="wizard-video__head">
        <h2 class="wizard-video__title" id="wizard-video-title">
          Qual vídeo vai aparecer no slot patrocinado?
        </h2>
        <p class="wizard-video__subtitle">
          Só sobe quem já converte organicamente — vídeo precisa passar nos critérios de
          retenção, moderação e criador identificado.
        </p>
      </header>

      @if (loading()) {
        <div class="wizard-video__loading">Carregando seus vídeos elegíveis…</div>
      } @else if (videos().length === 0) {
        <div class="wizard-video__empty">
          <span class="material-symbols-rounded" aria-hidden="true">videocam_off</span>
          <p>Você ainda não tem vídeos elegíveis para campanhas patrocinadas.</p>
        </div>
      } @else {
        <app-sponsored-eligibility-list
          [videos]="videos()"
          [selectedId]="selectedId()"
          (select)="select.emit($event)"
        />
      }
    </section>
  `,
  styleUrl: './wizard-video-step.component.scss',
})
export class WizardVideoStepComponent {
  readonly videos = input.required<EligibleVideo[]>();
  readonly selectedId = input.required<string | null>();
  readonly loading = input<boolean>(false);
  readonly select = output<string>();
}
