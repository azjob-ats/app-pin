import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutRealweMenuComponent } from '@shared/components/about-realwe-menu/about-realwe-menu.component';

@Component({
  selector: 'app-about-realwe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AboutRealweMenuComponent],
  template: `<app-about-realwe-menu />`,
})
export class AboutRealweComponent {}
