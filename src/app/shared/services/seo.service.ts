import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const DEFAULT_TITLE = 'RealWe';
const DEFAULT_DESCRIPTION =
  'Plataforma onde empresas mostram como realmente trabalham, por meio de conteúdos criados pelos próprios colaboradores.';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  setPage(pageTitle: string, description?: string): void {
    const fullTitle = `${pageTitle} | ${DEFAULT_TITLE}`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    this.title.setTitle(fullTitle);
    this.updateMeta(fullTitle, desc);
  }

  setDefault(): void {
    this.title.setTitle(DEFAULT_TITLE);
    this.updateMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION);
  }

  private updateMeta(pageTitle: string, description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
