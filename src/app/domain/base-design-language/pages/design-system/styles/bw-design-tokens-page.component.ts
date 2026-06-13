import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bdl-design-tokens-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bw-design-tokens-page.component.html',
  styleUrl: './bw-design-tokens-page.component.scss',
})
export class BwDesignTokensPageComponent {}
