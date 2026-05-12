import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { ContactInfo } from '@shared/interfaces/entity/creator-portfolio';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contact-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, InputComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      <div class="exp-track__form">
        <app-input
          label="E-mail"
          type="email"
          placeholder="voce@dominio.com"
          [ngModel]="email()"
          (ngModelChange)="email.set($event)"
          [errorMessage]="emailInvalid() ? 'Informe um e-mail válido.' : ''"
        />

        <app-input
          label="Telefone"
          type="tel"
          placeholder="(11) 99999-9999"
          [ngModel]="phone()"
          (ngModelChange)="phone.set($event)"
        />

        <div class="exp-track__row">
          <app-input
            label="Cidade"
            placeholder="São Paulo"
            [ngModel]="city()"
            (ngModelChange)="city.set($event)"
          />
          <app-input
            label="País"
            placeholder="Brasil"
            [ngModel]="country()"
            (ngModelChange)="country.set($event)"
          />
        </div>
      </div>

      <footer class="track-form-footer">
        <button
          type="button"
          class="track-form-footer__save"
          [disabled]="!isDirty() || emailInvalid()"
          (click)="emitSave()"
        >
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class ContactTrackComponent {
  readonly initial = input.required<ContactInfo>();
  readonly save = output<{ contact: ContactInfo }>();

  protected readonly email = signal<string>('');
  protected readonly phone = signal<string>('');
  protected readonly city = signal<string>('');
  protected readonly country = signal<string>('');

  private hasInit = false;

  constructor() {
    effect(() => {
      const init = this.initial();
      if (this.hasInit) return;
      this.email.set(init.email ?? '');
      this.phone.set(init.phone ?? '');
      this.city.set(init.city ?? '');
      this.country.set(init.country ?? '');
      this.hasInit = true;
    });
  }

  protected readonly emailInvalid = computed(() => {
    const v = this.email().trim();
    return v !== '' && !EMAIL_RE.test(v);
  });

  protected readonly isDirty = computed(() => {
    const init = this.initial();
    return (
      this.email() !== (init.email ?? '') ||
      this.phone() !== (init.phone ?? '') ||
      this.city() !== (init.city ?? '') ||
      this.country() !== (init.country ?? '')
    );
  });

  protected emitSave(): void {
    if (this.emailInvalid()) return;
    const toNull = (v: string) => (v.trim() === '' ? null : v.trim());
    this.save.emit({
      contact: {
        email: toNull(this.email()),
        phone: toNull(this.phone()),
        city: toNull(this.city()),
        country: toNull(this.country()),
      },
    });
  }
}
