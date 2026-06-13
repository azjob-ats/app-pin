import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'bdl-design-system-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="bdl-ds-page">
      <h1>{{ title() }}</h1>
      <p class="bdl-ds-page__soon">Documentação em construção.</p>
    </div>
  `,
  styles: `
    .bdl-ds-page {
      padding: 2rem;
    }
    .bdl-ds-page__soon {
      margin-top: 0.5rem;
      opacity: 0.6;
    }
  `,
})
export class BwDesignSystemPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.params.pipe(
      map((p) => {
        const page = (p['page'] as string) ?? '';
        return page.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      }),
    ),
    { initialValue: '' },
  );
}
