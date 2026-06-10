import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export type NotificationKind = 'info' | 'positive' | 'warning' | 'negative';

/**
 * Notification — clone de `baseui/notification` (Toast inline `notificationType="inline"`,
 * `closeable=false`). Caixa `ParagraphMedium` 288px, padding/margin 16, raio 12, por `kind`
 * (info/positive/warning/negative → backgrounds *Light, texto contentPrimary). Sem sombra.
 * **Nota:** os stories `warning`/`negative` sobrescrevem `marginTop:10px` via override React —
 * aproximado (mantido margin 16). Nenhum token novo.
 */
@Component({
  selector: 'bui-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './notification.component.scss',
  template: `<ng-content />`,
  host: {
    'data-baseweb': 'notification',
    role: 'alert',
    '[class]': 'cls()',
  },
})
export class BuiNotification {
  readonly kind = input<NotificationKind>('info');
  protected readonly cls = computed(() => `bui-notification bui-notification--${this.kind()}`);
}
