import { Component, ChangeDetectionStrategy, input, computed, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { LightDarkToggleComponent } from '@shared/components/light-dark-toggle/light-dark-toggle.component';
import { LanguageToggleComponent } from '@shared/components/language-toggle/language-toggle.component';
import { CodeDigitsComponent } from '@shared/components/code-digits/code-digits.component';
import { RadioGroupComponent } from '@shared/components/radio-group/radio-group.component';
import { AccountInfoMenuComponent } from '@shared/components/account-info-menu/account-info-menu.component';
import { ChangePasswordMenuComponent } from '@shared/components/change-password-menu/change-password-menu.component';
import { NotificationSettingsMenuComponent } from '@shared/components/notification-settings-menu/notification-settings-menu.component';
import { ConnectedDevicesMenuComponent } from '@shared/components/connected-devices-menu/connected-devices-menu.component';
import { ConsentManagementMenuComponent } from '@shared/components/consent-management-menu/consent-management-menu.component';
import { DeactivateAccountMenuComponent } from '@shared/components/deactivate-account-menu/deactivate-account-menu.component';
import { DownloadDataMenuComponent } from '@shared/components/download-data-menu/download-data-menu.component';
import { ActivityVisibilityMenuComponent } from '@shared/components/activity-visibility-menu/activity-visibility-menu.component';
import { ClearHistoryMenuComponent } from '@shared/components/clear-history-menu/clear-history-menu.component';
import { DeleteAccountMenuComponent } from '@shared/components/delete-account-menu/delete-account-menu.component';
import { SendFeedbackMenuComponent } from '@shared/components/send-feedback-menu/send-feedback-menu.component';
import { HelpCenterMenuComponent } from '@shared/components/help-center-menu/help-center-menu.component';
import { HireSupportMenuComponent } from '@shared/components/hire-support-menu/hire-support-menu.component';
import { TermsAndPoliciesMenuComponent } from '@shared/components/terms-and-policies-menu/terms-and-policies-menu.component';
import { AppVersionMenuComponent } from '@shared/components/app-version-menu/app-version-menu.component';
import { AboutRealweMenuComponent } from '@shared/components/about-realwe-menu/about-realwe-menu.component';

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
  AccountInfoMenuComponent,
  ChangePasswordMenuComponent,
  NotificationSettingsMenuComponent,
  ConnectedDevicesMenuComponent,
  ConsentManagementMenuComponent,
  DeactivateAccountMenuComponent,
  DownloadDataMenuComponent,
  ActivityVisibilityMenuComponent,
  ClearHistoryMenuComponent,
  DeleteAccountMenuComponent,
  SendFeedbackMenuComponent,
  HelpCenterMenuComponent,
  HireSupportMenuComponent,
  TermsAndPoliciesMenuComponent,
  AppVersionMenuComponent,
  AboutRealweMenuComponent,
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
