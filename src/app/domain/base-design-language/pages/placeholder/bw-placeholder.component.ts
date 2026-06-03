import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BW_NAV_ITEMS } from '../../documentation/navigation/nav.data';

/** Página "Em construção" data-driven, para rotas ainda não preenchidas (status soon/na). */
@Component({
  selector: 'bdl-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bw-placeholder.component.html',
  styleUrl: './bw-placeholder.component.scss',
})
export class BwPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly navPath = toSignal(
    this.route.data.pipe(map((d) => (d['navPath'] as string | undefined) ?? '')),
    { initialValue: '' },
  );
  protected readonly item = computed(() => BW_NAV_ITEMS.find((i) => i.path === this.navPath()));
  protected readonly title = computed(() => this.item()?.label ?? 'Page');
  protected readonly isNa = computed(() => this.item()?.status === 'na');
}
