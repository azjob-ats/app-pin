import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme.service';
import { Theme } from '@shared/enums/theme.enum';

@Component({
  selector: 'app-light-dark-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './light-dark-toggle.component.scss',
  template: `
    <ul class="toggle-list" role="list">
      @for (opt of options; track opt.value) {
        <li>
          <button
            class="toggle-list__row"
            type="button"
            [attr.aria-pressed]="themeService.theme() === opt.value"
            (click)="themeService.setTheme(opt.value)">
            <span class="toggle-list__label">{{ opt.label }}</span>
            @if (themeService.theme() === opt.value) {
              <span class="material-symbols-rounded toggle-list__check" aria-hidden="true">
                check
              </span>
            }
          </button>
        </li>
      }
    </ul>
  `,
})
export class LightDarkToggleComponent {
  readonly themeService = inject(ThemeService);

  readonly options: { value: Theme; label: string }[] = [
    { value: Theme.Dark, label: 'Escuro' },
    { value: Theme.Light, label: 'Claro' },
  ];
}
