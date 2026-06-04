import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Rating — fiel ao baseui/rating (StarRating). CVA numérico; hover preview; readOnly. */
@Component({
  selector: 'bui-rating',
  exportAs: 'buiRating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-rating" role="radiogroup">
      @for (i of stars(); track i) {
        <button
          type="button"
          class="bui-rating__star"
          [class.bui-rating__star--on]="(hover() || value()) >= i + 1"
          [disabled]="readOnly()"
          [attr.aria-label]="(i + 1) + ' de ' + numItems()"
          (click)="set(i + 1)"
          (mouseenter)="hover.set(i + 1)"
          (mouseleave)="hover.set(0)"
        ><span class="material-symbols-rounded">star</span></button>
      }
    </div>
  `,
  styles: `
    .bui-rating { display:inline-flex; gap:var(--bw-sizing-scale100); }
    .bui-rating__star { border:none; background:transparent; padding:0; cursor:pointer; color:var(--bw-content-tertiary); line-height:0; }
    .bui-rating__star span { font-size:28px; font-variation-settings:'FILL' 0; }
    .bui-rating__star--on { color:var(--bw-warning-300); }
    .bui-rating__star--on span { font-variation-settings:'FILL' 1; }
    .bui-rating__star:disabled { cursor:default; }
  `,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Rating), multi: true }],
})
export class Rating implements ControlValueAccessor {
  readonly numItems = input<number>(5);
  readonly readOnly = input(false);

  protected readonly value = signal(0);
  protected readonly hover = signal(0);
  protected readonly stars = computed(() => Array.from({ length: this.numItems() }, (_, i) => i));

  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};
  writeValue(v: number | null): void { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(): void { /* readOnly via input */ }
  protected set(v: number): void {
    if (this.readOnly()) return;
    this.value.set(v); this.onChange(v); this.onTouched();
  }
}

@Component({
  selector: 'bui-s-rating', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Rating],
  template: `<div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
    <bui-rating [numItems]="5" />
    <bui-rating [numItems]="5" [readOnly]="true" />
  </div>`,
})
export class RatingScenario {}
