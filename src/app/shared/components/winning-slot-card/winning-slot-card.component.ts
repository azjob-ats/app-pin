import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SafeHtmlPipe } from '@shared/pipes/safe-html/safe-html.pipe';
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
  imports: [SafeHtmlPipe],
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
}
