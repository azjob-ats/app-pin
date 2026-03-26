import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-4" [hidden]="!visible()" role="tabpanel">
      <ng-content />
    </div>
  `,
})
export class AppTabPanelComponent {
  readonly id = input.required<string>();

  private readonly visibleState = signal(false);
  readonly visible = this.visibleState.asReadonly();

  _setVisible(v: boolean): void {
    this.visibleState.set(v);
  }
}
