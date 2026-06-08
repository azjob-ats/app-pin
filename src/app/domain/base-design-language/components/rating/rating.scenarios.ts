import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { EmoticonRating, StarRating } from './rating.component';

/** Scenarios portadas de `src/rating/__tests__/*.scenario.tsx`. */

// rating-star.scenario.tsx — StarRating value=3 (controlado).
@Component({
  selector: 'bui-s-rating-star',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [StarRating],
  template: `<bui-star-rating [value]="value()" (valueChange)="value.set($event)" />`,
})
export class RatingStarScenario {
  protected readonly value = signal(3);
}

// rating-emoticon.scenario.tsx — EmoticonRating value=3 (controlado).
@Component({
  selector: 'bui-s-rating-emoticon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [EmoticonRating],
  template: `<bui-emoticon-rating [value]="value()" (valueChange)="value.set($event)" />`,
})
export class RatingEmoticonScenario {
  protected readonly value = signal(3);
}

// rating-size.scenario.tsx — Emoticon (30, 44) + Star (30, 22), todos value=3.
@Component({
  selector: 'bui-s-rating-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [EmoticonRating, StarRating],
  template: `
    <div>
      <bui-emoticon-rating [size]="30" [value]="value()" (valueChange)="value.set($event)" />
      <br />
      <bui-emoticon-rating [value]="value()" (valueChange)="value.set($event)" />
      <br />
      <bui-star-rating [size]="30" [value]="value()" (valueChange)="value.set($event)" />
      <br />
      <bui-star-rating [value]="value()" (valueChange)="value.set($event)" />
    </div>
  `,
})
export class RatingSizeScenario {
  protected readonly value = signal(3);
}
