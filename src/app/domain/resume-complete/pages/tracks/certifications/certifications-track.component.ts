import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChipItem, ChipScrollComponent } from '@shared/components/chip-scroll/chip-scroll.component';
import { InputComponent } from '@shared/components/input/input.component';
import { Certification } from '@shared/interfaces/entity/creator-portfolio';

interface DraftCert {
  name: string;
  issuerName: string;
  issuedAt: string;
  credentialUrl: string;
}

const EMPTY: DraftCert = { name: '', issuerName: '', issuedAt: '', credentialUrl: '' };

function toMonthInput(date: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

@Component({
  selector: 'app-certifications-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ButtonComponent, ChipScrollComponent, InputComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      @if (chips().length > 0) {
        <app-chip-scroll
          [chips]="chips()"
          [selected]="editingId() ?? ''"
          (chipSelect)="onChipSelect($event)"
        />
      }

      <div class="exp-track__form">
        <div class="exp-track__row">
          <app-input
            label="Nome"
            [ngModel]="draft().name"
            (ngModelChange)="patch({ name: $event })"
          />
          <app-input
            label="Instituição"
            [ngModel]="draft().issuerName"
            (ngModelChange)="patch({ issuerName: $event })"
          />
        </div>

        <div class="exp-track__row">
          <label class="exp-track__field">
            <span>Data de emissão</span>
            <input type="month" [value]="draft().issuedAt" (input)="patch({ issuedAt: $any($event.target).value })" />
          </label>
          <app-input
            label="URL da credencial (opcional)"
            type="url"
            [ngModel]="draft().credentialUrl"
            (ngModelChange)="patch({ credentialUrl: $event })"
          />
        </div>

        <div class="exp-track__form-actions">
          <app-button
            variant="secondary"
            size="sm"
            [disabled]="!canAdd()"
            (clicked)="addItem()"
          >
            {{ isEditing() ? 'Atualizar' : 'Adicionar à lista' }}
          </app-button>

          @if (isEditing()) {
            <app-button
              variant="secondary"
              size="sm"
              (clicked)="cancelEdit()"
            >
              Cancelar
            </app-button>

            <app-button
              variant="secondary"
              size="sm"
              ariaLabel="Excluir certificação"
              (clicked)="removeCurrent()"
            >
              Excluir
            </app-button>
          }
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
export class CertificationsTrackComponent {
  readonly initial = input.required<Certification[]>();
  readonly save = output<{ certifications: Certification[] }>();

  protected readonly items = signal<Certification[]>([]);
  protected readonly draft = signal<DraftCert>({ ...EMPTY });
  protected readonly editingId = signal<string | null>(null);

  protected readonly chips = computed<ChipItem[]>(() =>
    this.items().map((e) => ({ key: e.id, labelKey: e.name })),
  );

  protected readonly isEditing = computed(() => this.editingId() !== null);

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
    const editing = this.editingId();
    const id = editing ?? `cert-${Date.now()}`;
    const item: Certification = {
      id,
      name: d.name.trim(),
      issuerName: d.issuerName.trim(),
      issuerLogoUrl: null,
      issuedAt: new Date(`${d.issuedAt}-01`),
      expiresAt: null,
      credentialUrl: d.credentialUrl.trim() || null,
    };

    if (editing) {
      this.items.update((list) => list.map((e) => (e.id === editing ? item : e)));
    } else {
      this.items.update((list) => [...list, item]);
    }

    this.cancelEdit();
  }

  protected onChipSelect(id: string): void {
    const item = this.items().find((e) => e.id === id);
    if (!item) return;
    this.draft.set({
      name: item.name,
      issuerName: item.issuerName,
      issuedAt: toMonthInput(item.issuedAt),
      credentialUrl: item.credentialUrl ?? '',
    });
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.draft.set({ ...EMPTY });
    this.editingId.set(null);
  }

  protected removeCurrent(): void {
    const editing = this.editingId();
    if (!editing) return;
    this.items.update((list) => list.filter((e) => e.id !== editing));
    this.cancelEdit();
  }

  protected emitSave(): void {
    this.save.emit({ certifications: this.items() });
  }
}
