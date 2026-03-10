import { Directive, ElementRef, Renderer2, OnDestroy, input, inject } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onMouseEnter()',
    '(focusout)': 'onMouseLeave()',
  },
})
export class TooltipDirective implements OnDestroy {
  readonly appTooltip = input('');
  readonly tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');
  readonly tooltipDelay = input(0);

  private tooltipEl: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  onMouseEnter(): void {
    if (!this.appTooltip()) return;
    const delay = this.tooltipDelay();
    if (delay > 0) {
      this.showTimer = setTimeout(() => this.createTooltip(), delay);
    } else {
      this.createTooltip();
    }
  }

  onMouseLeave(): void {
    this.clearTimer();
    this.destroyTooltip();
  }

  private createTooltip(): void {
    this.destroyTooltip();
    const el: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(el, 'app-tooltip');
    this.renderer.setProperty(el, 'textContent', this.appTooltip());
    this.renderer.setAttribute(el, 'role', 'tooltip');
    this.renderer.setStyle(el, 'position', 'fixed');
    this.renderer.setStyle(el, 'pointerEvents', 'none');
    this.renderer.setStyle(el, 'zIndex', '10000');
    this.renderer.appendChild(document.body, el);
    this.tooltipEl = el;
    this.positionTooltip();
  }

  private destroyTooltip(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  private positionTooltip(): void {
    if (!this.tooltipEl) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tip = this.tooltipEl.getBoundingClientRect();
    const gap = 8;
    let top: number;
    let left: number;

    switch (this.tooltipPosition()) {
      case 'right':
        top = rect.top + rect.height / 2 - tip.height / 2;
        left = rect.right + gap;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tip.height / 2;
        left = rect.left - tip.width - gap;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tip.width / 2;
        break;
      default: // top
        top = rect.top - tip.height - gap;
        left = rect.left + rect.width / 2 - tip.width / 2;
    }

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
  }

  private clearTimer(): void {
    if (this.showTimer !== null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.destroyTooltip();
  }
}
