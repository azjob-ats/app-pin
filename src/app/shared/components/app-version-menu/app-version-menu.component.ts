import { Component, ChangeDetectionStrategy } from '@angular/core';

const APP_INFO = {
  version: '0.1.0-beta',
  lastUpdate: '2026-03-30',
  copyright: `© 2026 RealWe. Todos os direitos reservados.`,
};

@Component({
  selector: 'app-app-version-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-version-menu.component.scss',
  template: `
    <div class="app-version">
      <header class="app-version__header">
        <span class="material-symbols-rounded app-version__icon" aria-hidden="true">sdk</span>
        <h1 class="app-version__title">Sobre o App</h1>
        <p class="app-version__subtitle">
          Confira a versão atual da plataforma, data da última atualização e informações de Copyright.
        </p>
      </header>

      <ul class="app-version__list" role="list">
        <li class="app-version__item">
          <span class="app-version__item-label">Versão</span>
          <span class="app-version__item-value">{{ version }}</span>
        </li>
        <li class="app-version__item">
          <span class="app-version__item-label">Última atualização</span>
          <span class="app-version__item-value">{{ lastUpdate }}</span>
        </li>
        <li class="app-version__item app-version__item--full">
          <span class="app-version__item-label">Copyright</span>
          <span class="app-version__item-value">{{ copyright }}</span>
        </li>
      </ul>
    </div>
  `,
})
export class AppVersionMenuComponent {
  readonly version = APP_INFO.version;
  readonly lastUpdate = APP_INFO.lastUpdate;
  readonly copyright = APP_INFO.copyright;
}
