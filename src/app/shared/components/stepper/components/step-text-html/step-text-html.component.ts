import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeHtmlPipe } from '@shared/pipes/safe-html/safe-html.pipe';

@Component({
  selector: 'app-step-text-html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SafeHtmlPipe],
  template: `<div class="html-content" [innerHTML]="html() | safeHtml"></div>`,
  styles: [
    `
      .html-content {
        line-height: 1.7;
        font-size: 0.9rem;
        :is(h1, h2, h3, h4) { margin: 1rem 0 0.5rem; }
        p { margin: 0 0 0.75rem; }
        ul, ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
        li { margin-bottom: 0.25rem; }
        strong { font-weight: 600; }
      }
    `,
  ],
})
export class StepTextHtmlComponent {
  readonly html = input<string>('');
}
