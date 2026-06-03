import { Injectable, signal } from '@angular/core';

export type BwThemeMode = 'light' | 'dark';
export type BwDirection = 'ltr' | 'rtl';

/**
 * Estado de tema + direção do laboratório Base Web (espelha os switchers globais do
 * Ladle: theme Light/Dark + direction LTR/RTL). Escopado ao DS; não afeta o app.
 */
@Injectable({ providedIn: 'root' })
export class BwThemeService {
  private readonly _mode = signal<BwThemeMode>('light');
  private readonly _dir = signal<BwDirection>('ltr');

  readonly mode = this._mode.asReadonly();
  readonly direction = this._dir.asReadonly();

  toggleMode(): void {
    this._mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  }
  setMode(m: BwThemeMode): void {
    this._mode.set(m);
  }
  toggleDirection(): void {
    this._dir.update((d) => (d === 'ltr' ? 'rtl' : 'ltr'));
  }
}
