import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, booleanAttribute, computed, contentChild, input, output } from '@angular/core';
import { BuiAlert, BuiArrowLeft, BuiDelete } from '../icon/icon.component';

export type TagActionIcon = 'delete' | 'alert' | 'arrowLeft';

export type TagKind = 'neutral' | 'primary' | 'accent' | 'positive' | 'warning' | 'negative';
export type TagSize = 'small' | 'medium' | 'large';
export type TagHierarchy = 'primary' | 'secondary';

/** Marcador do start enhancer do Tag: `<span buiTagStart>…</span>`. */
@Directive({ selector: '[buiTagStart]' })
export class BuiTagStart {}

/**
 * Tag — clone fiel do `baseui/tag` (kinds deprecated usados nas stories). Pílula com
 * `kind` (cor), `hierarchy` (secondary=outlined/claro, primary=solid), `size`
 * (small/medium/large), `disabled`, `closeable` (✕ DeleteIcon) e `startEnhancer`.
 */
@Component({
  selector: 'bui-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiDelete, BuiAlert, BuiArrowLeft],
  styleUrl: './tag.component.scss',
  template: `
    @if (start()) {
      <span class="bui-tag__start"><ng-content select="[buiTagStart]" /></span>
    }
    <span class="bui-tag__label"><ng-content /></span>
    @if (closeable() && !disabled()) {
      <span class="bui-tag__action" role="button" aria-label="remove" tabindex="0" (click)="actionClick.emit()">
        @switch (actionIcon()) {
          @case ('alert') { <bui-alert [size]="iconSize()" /> }
          @case ('arrowLeft') { <bui-arrow-left [size]="iconSize()" /> }
          @default { <bui-delete [size]="iconSize()" /> }
        }
      </span>
    }
  `,
  host: {
    'data-baseweb': 'tag',
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
  },
})
export class BuiTag {
  readonly kind = input<TagKind>('neutral');
  readonly size = input<TagSize>('small');
  readonly hierarchy = input<TagHierarchy>('secondary');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly closeable = input(true, { transform: booleanAttribute });
  readonly clickable = input(false, { transform: booleanAttribute });
  /** Ícone da ação (✕ padrão; `alert`/`arrowLeft` = override do ActionIcon). */
  readonly actionIcon = input<TagActionIcon>('delete');
  readonly actionClick = output<void>();

  protected readonly start = contentChild(BuiTagStart);
  protected readonly iconSize = computed(() => (this.size() === 'large' ? 18 : this.size() === 'medium' ? 16 : 14));

  protected readonly classes = computed(() =>
    [
      'bui-tag',
      `bui-tag--${this.kind()}`,
      `bui-tag--${this.size()}`,
      this.disabled() ? 'bui-tag--disabled' : this.hierarchy() === 'primary' ? 'bui-tag--solid' : 'bui-tag--subtle',
    ].join(' '),
  );
}
