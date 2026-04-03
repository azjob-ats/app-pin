import { Component, ChangeDetectionStrategy, input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-section-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-item',
    role: 'listitem',
    '[class.section-item--clickable]': 'clickable()',
  },
  template: `
    <ng-content select="[item-start]" />
    <div class="section-item__content">
      <ng-content />
    </div>
    <ng-content select="[item-end]" />
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--pin-border, rgba(0, 0, 0, 0.1));
      background: transparent;
      transition: background-color 0.2s ease;

      &:last-child {
        border-bottom: none;
      }
    }

    :host.section-item--clickable {
      cursor: pointer;
      @media (hover: hover) {
        &:hover {
          background-color: var(--pin-hover, rgba(0, 0, 0, 0.02));
        }
      }
    }

    .section-item__content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
  `,
})
export class SectionItemComponent {
  clickable = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'app-section-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-list',
    role: 'list',
  },
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      list-style: none;
      margin: 0;
      padding: 0;
      border: 1px solid var(--pin-border, rgba(0, 0, 0, 0.1));
      border-radius: 0.75rem;
      overflow: hidden;
    }
  `,
})
export class SectionListComponent {}
