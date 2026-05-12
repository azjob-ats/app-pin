import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { Certification } from '@shared/interfaces/entity/creator-portfolio';

interface DraftCert {
  name: string;
  issuerName: string;
  issuedAt: string;
  credentialUrl: string;
}

const EMPTY: DraftCert = { name: '', issuerName: '', issuedAt: '', credentialUrl: '' };

@Component({
  selector: 'app-certifications-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      @if (items().length > 0) {
        <ul class="exp-track__list" role="list">
          @for (item of items(); track item.id) {
            <li class="exp-track__item">
              <div><strong>{{ item.name }}</strong> · {{ item.issuerName }}</div>
              <button type="button" class="exp-track__remove" (click)="remove(item.id)" aria-label="Remover">
                <span class="material-symbols-rounded icon-sm" aria-hidden="true">delete</span>
              </button>
            </li>
          }
        </ul>
      }

      <fieldset class="exp-track__form">
        <legend>Adicionar certificação</legend>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Nome</span>
            <input type="text" [value]="draft().name" (input)="patch({ name: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>Instituição</span>
            <input type="text" [value]="draft().issuerName" (input)="patch({ issuerName: $any($event.target).value })" />
          </label>
        </div>
        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Data de emissão</span>
            <input type="month" [value]="draft().issuedAt" (input)="patch({ issuedAt: $any($event.target).value })" />
          </label>
          <label class="exp-track__field">
            <span>URL da credencial (opcional)</span>
            <input type="url" [value]="draft().credentialUrl" (input)="patch({ credentialUrl: $any($event.target).value })" />
          </label>
        </div>
        <button type="button" class="exp-track__add-btn" (click)="addItem()" [disabled]="!canAdd()">
          Adicionar à lista
        </button>
      </fieldset>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ items().length }} certificação(ões)</span>
        <button type="button" class="track-form-footer__save" (click)="emitSave()" [disabled]="!isDirty()">
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class CertificationsTrackComponent {
  readonly initial = input.required<Certification[]>();
  readonly save = output<{ certifications: Certification[] }>();

  protected readonly items = signal<Certification[]>([]);
  protected readonly draft = signal<DraftCert>({ ...EMPTY });

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
    () => !!this.draft().name.trim() && !!this.draft().issuerName.trim() && !!this.draft().issuedAt,
  );

  protected readonly isDirty = computed(
    () => JSON.stringify(this.items()) !== JSON.stringify(this.initial()),
  );

  protected patch(p: Partial<DraftCert>): void {
    this.draft.update((d) => ({ ...d, ...p }));
  }

  protected addItem(): void {
    if (!this.canAdd()) return;
    const d = this.draft();
    const item: Certification = {
      id: `cert-${Date.now()}`,
      name: d.name.trim(),
      issuerName: d.issuerName.trim(),
      issuerLogoUrl: null,
      issuedAt: new Date(`${d.issuedAt}-01`),
      expiresAt: null,
      credentialUrl: d.credentialUrl.trim() || null,
    };
    this.items.update((list) => [...list, item]);
    this.draft.set({ ...EMPTY });
  }

  protected remove(id: string): void {
    this.items.update((list) => list.filter((e) => e.id !== id));
  }

  protected emitSave(): void {
    this.save.emit({ certifications: this.items() });
  }
}
