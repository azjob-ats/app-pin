import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { EMOTICONS, starSVG } from './rating.icons';

/** Lê o valor resolvido de um CSS var no elemento (p/ "queimar" a cor no SVG data-uri). */
function readVar(el: HTMLElement, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/**
 * StarRating — clone fiel do `baseui/rating` `StarRating`. Lista de estrelas (radiogroup)
 * com preview no hover, seleção por clique/teclado e foco visível. As estrelas ativas
 * (`x <= value`/preview) usam `borderSelected`; inativas `ratingStroke`/`ratingInactiveFill`.
 */
@Component({
  selector: 'bui-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './rating.component.scss',
  template: `
    @for (x of items(); track x) {
      <li
        class="bui-rating-star"
        role="radio"
        title="rating"
        [attr.data-index]="x"
        [attr.tabindex]="isFocusable(x) ? 0 : -1"
        [attr.aria-setsize]="numItems()"
        [attr.aria-checked]="x <= value()"
        [attr.aria-posinset]="x"
        [attr.aria-disabled]="readOnly()"
        [class.bui-rating-star--selected]="x === previewIndex()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.--bui-star-icon]="iconUrl(x)"
        (click)="select(x)"
        (mouseover)="!readOnly() && previewIndex.set(x)"
        (keydown)="onKey($event)"
      ></li>
    }
  `,
  host: {
    'data-baseweb': 'star-rating',
    role: 'radiogroup',
    class: 'bui-rating',
    '(mouseleave)': 'previewIndex.set(undefined)',
  },
})
export class StarRating {
  readonly value = input(-1, { transform: numberAttribute });
  readonly numItems = input(5, { transform: numberAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly size = input(22, { transform: numberAttribute });
  readonly valueChange = output<number>();

  protected readonly previewIndex = signal<number | undefined>(undefined);
  private readonly host = inject(ElementRef);
  private readonly colors = signal({ stroke: '#000', inactive: '#fff', selected: '#000' });

  protected readonly items = computed(() => Array.from({ length: this.numItems() }, (_, i) => i + 1));

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      this.colors.set({
        stroke: readVar(el, '--bw-content-primary'), // ratingStroke
        inactive: readVar(el, '--bw-background-primary'), // ratingInactiveFill
        selected: readVar(el, '--bw-border-selected'),
      });
    });
  }

  protected iconUrl(x: number): string {
    const active = this.previewIndex() !== undefined ? x <= this.previewIndex()! : x <= this.value();
    const c = this.colors();
    const fill = active ? c.selected : c.inactive;
    const stroke = active ? c.selected : c.stroke;
    return `url('data:image/svg+xml,${starSVG(fill, stroke, this.size())}')`;
  }

  protected isFocusable(x: number): boolean {
    return x === this.value() || (this.value() < 1 && x === 1);
  }

  protected select(x: number): void {
    if (this.readOnly()) return;
    this.valueChange.emit(x);
    this.previewIndex.set(undefined);
  }

  protected onKey(e: KeyboardEvent): void {
    if (this.readOnly()) return;
    const n = this.numItems();
    const v = this.value();
    let next: number | undefined;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = v - 1 < 1 ? n : v - 1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = v + 1 > n ? 1 : v + 1;
    if (next === undefined) return;
    e.preventDefault();
    this.select(next);
    queueMicrotask(() => (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus());
  }
}

/**
 * EmoticonRating — clone fiel do `baseui/rating` `EmoticonRating`. 5 emoticons (angry→very
 * happy); o ativo (`x <= value`/preview) recebe fundo `backgroundWarning`, os demais
 * `backgroundSecondary`; rosto `contentPrimary`. Preview no hover, seleção por clique/teclado.
 */
@Component({
  selector: 'bui-emoticon-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './rating.component.scss',
  template: `
    @for (x of items; track x) {
      <li
        class="bui-rating-emoticon"
        role="radio"
        [attr.aria-label]="MOODS[x - 1]"
        [attr.data-index]="x"
        [attr.tabindex]="isFocusable(x) ? 0 : -1"
        [attr.aria-setsize]="5"
        [attr.aria-checked]="x === value()"
        [attr.aria-posinset]="x"
        [attr.aria-disabled]="readOnly()"
        [class.bui-rating-emoticon--selected]="x === previewIndex()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.--bui-emoticon-icon]="iconUrl(x)"
        (click)="select(x)"
        (mouseover)="!readOnly() && previewIndex.set(x)"
        (keydown)="onKey($event)"
      ></li>
    }
  `,
  host: {
    'data-baseweb': 'emoticon-rating',
    role: 'radiogroup',
    class: 'bui-rating',
    '(mouseleave)': 'previewIndex.set(undefined)',
  },
})
export class EmoticonRating {
  readonly value = input(-1, { transform: numberAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly size = input(44, { transform: numberAttribute });
  readonly valueChange = output<number>();

  protected readonly items = [1, 2, 3, 4, 5];
  /** Nome acessível por posição (o original não tem; adicionado p/ AXE — invisível). */
  protected readonly MOODS = ['Angry', 'Sad', 'Neutral', 'Happy', 'Very happy'];
  protected readonly previewIndex = signal<number | undefined>(undefined);
  private readonly host = inject(ElementRef);
  private readonly colors = signal({ inactive: '#f3f3f3', active: '#ffc043', face: '#000' });

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      this.colors.set({
        inactive: readVar(el, '--bw-background-secondary'),
        active: readVar(el, '--bw-background-warning'),
        face: readVar(el, '--bw-content-primary'),
      });
    });
  }

  protected iconUrl(x: number): string {
    // Emoticon: ativo é só a posição exata (x === value/preview), não cumulativo.
    const active = this.previewIndex() !== undefined ? x === this.previewIndex()! : x === this.value();
    const c = this.colors();
    return `url('data:image/svg+xml,${EMOTICONS[x - 1](active ? c.active : c.inactive, c.face, this.size())}')`;
  }

  protected isFocusable(x: number): boolean {
    return x === this.value() || (this.value() < 1 && x === 1);
  }

  protected select(x: number): void {
    if (this.readOnly()) return;
    this.valueChange.emit(x);
    this.previewIndex.set(undefined);
  }

  protected onKey(e: KeyboardEvent): void {
    if (this.readOnly()) return;
    const v = this.value();
    let next: number | undefined;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = v - 1 < 1 ? 5 : v - 1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = v + 1 > 5 ? 1 : v + 1;
    if (next === undefined) return;
    e.preventDefault();
    this.select(next);
    queueMicrotask(() => (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus());
  }
}
