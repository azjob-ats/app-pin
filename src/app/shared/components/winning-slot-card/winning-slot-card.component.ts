import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, computed, inject, input } from '@angular/core';
import { SafeHtmlPipe } from '@shared/pipes/safe-html/safe-html.pipe';
import { SlotComponentRegistryService } from '@shared/services/slot-component-registry.service';
import {
  WinningSlot,
  WinningSlotComponentMedia,
  WinningSlotHtmlMedia,
  WinningSlotImageMedia,
  WinningSlotMovieMedia,
} from '@shared/interfaces/entity/winning-slot';

@Component({
  selector: 'app-winning-slot-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, SafeHtmlPipe],
  templateUrl: './winning-slot-card.component.html',
  styleUrl: './winning-slot-card.component.scss',
  host: {
    '[class.is-landscape]': 'isLandscape()',
    '[attr.data-content-type]': 'slot().media.contentType',
    '[attr.data-slot-kind]': 'slot().slotKind',
    role: 'complementary',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class WinningSlotCardComponent {
  readonly slot = input.required<WinningSlot>();

  readonly isLandscape = computed(() => this.slot().media.aspectRatio === '16:9');

  readonly ariaLabel = computed(() => {
    const s = this.slot();
    return `${s.slotKind === 'ad' ? 'Conteúdo patrocinado' : 'Conteúdo recomendado'}: ${s.media.title}`;
  });

  readonly movieMedia = computed<WinningSlotMovieMedia | null>(() =>
    this.slot().media.contentType === 'movie' ? (this.slot().media as WinningSlotMovieMedia) : null,
  );
  readonly imageMedia = computed<WinningSlotImageMedia | null>(() =>
    this.slot().media.contentType === 'image' ? (this.slot().media as WinningSlotImageMedia) : null,
  );
  readonly htmlMedia = computed<WinningSlotHtmlMedia | null>(() =>
    this.slot().media.contentType === 'html' ? (this.slot().media as WinningSlotHtmlMedia) : null,
  );
  readonly componentMedia = computed<WinningSlotComponentMedia | null>(() =>
    this.slot().media.contentType === 'component'
      ? (this.slot().media as WinningSlotComponentMedia)
      : null,
  );

  readonly scopedHtml = computed(() => {
    const html = this.htmlMedia();
    if (!html) return '';
    return html.css ? `<style>${html.css}</style>${html.html}` : html.html;
  });

  readonly resolvedComponent = computed<Type<unknown> | null>(() => {
    const cmp = this.componentMedia();
    return cmp ? this.slotComponentRegistry.resolve(cmp.componentId) : null;
  });

  readonly resolvedComponentInputs = computed<Record<string, unknown>>(() => {
    const cmp = this.componentMedia();
    return (cmp?.props ?? {}) as Record<string, unknown>;
  });

  private readonly slotComponentRegistry = inject(SlotComponentRegistryService);
}
