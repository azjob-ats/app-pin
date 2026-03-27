import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@shared/enums/language.enum';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'pin-lang';
  readonly currentLang = signal<Language>(this.getInitialLang());

  readonly languages = [
    { code: Language.PT, label: 'Português', flag: '🇧🇷' },
    { code: Language.EN, label: 'English', flag: '🇺🇸' },
    { code: Language.ES, label: 'Español', flag: '🇪🇸' },
  ];

  constructor(private translate: TranslateService) {
    translate.addLangs([Language.PT, Language.EN, Language.ES]);
    translate.setDefaultLang(Language.PT);
    this.setLang(this.currentLang());
  }

  setLang(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.translate.use(lang);
    document.documentElement.lang = lang === Language.PT ? 'pt-BR' : lang;
  }

  private getInitialLang(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    if (stored && Object.values(Language).includes(stored)) return stored;
    const browser = navigator.language.substring(0, 2).toLowerCase();
    if (browser === 'pt') return Language.PT;
    if (browser === 'es') return Language.ES;
    return Language.PT;
  }
}
