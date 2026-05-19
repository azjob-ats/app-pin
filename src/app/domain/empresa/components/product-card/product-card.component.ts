import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { Product } from '@shared/interfaces/entity/empresa-product';
import {
  PRODUCT_TYPE_META,
  ProductTypeMeta,
} from '@domain/empresa/constants/product-presets';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="product-card"
      [style.--product-accent]="typeMeta().color"
      [attr.aria-label]="'Produto: ' + product().title"
    >
      <header class="product-card__header">
        <span class="product-card__type-badge" [title]="typeMeta().label">
          <span class="material-symbols-rounded" aria-hidden="true">{{ typeMeta().icon }}</span>
          <span>{{ typeMeta().label }}</span>
        </span>
        <span class="product-card__metrics" aria-label="métricas do produto">
          <span title="Submissões">
            <span class="material-symbols-rounded" aria-hidden="true">inbox</span>
            {{ product().metrics.submissions }}
          </span>
          <span title="Visualizações">
            <span class="material-symbols-rounded" aria-hidden="true">visibility</span>
            {{ product().metrics.views }}
          </span>
        </span>
      </header>

      <h3 class="product-card__title">{{ product().title }}</h3>
      @if (product().subtitle) {
        <p class="product-card__subtitle">{{ product().subtitle }}</p>
      }

      @if (badges().length > 0) {
        <ul class="product-card__badges" aria-label="características">
          @for (badge of badges(); track badge) {
            <li>{{ badge }}</li>
          }
        </ul>
      }

      @if (product().location) {
        <p class="product-card__location">
          <span class="material-symbols-rounded" aria-hidden="true">place</span>
          {{ product().location }}
        </p>
      }
    </div>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  readonly typeMeta = computed<ProductTypeMeta>(() => PRODUCT_TYPE_META[this.product().type]);
  readonly badges = computed<readonly string[]>(() => this.product().badges.slice(0, 3));
}
