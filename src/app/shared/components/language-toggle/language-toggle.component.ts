import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { LanguageService } from '@shared/services/language.service';
import { Language } from '@shared/enums/language.enum';

@Component({
  selector: 'app-language-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './language-toggle.component.scss',
  template: `
    <ul class="toggle-list" role="list">
      @for (lang of languageService.languages; track lang.code) {
        <li>
          <button
            class="toggle-list__row"
            type="button"
            [attr.aria-pressed]="languageService.currentLang() === lang.code"
            (click)="languageService.setLang(lang.code)">
            <span class="toggle-list__label">{{ lang.label }}</span>
            @if (languageService.currentLang() === lang.code) {
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
export class LanguageToggleComponent {
  readonly languageService = inject(LanguageService);

  setLang(code: Language): void {
    this.languageService.setLang(code);
  }
}
