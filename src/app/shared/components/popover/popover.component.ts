import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';

@Component({
  selector: 'app-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  readonly styleClass = input('');

  readonly isVisible = signal(false);
  readonly panelTop = signal(0);
  readonly panelLeft = signal(0);

  toggle(event: Event): void {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show(event);
    }
  }

  hide(): void {
    this.isVisible.set(false);
  }

  private show(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.panelTop.set(rect.bottom + 8);
    this.panelLeft.set(rect.left);
    this.isVisible.set(true);
  }
}
