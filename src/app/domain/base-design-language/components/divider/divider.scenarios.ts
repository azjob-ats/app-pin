import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Divider } from './divider.component';

/** Scenario portada de `src/divider/__tests__/divider.scenario.tsx`. */
@Component({
  selector: 'bui-s-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Divider],
  template: `<div style="width:400px;border:1px solid #E2E2E2;border-radius:8px">
    <div style="height:50px;display:flex;align-items:flex-end;justify-content:center">Cell Divider</div>
    <hr buiDivider size="cell" />
    <div style="height:80px;display:flex;align-items:flex-end;justify-content:center">Section Divider</div>
    <hr buiDivider size="section" />
    <div style="height:160px;display:flex;align-items:flex-end;justify-content:center">Module Divider</div>
    <hr buiDivider size="module" />
    <div style="height:160px"></div>
  </div>`,
})
export class DividerScenario {}
