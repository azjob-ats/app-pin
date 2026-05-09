import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { Education } from '@shared/interfaces/entity/creator-portfolio';

interface DraftEdu {
  institutionName: string;
  course: string;
  startDate: string;
  endDate: string;
}

const EMPTY: DraftEdu = { institutionName: '', course: '', startDate: '', endDate: '' };

@Component({
  selector: 'app-education-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: '../experience/experience-track.component.scss',
  template: `
    <div class="exp-track">
      @if (items().length > 0) {
        <ul class="exp-track__list" role="list">
          @for (item of items(); track item.id) {
            <li class="exp-track__item">
              <div><strong>{{ item.course }}</strong> · {{ item.institutionName }}</div>
              <button type="button" class="exp-track__remove" (click)="remove(item.id)" aria-label="Remover">
                <span class="material-symbols-rounded icon-sm" aria-hidden="true">delete</span>
              </button>
            </li>
          }
        </ul>
      }

      <fieldset class="exp-track__form">
        <legend>Adicionar formação</legend>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Instituição</span>
            <input type="text" [value]="draft().institutionName" (input)="patch({ institutionName: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Curso</span>
            <input type="text" [value]="draft().course" (input)="patch({ course: $any($event.target).value })" />
          </label>
        </div>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Início</span>
            <input type="month" [value]="draft().startDate" (input)="patch({ startDate: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Fim (opcional)</span>
            <input type="month" [value]="draft().endDate" (input)="patch({ endDate: $any($event.target).value })" />
          </label>
        </div>
        <button type="button" class="exp-track__add-btn" (click)="addItem()" [disabled]="!canAdd()">
          Adicionar à lista
        </button>
      </fieldset>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ items().length }} formação(ões)</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class EducationTrackComponent {
  readonly initial = input.required<Education[]>();
  readonly save = output<{ educations: Education[] }>();

  protected readonly items = signal<Education[]>([]);
  protected readonly draft = signal<DraftEdu>({ ...EMPTY });

  private hasInit = false;

  constructor() {
    effect(() => {
      const initial = this.initial();
      if (this.hasInit) return;
      this.items.set([...initial]);
      this.hasInit = true;
    });
  }

  protected readonly canAdd = computed(
    () => !!this.draft().institutionName.trim() && !!this.draft().course.trim() && !!this.draft().startDate,
  );

  protected readonly isDirty = computed(
    () => JSON.stringify(this.items()) !== JSON.stringify(this.initial()),
  );

  protected patch(p: Partial<DraftEdu>): void {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const item: Education = {
      id: `edu-${Date.now()}`,
      institutionName: d.institutionName.trim(),
      institutionLogoUrl: null,
      course: d.course.trim(),
      startDate: new Date(`${d.startDate}-01`),
      endDate: d.endDate ? new Date(`${d.endDate}-01`) : null,
    };
    this.items.update((list) => [...list, item]);
    this.draft.set({ ...EMPTY });
  }

  protected remove(id: string): void {
    this.items.update((list) => list.filter((e) => e.id !== id));
  }

  protected emitSave(): void {
    this.save.emit({ educations: this.items() });
  }
}
