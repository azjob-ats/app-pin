import { Injectable, Type } from '@angular/core';
import { NewsletterSignupComponent } from '@shared/components/slot/newsletter-signup/newsletter-signup.component';

/**
 * Resolve componentes Angular a partir do `componentId` recebido em
 * `WinningSlotComponentMedia.componentId`.
 *
 * Regra: o `componentId` da API deve coincidir com o nome da pasta/arquivo
 * do componente em `@shared/components/slot/<componentId>/`. Cada novo slot
 * dinâmico precisa registrar a chave aqui.
 */
@Injectable({ providedIn: 'root' })
export class SlotComponentRegistryService {
  private readonly registry = new Map<string, Type<unknown>>([
    ['newsletter-signup', NewsletterSignupComponent],
  ]);

  resolve(componentId: string): Type<unknown> | null {
    return this.registry.get(componentId) ?? null;
  }
}
