import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InputComponent } from '@shared/components/input/input.component';

@Component({
  selector: 'app-skills-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ButtonComponent, ChipScrollComponent, InputComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      @if (chips().length > 0) {
        <app-chip-scroll
          [chips]="chips()"
          [selected]="''"
          (chipSelect)="onChipSelect($event)"
        />
      }

      <div class="exp-track__form">
        <app-input
          label="Nova habilidade"
          placeholder="Digite e pressione Enter"
          [ngModel]="draft()"
          (ngModelChange)="draft.set($event)"
          (enter)="add()"
        />

        <div class="exp-track__form-actions">
          <app-button
            variant="secondary"
            size="sm"
            [disabled]="!canAdd()"
            (clicked)="add()"
          >
            Adicionar
          </app-button>
        </div>
      </div>

      <footer class="track-form-footer">
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class SkillsTrackComponent {
  readonly initialSkills = input.required<string[]>();
  readonly save = output<{ skills: string[] }>();

  protected readonly skills = signal<string[]>([]);
  protected readonly draft = signal<string>('');

  protected readonly chips = computed<ChipItem[]>(() =>
    this.skills().map((s) => ({ key: s, labelKey: s })),
  );

  protected readonly canAdd = computed(() => this.draft().trim().length > 0);

  private hasInit = false;

  constructor() {
    effect(() => {
      const initial = this.initialSkills();
      if (this.hasInit) return;
      this.skills.set([...initial]);
      this.hasInit = true;
    });
  }

  protected readonly isDirty = computed(
    () => JSON.stringify(this.skills()) !== JSON.stringify(this.initialSkills()),
  );

  protected add(): void {
    const value = this.draft().trim();
    if (!value) return;
    if (this.skills().includes(value)) {
      this.draft.set('');
      return;
    }
    this.skills.update((list) => [...list, value]);
    this.draft.set('');
  }

  protected onChipSelect(skill: string): void {
    if (window.confirm(`Remover "${skill}"?`)) {
      this.skills.update((list) => list.filter((s) => s !== skill));
    }
  }

  protected emitSave(): void {
    this.save.emit({ skills: this.skills() });
  }
}
