import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-label-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class LabelButtonComponent {}
