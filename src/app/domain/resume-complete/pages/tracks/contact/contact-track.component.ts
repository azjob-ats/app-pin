import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output, signal } from '@angular/core';
import { ContactInfo } from '@shared/interfaces/entity/creator-portfolio';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-contact-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form class="contact-track" (submit)="$event.preventDefault(); emitSave()">
      <label class="contact-track__field">
        <span class="contact-track__label">E-mail</span>
        <input
          type="email"
          [value]="email()"
          (input)="email.set($any($event.target).value)"
          autocomplete="email"
          placeholder="voce@dominio.com"
        />
        @if (emailInvalid()) {
          <span class="contact-track__error">Informe um e-mail válido.</span>
        }
      </label>

      <label class="contact-track__field">
        <span class="contact-track__label">Telefone</span>
        <input
          type="tel"
          [value]="phone()"
          (input)="phone.set($any($event.target).value)"
          placeholder="(11) 99999-9999"
        />
      </label>

      <div class="contact-track__row">
        <label class="contact-track__field">
          <span class="contact-track__label">Cidade</span>
          <input
            type="text"
            [value]="city()"
            (input)="city.set($any($event.target).value)"
            placeholder="São Paulo"
          />
        </label>
        <label class="contact-track__field">
          <span class="contact-track__label">País</span>
          <input
            type="text"
            [value]="country()"
            (input)="country.set($any($event.target).value)"
            placeholder="Brasil"
          />
        </label>
      </div>

      <footer class="track-form-footer">
        <span class="track-form-footer__count">{{ filledCount() }}/4 campos preenchidos</span>
        <button type="submit" class="track-form-footer__save" [disabled]="!isDirty() || emailInvalid()">
          Salvar
        </button>
      </footer>
    </form>
  `,
  styleUrl: './contact-track.component.scss',
})
export class ContactTrackComponent {
  readonly initial = input<ContactInfo>({ email: null, phone: null, city: null, country: null });
  readonly save = output<{ contact: ContactInfo }>();

  protected readonly email = signal<string>('');
  protected readonly phone = signal<string>('');
  protected readonly city = signal<string>('');
  protected readonly country = signal<string>('');

  private hasInit = false;

  constructor() {
    queueMicrotask(() => {
      if (!this.hasInit) {
        const init = this.initial();
        this.email.set(init.email ?? '');
        this.phone.set(init.phone ?? '');
        this.city.set(init.city ?? '');
        this.country.set(init.country ?? '');
        this.hasInit = true;
      }
    });
  }

  protected readonly emailInvalid = computed(() => {
    const v = this.email().trim();
    return v !== '' && !EMAIL_RE.test(v);
  });

  protected readonly filledCount = computed(
    () => [this.email(), this.phone(), this.city(), this.country()].filter((v) => !!v.trim()).length,
  );

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
