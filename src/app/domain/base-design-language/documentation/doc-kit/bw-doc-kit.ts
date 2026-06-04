import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

/** Casca de uma página de doc: categoria + título + lead + conteúdo. */
@Component({
  selector: 'bdl-doc-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <article class="bdl-doc-page">
      <header class="bdl-doc-page__header">
        @if (category()) {
          <span class="bdl-doc-page__eyebrow">{{ category() }}</span>
        }
        <h1 class="bdl-doc-page__title">{{ title() }}</h1>
        @if (lead()) {
          <p class="bdl-doc-page__lead">{{ lead() }}</p>
        }
      </header>
      <div class="bdl-doc-page__body"><ng-content /></div>
    </article>
  `,
  styles: `
    .bdl-doc-page__header { display: flex; flex-direction: column; gap: var(--bw-sizing-scale400); padding-bottom: var(--bw-sizing-scale800); margin-bottom: var(--bw-sizing-scale800); border-bottom: 1px solid var(--bw-border-opaque); }
    .bdl-doc-page__eyebrow { font: var(--bw-font-LabelSmall); text-transform: uppercase; letter-spacing: 0.08em; color: var(--bw-content-accent); }
    .bdl-doc-page__title { font: var(--bw-font-HeadingMedium); color: var(--bw-content-primary); }
    .bdl-doc-page__lead { max-width: 64ch; font: var(--bw-font-ParagraphLarge); color: var(--bw-content-secondary); }
    .bdl-doc-page__body { display: flex; flex-direction: column; gap: var(--bw-sizing-scale1200); }
  `,
})
export class BwDocPage {
  readonly title = input.required<string>();
  readonly category = input<string>('');
  readonly lead = input<string>('');
}

/** Seção âncora de uma doc page. */
@Component({
  selector: 'bdl-doc-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="bdl-doc-section" [id]="anchorId()">
      <h2 class="bdl-doc-section__title">{{ title() }}</h2>
      @if (description()) {
        <p class="bdl-doc-section__desc">{{ description() }}</p>
      }
      <div class="bdl-doc-section__body"><ng-content /></div>
    </section>
  `,
  styles: `
    .bdl-doc-section { scroll-margin-top: 80px; }
    .bdl-doc-section__title { font: var(--bw-font-HeadingMedium); color: var(--bw-content-primary); margin-bottom: var(--bw-sizing-scale400); }
    .bdl-doc-section__desc { max-width: 64ch; font: var(--bw-font-ParagraphMedium); color: var(--bw-content-secondary); margin-bottom: var(--bw-sizing-scale600); }
    .bdl-doc-section__body { display: flex; flex-direction: column; gap: var(--bw-sizing-scale600); }
  `,
})
export class BwDocSection {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  protected readonly anchorId = computed(() =>
    this.title().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  );
}

/** Superfície de exemplo (canvas com componente real). */
@Component({
  selector: 'bdl-doc-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div class="bdl-doc-example"><ng-content /></div>`,
  styles: `
    .bdl-doc-example { display: flex; flex-wrap: wrap; align-items: center; gap: var(--bw-sizing-scale500); padding: var(--bw-sizing-scale800); border: 1px solid var(--bw-border-opaque); border-radius: var(--bw-radius-300); background: var(--bw-background-primary); }
  `,
})
export class BwDocExample {}
