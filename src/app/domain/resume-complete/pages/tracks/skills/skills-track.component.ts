import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-skills-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="skills-track">
      <p class="skills-track__hint">Adicione 3 ou mais habilidades para concluir este trilho.</p>

      <ul class="skills-track__chips" role="list">
        @for (skill of skills(); track skill) {
          <li class="skills-track__chip">
            {{ skill }}
            <button type="button" class="skills-track__remove" (click)="remove(skill)" aria-label="Remover">
              <span class="material-symbols-rounded icon-sm" aria-hidden="true">close</span>
            </button>
          </li>
        }
      </ul>

      <div class="skills-track__add">
        <input
          type="text"
          class="skills-track__input"
          placeholder="Digite uma habilidade e pressione Enter"
          [value]="draft()"
          (input)="onInput($event)"
          (keydown.enter)="add()"
          aria-label="Nova habilidade"
        />
        <button type="button" class="skills-track__add-btn" (click)="add()" [disabled]="!draft().trim()">
          Adicionar
        </button>
      </div>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ skills().length }} habilidades</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
  styleUrl: './skills-track.component.scss',
})
export class SkillsTrackComponent {
  readonly initialSkills = input.required<string[]>();
  readonly save = output<{ skills: string[] }>();

  protected readonly skills = signal<string[]>([]);
  protected readonly draft = signal<string>('');
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

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.draft.set(target.value);
  }

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

  protected remove(skill: string): void {
    this.skills.update((list) => list.filter((s) => s !== skill));
  }

  protected emitSave(): void {
    this.save.emit({ skills: this.skills() });
  }
}
