import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Spinner } from './spinner.component';

/** Scenario portada de `src/spinner/__tests__/spinner.scenario.tsx` — 18 spinners. */
@Component({
  selector: 'bui-s-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Spinner],
  // Espaçamento entre os spinners empilhados (o original os renderiza em fluxo de bloco).
  styles: `bui-s-spinner bui-spinner { margin: 6px 0; }`,
  template: `
    <bui-spinner />

    <bui-spinner size="small" />
    <bui-spinner size="medium" />
    <bui-spinner size="large" />

    <bui-spinner size="20px" />
    <bui-spinner size="40px" />
    <bui-spinner size="60px" />

    <bui-spinner borderWidth="small" [size]="60" />
    <bui-spinner borderWidth="medium" [size]="60" />
    <bui-spinner borderWidth="large" [size]="60" />

    <bui-spinner [borderWidth]="20" size="small" />
    <bui-spinner [borderWidth]="20" size="medium" />
    <bui-spinner [borderWidth]="20" size="large" />

    <bui-spinner borderWidth="scale300" size="scale1000" />
    <bui-spinner borderWidth="scale200" size="scale900" />
    <bui-spinner borderWidth="scale100" size="scale700" />

    <bui-spinner color="var(--bw-negative)" />
    <bui-spinner color="green" />
  `,
})
export class SpinnerScenario {}
