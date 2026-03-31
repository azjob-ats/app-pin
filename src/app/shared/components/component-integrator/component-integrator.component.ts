import { Component, ChangeDetectionStrategy, input, computed, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { LightDarkToggleComponent } from '@shared/components/light-dark-toggle/light-dark-toggle.component';
import { LanguageToggleComponent } from '@shared/components/language-toggle/language-toggle.component';
import { CodeDigitsComponent } from '@shared/components/code-digits/code-digits.component';
import { RadioGroupComponent } from '@shared/components/radio-group/radio-group.component';

/**
 * Registry that maps component name strings (as returned by the API)
 * to their Angular component classes.
 *
 * To register a new component, add an entry here:
 *   MyNewComponent: MyNewComponent
 */
const COMPONENT_REGISTRY: Record<string, Type<unknown>> = {
  LightDarkToggleComponent,
  LanguageToggleComponent,
  CodeDigitsComponent,
  RadioGroupComponent,
};

@Component({
  selector: 'app-component-integrator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  template: `
    @if (resolvedComponent()) {
      <ng-container [ngComponentOutlet]="resolvedComponent()!" />
    } @else {
      <p class="component-integrator__fallback">
        Componente "{{ componentName() }}" não encontrado.
      </p>
    }
  `,
  styles: `
    .component-integrator__fallback {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      color: var(--pin-text-muted, var(--pin-text));
    }
  `,
})
export class ComponentIntegratorComponent {
  readonly componentName = input.required<string>();

  readonly resolvedComponent = computed(
    (): Type<unknown> | null => COMPONENT_REGISTRY[this.componentName()] ?? null,
  );
}
