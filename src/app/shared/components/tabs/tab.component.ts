import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="tab-btn text-base fw-semibold text-3xl-title"
      [class.active]="active()"
      (click)="_onClick()"
      role="tab"
      [attr.aria-selected]="active()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './tab.component.scss',
})
export class AppTabComponent {
  readonly id = input.required<string>();

  private readonly activeState = signal(false);
  readonly active = this.activeState.asReadonly();

  _setActive(v: boolean): void {
    this.activeState.set(v);
  }

  _onClick: () => void = () => {};
}
