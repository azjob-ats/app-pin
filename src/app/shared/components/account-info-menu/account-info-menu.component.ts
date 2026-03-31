import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

interface AccountField {
  id: string;
  icon: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  editing: boolean;
  hint?: string;
}

type SaveStatus = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'app-account-info-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent, ButtonComponent],
  styleUrl: './account-info-menu.component.scss',
  template: `
    <div class="account-info">

      <header class="account-info__hero">
        <span class="material-symbols-rounded account-info__hero-icon" aria-hidden="true">account_circle</span>
        <h1 class="account-info__hero-title">Informações da conta</h1>
        <p class="account-info__hero-description">
          Atualize as informações da sua conta, como número de telefone,
          endereço de e-mail e nome de usuário.
        </p>
      </header>

      <section class="account-info__section" aria-labelledby="identity-heading">
        <h2 id="identity-heading" class="account-info__section-title">Identidade</h2>
        <ul class="account-info__list" role="list">
          @for (field of identityFields(); track field.id) {
            <li class="account-info__item">
              @if (!field.editing) {
                <div class="account-info__field-view">
                  <span class="material-symbols-rounded account-info__field-icon" aria-hidden="true">{{ field.icon }}</span>
                  <div class="account-info__field-body">
                    <span class="account-info__field-label">{{ field.label }}</span>
                    <span class="account-info__field-value">{{ field.value || '—' }}</span>
                  </div>
                  <button
                    type="button"
                    class="account-info__edit-btn"
                    [attr.aria-label]="'Editar ' + field.label"
                    (click)="startEdit(field.id)"
                  >
                    <span class="material-symbols-rounded" aria-hidden="true">edit</span>
                  </button>
                </div>
              } @else {
                <div class="account-info__field-edit">
                  <app-input
                    [label]="field.label"
                    [type]="field.type"
                    [placeholder]="field.placeholder"
                    [hint]="field.hint || ''"
                    [(ngModel)]="drafts[field.id]"
                    [attr.name]="field.id"
                  />
                  <div class="account-info__field-actions">
                    <app-button variant="ghost" size="sm" (clicked)="cancelEdit(field.id)">
                      Cancelar
                    </app-button>
                    <app-button
                      variant="primary"
                      size="sm"
                      [loading]="savingFieldId() === field.id"
                      (clicked)="saveField(field.id)"
                    >
                      Salvar
                    </app-button>
                  </div>
                </div>
              }
            </li>
          }
        </ul>
      </section>

      <section class="account-info__section" aria-labelledby="contact-heading">
        <h2 id="contact-heading" class="account-info__section-title">Contato</h2>
        <ul class="account-info__list" role="list">
          @for (field of contactFields(); track field.id) {
            <li class="account-info__item">
              @if (!field.editing) {
                <div class="account-info__field-view">
                  <span class="material-symbols-rounded account-info__field-icon" aria-hidden="true">{{ field.icon }}</span>
                  <div class="account-info__field-body">
                    <span class="account-info__field-label">{{ field.label }}</span>
                    <span class="account-info__field-value">{{ field.value || '—' }}</span>
                  </div>
                  <button
                    type="button"
                    class="account-info__edit-btn"
                    [attr.aria-label]="'Editar ' + field.label"
                    (click)="startEdit(field.id)"
                  >
                    <span class="material-symbols-rounded" aria-hidden="true">edit</span>
                  </button>
                </div>
              } @else {
                <div class="account-info__field-edit">
                  <app-input
                    [label]="field.label"
                    [type]="field.type"
                    [placeholder]="field.placeholder"
                    [hint]="field.hint || ''"
                    [(ngModel)]="drafts[field.id]"
                    [attr.name]="field.id"
                  />
                  <div class="account-info__field-actions">
                    <app-button variant="ghost" size="sm" (clicked)="cancelEdit(field.id)">
                      Cancelar
                    </app-button>
                    <app-button
                      variant="primary"
                      size="sm"
                      [loading]="savingFieldId() === field.id"
                      (clicked)="saveField(field.id)"
                    >
                      Salvar
                    </app-button>
                  </div>
                </div>
              }
            </li>
          }
        </ul>
      </section>

      <section class="account-info__section" aria-labelledby="danger-heading">
        <h2 id="danger-heading" class="account-info__section-title">Zona de risco</h2>
        <div class="account-info__danger-list">
          <div class="account-info__danger-item">
            <div class="account-info__danger-body">
              <strong class="account-info__danger-title">Desativar conta</strong>
              <span class="account-info__danger-description">
                Oculhe temporariamente seu perfil. Você pode reativar a qualquer momento.
              </span>
            </div>
            <a class="account-info__danger-link" href="/deactivate-account">
              Desativar
            </a>
          </div>
          <div class="account-info__danger-item account-info__danger-item--critical">
            <div class="account-info__danger-body">
              <strong class="account-info__danger-title">Encerrar conta</strong>
              <span class="account-info__danger-description">
                Exclua permanentemente sua conta e todos os seus dados.
              </span>
            </div>
            <a class="account-info__danger-link account-info__danger-link--critical" href="/delete-account">
              Encerrar
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
})
export class AccountInfoMenuComponent {
  readonly fields = signal<AccountField[]>([
    {
      id: 'name',
      icon: 'badge',
      label: 'Nome completo',
      value: 'Maria Silva',
      type: 'text',
      placeholder: 'Seu nome completo',
      editing: false,
    },
    {
      id: 'username',
      icon: 'alternate_email',
      label: 'Nome de usuário',
      value: 'maria.silva',
      type: 'text',
      placeholder: 'seu.usuario',
      hint: 'Usado na URL do seu perfil. Apenas letras, números e pontos.',
      editing: false,
    },
    {
      id: 'email',
      icon: 'mail',
      label: 'E-mail',
      value: 'maria.silva@email.com',
      type: 'email',
      placeholder: 'seu@email.com',
      hint: 'Usado para login e notificações.',
      editing: false,
    },
    {
      id: 'phone',
      icon: 'phone',
      label: 'Telefone',
      value: '+55 11 99999-0000',
      type: 'tel',
      placeholder: '+55 11 99999-0000',
      editing: false,
    },
  ]);

  readonly drafts: Record<string, string> = {};
  readonly savingFieldId = signal<string | null>(null);

  readonly identityFields = computed(() =>
    this.fields().filter((f) => ['name', 'username'].includes(f.id)),
  );

  readonly contactFields = computed(() =>
    this.fields().filter((f) => ['email', 'phone'].includes(f.id)),
  );

  startEdit(id: string): void {
    const field = this.fields().find((f) => f.id === id);
    if (field) this.drafts[id] = field.value;
    this.fields.update((fs) =>
      fs.map((f) => ({ ...f, editing: f.id === id ? true : f.editing })),
    );
  }

  cancelEdit(id: string): void {
    this.fields.update((fs) =>
      fs.map((f) => (f.id === id ? { ...f, editing: false } : f)),
    );
  }

  saveField(id: string): void {
    this.savingFieldId.set(id);
    setTimeout(() => {
      this.fields.update((fs) =>
        fs.map((f) =>
          f.id === id ? { ...f, value: this.drafts[id] ?? f.value, editing: false } : f,
        ),
      );
      this.savingFieldId.set(null);
    }, 900);
  }
}
