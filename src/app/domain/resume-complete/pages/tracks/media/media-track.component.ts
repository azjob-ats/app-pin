import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

const MAX_AVATAR_MB = 2;
const MAX_COVER_MB = 5;
const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';

@Component({
  selector: 'app-media-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../experience/experience-track.component.scss',
    '../track-form-footer.shared.scss',
    './media-track.component.scss',
  ],
  template: `
    <div class="exp-track media-track">
      <div class="exp-track__form">
        <section class="media-track__group" aria-labelledby="avatar-label">
          <h3 id="avatar-label" class="media-track__title">Foto de perfil</h3>
          <p class="media-track__hint">
            Quadrada, mínimo 240×240. PNG, JPG, WEBP ou GIF (até {{ maxAvatarMb }}MB).
          </p>

          <div class="media-track__upload media-track__upload--avatar">
            <button
              type="button"
              class="media-track__avatar"
              [class.is-empty]="!avatar()"
              [attr.aria-label]="avatar() ? 'Trocar foto de perfil' : 'Adicionar foto de perfil'"
              (click)="openAvatarPicker()"
            >
              @if (avatar(); as url) {
                <img [src]="url" alt="" (error)="onAvatarError()" />
                <span class="media-track__overlay">
                  <span class="material-symbols-rounded" aria-hidden="true">edit</span>
                </span>
              } @else {
                <span class="material-symbols-rounded" aria-hidden="true">add_a_photo</span>
              }
            </button>

            @if (avatar()) {
              <button
                type="button"
                class="media-track__remove"
                aria-label="Remover foto de perfil"
                (click)="clearAvatar()"
              >
                Remover
              </button>
            }
          </div>

          @if (avatarError(); as msg) {
            <p class="media-track__error" role="alert">{{ msg }}</p>
          }

          <input
            #avatarInput
            type="file"
            class="media-track__file"
            [accept]="accept"
            (change)="onAvatarFile($event)"
          />
        </section>

        <section class="media-track__group" aria-labelledby="cover-label">
          <h3 id="cover-label" class="media-track__title">Capa</h3>
          <p class="media-track__hint">
            Proporção 16:5 recomendada (ex. 1600×500). PNG, JPG ou WEBP (até {{ maxCoverMb }}MB).
          </p>

          <button
            type="button"
            class="media-track__cover"
            [class.is-empty]="!cover()"
            [attr.aria-label]="cover() ? 'Trocar capa' : 'Adicionar capa'"
            (click)="openCoverPicker()"
          >
            @if (cover(); as url) {
              <img [src]="url" alt="" (error)="onCoverError()" />
              <span class="media-track__overlay">
                <span class="material-symbols-rounded" aria-hidden="true">edit</span>
              </span>
            } @else {
              <span class="material-symbols-rounded" aria-hidden="true">add_photo_alternate</span>
              <span class="media-track__cover-cta">Adicionar capa</span>
            }
          </button>

          @if (cover()) {
            <button
              type="button"
              class="media-track__remove"
              aria-label="Remover capa"
              (click)="clearCover()"
            >
              Remover
            </button>
          }

          @if (coverError(); as msg) {
            <p class="media-track__error" role="alert">{{ msg }}</p>
          }

          <input
            #coverInput
            type="file"
            class="media-track__file"
            [accept]="accept"
            (change)="onCoverFile($event)"
          />
        </section>
      </div>

      <footer class="track-form-footer">
        <button
          type="button"
          class="track-form-footer__save"
          [disabled]="!isDirty()"
          (click)="emitSave()"
        >
          Salvar
        </button>
      </footer>
    </div>
  `,
})
export class MediaTrackComponent {
  readonly initialAvatarUrl = input.required<string | null>();
  readonly initialCoverUrl = input.required<string | null>();
  readonly save = output<{ avatarUrl: string | null; coverUrl: string | null }>();

  protected readonly accept = ACCEPT;
  protected readonly maxAvatarMb = MAX_AVATAR_MB;
  protected readonly maxCoverMb = MAX_COVER_MB;

  protected readonly avatar = signal<string>('');
  protected readonly cover = signal<string>('');
  protected readonly avatarError = signal<string | null>(null);
  protected readonly coverError = signal<string | null>(null);

  private readonly avatarInput = viewChild<ElementRef<HTMLInputElement>>('avatarInput');
  private readonly coverInput = viewChild<ElementRef<HTMLInputElement>>('coverInput');

  private hasInit = false;

  constructor() {
    effect(() => {
      const a = this.initialAvatarUrl();
      const c = this.initialCoverUrl();
      if (this.hasInit) return;
      this.avatar.set(a ?? '');
      this.cover.set(c ?? '');
      this.hasInit = true;
    });
  }

  protected readonly isDirty = computed(() => {
    const a = this.initialAvatarUrl() ?? '';
    const c = this.initialCoverUrl() ?? '';
    return this.avatar() !== a || this.cover() !== c;
  });

  protected openAvatarPicker(): void {
    this.avatarInput()?.nativeElement.click();
  }

  protected openCoverPicker(): void {
    this.coverInput()?.nativeElement.click();
  }

  protected onAvatarFile(event: Event): void {
    void this.handleFile(event, MAX_AVATAR_MB, this.avatar, this.avatarError);
  }

  protected onCoverFile(event: Event): void {
    void this.handleFile(event, MAX_COVER_MB, this.cover, this.coverError);
  }

  protected onAvatarError(): void {
    this.avatar.set('');
  }

  protected onCoverError(): void {
    this.cover.set('');
  }

  protected clearAvatar(): void {
    this.avatar.set('');
    this.avatarError.set(null);
    const input = this.avatarInput()?.nativeElement;
    if (input) input.value = '';
  }

  protected clearCover(): void {
    this.cover.set('');
    this.coverError.set(null);
    const input = this.coverInput()?.nativeElement;
    if (input) input.value = '';
  }

  protected emitSave(): void {
    const toNull = (v: string) => (v.trim() === '' ? null : v);
    this.save.emit({
      avatarUrl: toNull(this.avatar()),
      coverUrl: toNull(this.cover()),
    });
  }

  private async handleFile(
    event: Event,
    maxMb: number,
    target: ReturnType<typeof signal<string>>,
    error: ReturnType<typeof signal<string | null>>,
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error.set('Selecione um arquivo de imagem.');
      input.value = '';
      return;
    }

    if (file.size > maxMb * 1024 * 1024) {
      error.set(`Arquivo muito grande. Máximo: ${maxMb}MB.`);
      input.value = '';
      return;
    }

    try {
      const dataUrl = await this.readAsDataUrl(file);
      target.set(dataUrl);
      error.set(null);
    } catch {
      error.set('Não foi possível ler o arquivo.');
    } finally {
      input.value = '';
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
