import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type PuckType = 'consumer' | 'earner';

/** LocationPuck — fiel ao baseui/map-marker/location-puck (ponto "você está aqui" + precisão + heading). */
@Component({
  selector: 'bui-location-puck',
  exportAs: 'buiLocationPuck',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bui-lp">
      @if (approximation()) { <span class="bui-lp__accuracy"></span> }
      @if (heading() !== null) {
        <span class="bui-lp__beam" [style.transform]="'rotate(' + heading() + 'deg)'"></span>
      }
      <span class="bui-lp__dot" [class.bui-lp__dot--earner]="type() === 'earner'"></span>
    </div>
  `,
  styles: `
    .bui-lp { position:relative; display:inline-flex; align-items:center; justify-content:center; width:96px; height:96px; }
    .bui-lp__accuracy { position:absolute; width:96px; height:96px; border-radius:50%; background:var(--bw-background-accent); opacity:.16; }
    .bui-lp__beam { position:absolute; width:0; height:0; border-left:18px solid transparent; border-right:18px solid transparent; border-bottom:36px solid var(--bw-background-accent); opacity:.3; top:6px; transform-origin:center 42px; }
    .bui-lp__dot { position:relative; width:20px; height:20px; border-radius:50%; background:var(--bw-background-accent); border:3px solid var(--bw-background-primary); box-shadow:var(--bw-lighting-shadow600, 0 2px 8px rgba(0,0,0,.3)); box-sizing:border-box; }
    .bui-lp__dot--earner { background:var(--bw-content-primary); }
  `,
})
export class LocationPuck {
  readonly type = input<PuckType>('consumer');
  readonly heading = input<number | null>(null);
  readonly approximation = input(true);
}

@Component({
  selector: 'bui-s-location-puck', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [LocationPuck],
  template: `<div style="display:flex; gap:32px; align-items:center; padding:24px; background:var(--bw-background-secondary);">
    <bui-location-puck [heading]="45" />
    <bui-location-puck type="earner" [heading]="200" [approximation]="false" />
    <bui-location-puck [heading]="null" />
  </div>`,
})
export class LocationPuckScenario {}
