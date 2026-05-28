import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empresa-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="emp-page-header">
      <div class="emp-page-header__copy">
        @if (eyebrow()) {
          <span class="emp-page-header__eyebrow">{{ eyebrow() }}</span>
        }
        <h1 class="emp-page-header__title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="emp-page-header__subtitle">{{ subtitle() }}</p>
        }
      </div>

      <div class="emp-page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styleUrl: './empresa-page-header.component.scss',
})
export class EmpresaPageHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
