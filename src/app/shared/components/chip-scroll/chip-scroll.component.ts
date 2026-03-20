import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild, viewChildren } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SplitButtonComponent } from '../splitbutton/splitbutton.component';

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
      <div class="chip-scroll-track" #track>
        @for (chip of chips(); track chip.key) {
          <button
            #chipBtn
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

  private readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');
  private readonly chipRefs = viewChildren<ElementRef<HTMLButtonElement>>('chipBtn');

  constructor() {
    effect(() => {
      const selected = this.selected();
      const chips = this.chips();
      const refs = this.chipRefs();
      const track = this.trackRef()?.nativeElement;
      const idx = chips.findIndex(c => c.key === selected);
      if (idx !== -1 && refs[idx] && track) {
        const chip = refs[idx].nativeElement;
        const chipLeft = chip.offsetLeft;
        const chipRight = chipLeft + chip.offsetWidth;
        const { scrollLeft, offsetWidth } = track;
        if (chipLeft < scrollLeft) {
          track.scrollLeft = chipLeft;
        } else if (chipRight > scrollLeft + offsetWidth) {
          track.scrollLeft = chipRight - offsetWidth;
        }
      }
    });

    effect((onCleanup) => {
      const track = this.trackRef()?.nativeElement;
      if (!track) return;

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };

      const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        track.style.cursor = 'grab';
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) isDragging = true;
        track.scrollLeft = scrollLeft - walk;
      };

      const onClickCapture = (e: Event) => {
        if (isDragging) {
          e.stopPropagation();
          isDragging = false;
        }
      };

      track.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      track.addEventListener('click', onClickCapture, true);

      onCleanup(() => {
        track.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        track.removeEventListener('click', onClickCapture, true);
      });
    });
  }

  enable(): void {}
  disable(): void {}
  resetToInitialState(): void {}
  isRequired(): boolean { return false; }
}

@Component({
  selector: 'app-chip-scroll-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, SplitButtonComponent],
  styleUrl: './chip-scroll.component.scss',
  template: `
    <div class="chip-scroll-bar">
      <div class="chip-scroll-track" #track>
        @for (chip of chips(); track chip.key) {
          @if(chip.labelKey == 'Produto'){
            <app-splitbutton
              #chipBtn
              [label]="chip.labelKey"
              [badge]="true"
              (mainClicked)="onEmpresasClick()"
            >
              <!-- conteúdo do modal/painel aqui class="text-color-accent" -->
         
              <div style="display: flex !important; justify-content: space-between; align-items: center;" >
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Tema
                  </p>
                  <p style="font-size: 16px;">
                    
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>
              <div style="display: flex !important; justify-content: space-between; align-items: center;">
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Duração do video
                  </p>
                  <p style="font-size: 16px;">
                    
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>
              <div style="display: flex !important; justify-content: space-between; align-items: center;">
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Idioma
                  </p>
                  <p style="font-size: 16px;">
                    
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>
              <div style="display: flex !important; justify-content: space-between; align-items: center;">
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Data de publicação
                  </p>
                  <p style="font-size: 16px;">
                    
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>
              <div style="display: flex !important; justify-content: space-between; align-items: center;" class="text-color-accent">
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Popularidade
                  </p>
                  <p style="font-size: 16px;">
                    Mais recentes
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>
              <div style="display: flex !important; justify-content: space-between; align-items: center;">
                <div class="" style="padding: 5px;">
                  <p class="drawer-action-text" style="font-size: 16px; font-weight: bold !important;">
                    Origem do conteúdo
                  </p>
                  <p style="font-size: 16px;">
                    
                  </p>
                </div>
                <div class="flex: 0 0 auto; width: 8.3333%;" style="padding: 8px;">
                  <div style="display: flex !important; justify-content: flex-end !important; align-items: center !important; height: 100% !important; padding: 0rem !important;">
                    <span class="material-symbols-rounded">arrow_forward_ios</span>
                  </div>
                </div>
              </div>
              <br>


            </app-splitbutton>
          }@else {
          <button
            #chipBtn
            class="chip"
            [class.active]="selected() === chip.key"
            (click)="chipSelect.emit(chip.key)"
          >
            <span>{{ chip.labelKey }}</span>
          </button>
          }
        }
      </div>
    </div>
  `,
})
export class ChipScrollTextComponent extends ChipScrollComponent {
    onEmpresasClick(){

    }
}
