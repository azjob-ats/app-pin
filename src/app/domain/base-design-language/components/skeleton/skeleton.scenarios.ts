import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { Avatar } from '../avatar/avatar.component';
import { Skeleton } from './skeleton.component';

/** Scenarios portadas de `src/skeleton/__tests__/*.scenario.tsx`. */

const EIGHT = Array(8).fill(undefined);

// skeleton.scenario.tsx — 8 cards: bloco 300×150 + [círculo 50×50 + skeleton rows=2]. Estático.
@Component({
  selector: 'bui-s-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Skeleton],
  template: `<div style="width:1000px;display:flex;flex-wrap:wrap">
    @for (i of eight; track $index) {
      <div style="margin:10px">
        <bui-skeleton height="150px" width="300px" style="margin-bottom:10px" />
        <div style="align-items:center;display:flex;flex-direction:row;justify-content:space-between">
          <bui-skeleton width="50px" height="50px" style="border-radius:50%" />
          <bui-skeleton [rows]="2" width="220px" />
        </div>
      </div>
    }
  </div>`,
})
export class SkeletonScenario {
  protected readonly eight = EIGHT;
}

// skeleton-animation.scenario.tsx — igual à anterior, com shimmer animado (animation).
@Component({
  selector: 'bui-s-skeleton-animation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Skeleton],
  template: `<div style="width:1000px;display:flex;flex-wrap:wrap">
    @for (i of eight; track $index) {
      <div style="margin:10px">
        <bui-skeleton height="150px" width="300px" animation style="margin-bottom:10px" />
        <div style="align-items:center;display:flex;flex-direction:row;justify-content:space-between">
          <bui-skeleton width="50px" height="50px" animation style="border-radius:50%" />
          <bui-skeleton animation [rows]="2" width="220px" />
        </div>
      </div>
    }
  </div>`,
})
export class AnimationScenario {
  protected readonly eight = EIGHT;
}

// skeleton-loading.scenario.tsx — skeleton por 2s, depois conteúdo real (img + Avatar + 2 parágrafos).
@Component({
  selector: 'bui-s-skeleton-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Skeleton, Avatar],
  template: `
    @if (loading()) {
      <div style="width:300px;margin:10px">
        <bui-skeleton height="150px" width="300px" style="margin-bottom:15px" />
        <div style="align-items:center;display:flex;flex-direction:row;justify-content:space-between">
          <bui-skeleton width="50px" height="50px" style="border-radius:50%" />
          <bui-skeleton [rows]="2" width="220px" />
        </div>
      </div>
    } @else {
      <div id="content" style="width:300px;margin:10px">
        <img style="width:300px;height:150px" alt="" src="/assets/bw/adorable.png" />
        <div style="align-items:center;display:flex;flex-direction:row;justify-content:space-between">
          <bui-avatar name="username" size="50px" />
          <div>
            <p style="font-size:15px">this is test paragraph one</p>
            <p style="font-size:15px">this is test paragraph two</p>
          </div>
        </div>
      </div>
    }
  `,
})
export class LoadingScenario {
  protected readonly loading = signal(true);
  constructor() {
    setTimeout(() => this.loading.set(false), 2000);
  }
}
