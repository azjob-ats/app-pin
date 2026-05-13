import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';

const MAX_ABOUT = 600;
const MIN_ABOUT_TO_COMPLETE = 50;
const MAX_DISPLAY_NAME = 60;
const MAX_HEADLINE = 120;
const MAX_HANDLE = 30;
const MIN_HANDLE = 3;
const HANDLE_RE = /^[a-z0-9_]+$/;

@Component({
  selector: 'app-about-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, InputComponent, TextareaComponent],
  styleUrls: ['../experience/experience-track.component.scss', '../track-form-footer.shared.scss'],
  template: `
    <div class="exp-track">
      <div class="exp-track__form">
        <app-input
          label="Nome de usuário"
          placeholder="seuusuario"
          hint="Letras minúsculas, números e underline. Mínimo 3 caracteres."
          [maxlength]="maxHandle"
          [ngModel]="handle()"
          (ngModelChange)="onHandleChange($event)"
          [errorMessage]="handleError() ?? ''"
        />

        <app-input
          label="Nome de exibição"
          placeholder="Como você quer ser identificado"
          [maxlength]="maxDisplayName"
          [ngModel]="displayName()"
          (ngModelChange)="displayName.set($event)"
        />

        <app-input
          label="Chamada (headline)"
          placeholder="Ex. Desenvolvedor full-stack focado em produtos"
          [maxlength]="maxHeadline"
          [ngModel]="headline()"
          (ngModelChange)="headline.set($event)"
        />

        <app-textarea
          label="Sobre você"
          placeholder="Conte em poucas linhas o que move você profissionalmente."
          [hint]="aboutHint()"
          [rows]="6"
          [maxlength]="maxAbout"
          [ngModel]="about()"
          (ngModelChange)="about.set($event)"
        />
      </div>

      <footer class="track-form-footer">
        <button
          type="button"
          class="track-form-footer__save"
          (click)="emitSave()"
          [disabled]="!isDirty() || handleInvalid()"
        >
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class AboutTrackComponent {
  readonly initialHandle = input.required<string | null>();
  readonly initialDisplayName = input.required<string | null>();
  readonly initialHeadline = input.required<string | null>();
  readonly initialAbout = input.required<string>();
  readonly save = output<{
    handle: string | null;
    displayName: string | null;
    headline: string | null;
    about: string;
  }>();

  protected readonly maxAbout = MAX_ABOUT;
  protected readonly maxDisplayName = MAX_DISPLAY_NAME;
  protected readonly maxHeadline = MAX_HEADLINE;
  protected readonly maxHandle = MAX_HANDLE;

  protected readonly handle = signal<string>('');
  protected readonly displayName = signal<string>('');
  protected readonly headline = signal<string>('');
  protected readonly about = signal<string>('');

  protected readonly aboutHint = computed(
    () =>
      `${this.about().length}/${MAX_ABOUT} — mínimo ${MIN_ABOUT_TO_COMPLETE} caracteres para concluir`,
  );

  protected readonly handleError = computed<string | null>(() => {
    const v = this.handle().trim();
    if (v === '') return null;
    if (v.length < MIN_HANDLE) return `Mínimo ${MIN_HANDLE} caracteres.`;
    if (!HANDLE_RE.test(v)) return 'Use apenas letras minúsculas, números e underline.';
    return null;
  });

  protected readonly handleInvalid = computed(() => this.handleError() !== null);

  private hasInit = false;

  constructor() {
    effect(() => {
      const hd = this.initialHandle();
      const dn = this.initialDisplayName();
      const hl = this.initialHeadline();
      const ab = this.initialAbout();
      if (this.hasInit) return;
      this.handle.set(hd ?? '');
      this.displayName.set(dn ?? '');
      this.headline.set(hl ?? '');
      this.about.set(ab ?? '');
      this.hasInit = true;
    });
  }

  protected readonly isDirty = computed(() => {
    return (
      this.handle() !== (this.initialHandle() ?? '') ||
      this.displayName() !== (this.initialDisplayName() ?? '') ||
      this.headline() !== (this.initialHeadline() ?? '') ||
      this.about() !== this.initialAbout()
    );
  });

  protected onHandleChange(value: string): void {
    this.handle.set(value.toLowerCase());
  }

  protected emitSave(): void {
    if (this.handleInvalid()) return;
    const toNull = (v: string) => (v.trim() === '' ? null : v.trim());
    this.save.emit({
      handle: toNull(this.handle()),
      displayName: toNull(this.displayName()),
      headline: toNull(this.headline()),
      about: this.about(),
    });
  }
}
