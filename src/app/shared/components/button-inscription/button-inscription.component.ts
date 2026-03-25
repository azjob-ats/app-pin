import { Component, ChangeDetectionStrategy, input, output, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-inscription',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="btn-inscription">
      @if (!isSubscribed()) {
        <button
          class="btn-inscription__btn flex align-center justify-center radius-5 bg-secondary text-2 fw-bold px-4"
          type="button"
          (click)="subscribe()"
        >
          Inscrever-se
        </button>
      } @else {
        <div class="btn-inscription__wrap">
          <button
            class="btn-inscription__btn flex align-center gap-1 radius-5 bg-secondary text-2 fw-bold px-4"
            type="button"
            [attr.aria-expanded]="isMenuOpen()"
            (click)="toggleMenu()"
          >
            <span class="material-symbols-rounded btn-inscription__bell">notifications</span>
            <span class="material-symbols-rounded">expand_more</span>
          </button>

          @if (isMenuOpen()) {
            <div class="btn-inscription__backdrop" role="presentation" (click)="closeMenu()"></div>
            <div class="btn-inscription__dropdown" role="menu">
              <button
                class="btn-inscription__menu-item text-3"
                type="button"
                role="menuitem"
                (click)="unsubscribe()"
              >
                Cancelar inscrição
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './button-inscription.component.scss',
})
export class ButtonInscriptionComponent implements OnInit {
  readonly subscribed = input(false);

  readonly subscribedChange = output<boolean>();

  readonly isSubscribed = signal(false);
  readonly isMenuOpen = signal(false);

  ngOnInit(): void {
    this.isSubscribed.set(this.subscribed());
  }

  subscribe(): void {
    this.isSubscribed.set(true);
    this.subscribedChange.emit(true);
  }

  unsubscribe(): void {
    this.isSubscribed.set(false);
    this.isMenuOpen.set(false);
    this.subscribedChange.emit(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  enable(): void {}
  disable(): void {}

  resetToInitialState(): void {
    this.isSubscribed.set(this.subscribed());
    this.isMenuOpen.set(false);
  }

  isRequired(): boolean {
    return false;
  }
}
