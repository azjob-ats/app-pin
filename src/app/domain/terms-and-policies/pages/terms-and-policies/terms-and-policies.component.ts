import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TermsAndPoliciesMenuComponent } from '@shared/components/terms-and-policies-menu/terms-and-policies-menu.component';

@Component({
  selector: 'app-terms-and-policies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TermsAndPoliciesMenuComponent],
  template: `<app-terms-and-policies-menu />`,
})
export class TermsAndPoliciesComponent {}
