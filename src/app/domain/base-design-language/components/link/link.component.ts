import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** Link — fiel ao baseui/link (âncora estilizada com accent). */
@Component({
  selector: 'a[buiLink]',
  exportAs: 'buiLink',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `
    a[buiLink] { color:var(--bw-content-accent); text-decoration:none; cursor:pointer; }
    a[buiLink]:hover { text-decoration:underline; }
    a[buiLink]:focus-visible { outline:2px solid var(--bw-border-accent); outline-offset:2px; border-radius:2px; }
  `,
})
export class Link {}

@Component({
  selector: 'bui-s-link', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Link],
  template: `<p style="font:var(--bw-font-ParagraphMedium); color:var(--bw-content-primary)">
    Visite a <a buiLink href="https://baseweb.design" target="_blank" rel="noopener">documentação</a> para saber mais.
  </p>`,
})
export class LinkScenario {}
