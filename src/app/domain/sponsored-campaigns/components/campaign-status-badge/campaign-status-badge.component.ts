import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { CampaignStatus } from '@shared/enums/campaign-status.enum';

const LABELS: Record<CampaignStatus, string> = {
  [CampaignStatus.Pending]: 'Pendente',
  [CampaignStatus.Scheduled]: 'Agendada',
  [CampaignStatus.Running]: 'No ar',
  [CampaignStatus.Completed]: 'Concluída',
  [CampaignStatus.Cancelled]: 'Cancelada',
  [CampaignStatus.Failed]: 'Falhou',
};

@Component({
  selector: 'app-campaign-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="campaign-status" [class]="'status-' + status()">
      <span class="campaign-status__dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  styleUrl: './campaign-status-badge.component.scss',
})
export class CampaignStatusBadgeComponent {
  readonly status = input.required<CampaignStatus>();
  readonly label = computed(() => LABELS[this.status()]);
}
