import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface ChipItem {
  key: string;
  icon?: string;
  labelKey: string;
}

@Component({
  selector: 'app-chip-scroll',
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chip-scroll.component.scss',
  template: `
    <div class="chip-scroll-bar">
      <div class="chip-scroll-track">
        @for (chip of chips(); track chip.key) {
          <button
            class="chip"
            [class.active]="selected() === chip.key"
            (click)="chipSelect.emit(chip.key)"
          >
            @if (chip.icon) {
              <span class="material-symbols-rounded">{{ chip.icon }}</span>
            }
            <span>{{ chip.labelKey | translate }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class ChipScrollComponent {
  readonly chips = input.required<ChipItem[]>();
  readonly selected = input<string>('');
  readonly chipSelect = output<string>();

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}
