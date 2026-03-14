import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-splitbutton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './splitbutton.component.html',
  styleUrl: './splitbutton.component.scss',
})
export class SplitButtonComponent {
  readonly label = input<string>('');
  readonly badge = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly mainClicked = output<void>();
  readonly dropdownToggled = output<boolean>();

  readonly isOpen = signal(false);
  readonly panelTop = signal(0);
  readonly panelLeft = signal(0);
  readonly panelWidth = signal(0);

  private readonly wrapperRef = viewChild<ElementRef<HTMLElement>>('wrapper');

  onMainClick(): void {
    if (this.disabled()) return;
    this.mainClicked.emit();
  }

  onDropdownClick(event: MouseEvent): void {
    if (this.disabled()) return;
    event.stopPropagation();

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.dropdownToggled.emit(false);
  }

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {
    this.close();
  }
  isRequired(): boolean {
    return false;
  }

  private open(): void {
    const el = this.wrapperRef()?.nativeElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      this.panelTop.set(rect.bottom + 8);
      this.panelLeft.set(rect.left);
      this.panelWidth.set(rect.width);
    }
    this.isOpen.set(true);
    this.dropdownToggled.emit(true);
  }
}
