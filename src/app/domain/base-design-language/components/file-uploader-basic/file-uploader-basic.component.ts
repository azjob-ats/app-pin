import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ProgressBar } from '../progress-bar/progress-bar.component';
import { Spinner } from '../spinner/spinner.component';
import { Button } from '../button/button.component';

@Component({
  selector: 'bui-file-uploader-basic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProgressBar, Spinner, Button],
  styleUrl: './file-uploader-basic.component.scss',
  template: `
    <div class="bui-fub" data-baseweb="file-uploader-basic">
      <div
        class="bui-fub__dropzone"
        [class.bui-fub__dropzone--drag-active]="isDragActive()"
        [class.bui-fub__dropzone--after-drop]="afterFileDrop()"
        [class.bui-fub__dropzone--disabled]="disabled()"
        (dragenter)="onDragEnter($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        @if (!afterFileDrop()) {
          <div class="bui-fub__content-msg">Drop files to upload</div>
          <div class="bui-fub__separator">or</div>
          <bui-button
            kind="secondary"
            shape="pill"
            size="compact"
            [disabled]="disabled()"
            (buttonClick)="openFileDialog()"
          >Browse files</bui-button>
        } @else {
          @if (hasProgressAmount()) {
            <bui-progress-bar
              [value]="progressAmount() ?? 0"
              [intent]="errorMessage() ? 'negative' : undefined"
            />
          } @else if (!errorMessage()) {
            <bui-spinner size="medium" />
          }

          @if (errorMessage()) {
            <div class="bui-fub__error-msg">{{ errorMessage() }}</div>
            <bui-button kind="tertiary" (buttonClick)="retryClick.emit()">Retry</bui-button>
          } @else {
            <div class="bui-fub__content-msg bui-fub__content-msg--after">{{ progressMessage() }}</div>
            <bui-button
              kind="tertiary"
              (buttonClick)="cancelClick.emit()"
              style="color:var(--bw-content-negative)"
            >Cancel</bui-button>
          }
        }
      </div>

      <input
        #fileInput
        class="bui-fub__input"
        type="file"
        [attr.accept]="acceptAttr()"
        [multiple]="multiple()"
        [disabled]="disabled()"
        aria-hidden="true"
        tabindex="-1"
        (change)="onFileInputChange($event)"
      />
    </div>
  `,
})
export class BuiFileUploaderBasic {
  readonly accept = input<string | string[]>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly progressAmount = input<number | null>(null);
  readonly progressMessage = input('');
  readonly errorMessage = input('');

  readonly fileDrop = output<File[]>();
  readonly retryClick = output<void>();
  readonly cancelClick = output<void>();

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly isDragActive = signal(false);

  protected readonly afterFileDrop = computed(
    () => !!(this.progressAmount() !== null || this.progressMessage() || this.errorMessage()),
  );

  protected readonly hasProgressAmount = computed(() => typeof this.progressAmount() === 'number');

  protected readonly acceptAttr = computed(() => {
    const a = this.accept();
    if (!a) return undefined;
    return Array.isArray(a) ? a.join(',') : a;
  });

  protected openFileDialog(): void {
    if (!this.disabled()) {
      this.fileInput()?.nativeElement.click();
    }
  }

  protected onFileInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length) this.fileDrop.emit(files);
    input.value = '';
  }

  protected onDragEnter(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled() && !this.afterFileDrop()) this.isDragActive.set(true);
  }

  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled() && !this.afterFileDrop()) this.isDragActive.set(true);
  }

  protected onDragLeave(e: DragEvent): void {
    this.isDragActive.set(false);
  }

  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragActive.set(false);
    if (this.disabled() || this.afterFileDrop()) return;
    const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length) this.fileDrop.emit(files);
  }
}
