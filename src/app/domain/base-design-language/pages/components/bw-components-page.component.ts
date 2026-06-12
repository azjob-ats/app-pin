import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, from, map, of, switchMap } from 'rxjs';
import { BW_STORIES } from '../../ladle/stories.registry';

/**
 * Página de visualização de stories em /bw/components?story=<grupo>--<nome>.
 * Substitui o ladle-shell: mesma rota de query param, mas dentro do docs-shell.
 */
@Component({
  selector: 'bw-components-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgComponentOutlet],
  template: `
    <div class="bw-comp-page">
      @if (storyComponent(); as cmp) {
        <ng-container *ngComponentOutlet="cmp" />
      } @else {
        <div class="bw-comp-page__empty">
          <span class="material-symbols-rounded" aria-hidden="true">science</span>
          <p>Selecione um componente na barra lateral.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .bw-comp-page {
      padding: var(--bw-sizing-scale1000, 40px) var(--bw-sizing-scale1200, 48px);
    }
    .bw-comp-page__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bw-sizing-scale600, 24px);
      padding: var(--bw-sizing-scale2400, 96px) 0;
      color: var(--bw-content-tertiary);
      text-align: center;

      .material-symbols-rounded { font-size: 48px; }
      p { font: var(--bw-font-ParagraphMedium); margin: 0; }
    }
  `],
})
export class BwComponentsPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly storyComponent = toSignal<Type<unknown> | null>(
    this.route.queryParamMap.pipe(
      map((p) => p.get('story') ?? ''),
      distinctUntilChanged(),
      switchMap((id) => {
        if (!id) return of(null);
        const story = BW_STORIES.find((s) => s.id === id);
        if (!story) return of(null);
        return from(story.load() as Promise<Type<unknown>>);
      }),
    ),
    { initialValue: null },
  );
}
