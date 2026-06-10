import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  signal,
} from '@angular/core';
import { BuiFileUploaderBasic } from '../file-uploader-basic/file-uploader-basic.component';
import { ProgressBar } from '../progress-bar/progress-bar.component';
import { Button } from '../button/button.component';
import type { PbIntent } from '../progress-bar/progress-bar.component';

export type FileRowStatus = 'added' | 'error' | 'processed';

export interface FileRow {
  id: string;
  file: File;
  status: FileRowStatus;
  progressAmount: number;
  errorMessage: string | null;
  imagePreviewThumbnail?: string;
}

const PROGRESS_AMOUNT_LOADING = 20;
const PROGRESS_AMOUNT_LOADING_COMPLETE = 100;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 bytes';
  const k = 1000;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function checkAccept(file: File, accept: string | string[] | undefined): boolean {
  if (!accept) return true;
  const list = Array.isArray(accept) ? accept : accept.split(',').map((s) => s.trim());
  return list.some((type) => {
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type.toLowerCase());
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -2));
    return file.type === type;
  });
}

@Component({
  selector: 'bui-file-uploader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiFileUploaderBasic, ProgressBar, Button],
  styleUrl: './file-uploader.component.scss',
  template: `
    <div class="bui-fu" data-baseweb="file-uploader-parent-root">
      <span
        class="bui-fu__aria-live"
        aria-live="assertive"
        aria-relevant="additions"
        id="file-uploader-addition"
      ></span>
      <span
        class="bui-fu__aria-live"
        aria-live="polite"
        aria-relevant="additions"
        id="file-uploader-removal"
      ></span>

      @if (label()) {
        <div class="bui-fu__label" tabindex="-1" data-baseweb="file-uploader-label">
          {{ label() }}
        </div>
      }

      <bui-file-uploader-basic
        [accept]="accept()"
        [disabled]="isDisabled()"
        [multiple]="multiple()"
        (fileDrop)="onFileDrop($event)"
      />

      @if (fileRows().length > 0) {
        <div class="bui-fu__file-rows" data-baseweb="file-uploader-file-rows">
          @for (fileRow of fileRows(); track fileRow.id; let index = $index) {
            <div class="bui-fu__file-row" data-baseweb="file-uploader-file-row">
              @if (itemPreview()) {
                <div class="bui-fu__item-preview" aria-hidden="true" data-baseweb="file-uploader-item-preview-container">
                  @if (fileRow.imagePreviewThumbnail) {
                    <img
                      class="bui-fu__thumbnail"
                      [src]="fileRow.imagePreviewThumbnail"
                      [alt]="fileRow.file.name"
                      data-baseweb="file-uploader-image-preview-thumbnail"
                    />
                  } @else {
                    <svg
                      class="bui-fu__icon"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      aria-hidden="true"
                      data-baseweb="file-uploader-paperclip-filled-icon"
                    >
                      <path
                        d="M21.1 2.9c-2.54-2.52-6.66-2.52-9.2 0l-9 9c-2.85 2.87-2.21 6.97 0 9.2A6.492 6.492 0 0 0 7.5 23c.17 0 .33-.01.5-.02v-3.05c-1.06.15-2.19-.17-2.98-.96a3.5 3.5 0 0 1 0-4.94l9-9.01c1.37-1.36 3.6-1.36 4.96-.01 1.36 1.37 1.36 3.6 0 4.96l-6.21 6.21c-.38.38-1.05.38-1.43 0-.39-.39-.4-1.04 0-1.43l5.67-5.6-2.11-2.13-5.67 5.6a4.017 4.017 0 0 0-.02 5.69 4.002 4.002 0 0 0 5.67 0l6.21-6.21a6.515 6.515 0 0 0 .01-9.2Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                </div>
              }

              <div class="bui-fu__file-row-column" data-baseweb="file-uploader-file-row-column">
                <div class="bui-fu__file-row-content" data-baseweb="file-uploader-file-row-content">
                  <div class="bui-fu__file-row-text" data-baseweb="file-uploader-file-row-text">
                    <div class="bui-fu__file-name" data-baseweb="file-uploader-file-row-file-name">
                      {{ fileRow.file.name }}
                    </div>
                    <div
                      class="bui-fu__upload-message"
                      [style.color]="statusColor(fileRow.status)"
                      data-baseweb="file-uploader-file-row-upload-message"
                    >
                      @if (fileRow.status === 'error') {
                        <svg
                          class="bui-fu__status-icon"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          aria-hidden="true"
                          data-baseweb="file-uploader-circle-exclamation-point-filled-icon"
                        >
                          <path
                            d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1s11 4.9 11 11-4.9 11-11 11Zm1.5-18h-3v8h3V5ZM12 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span
                          aria-invalid="true"
                          [attr.aria-errormessage]="fileRow.errorMessage"
                          data-baseweb="file-uploader-file-row-upload-message-text"
                        >Upload failed: {{ fileRow.errorMessage }}</span>
                      } @else if (fileRow.status === 'processed') {
                        <svg
                          class="bui-fu__status-icon"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          aria-hidden="true"
                          data-baseweb="file-uploader-circle-check-filled-icon"
                        >
                          <path
                            d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1Zm-1.5 16.1-5.6-5.6L7 9.4l3.4 3.4 6.4-6.4 2.1 2.1-8.4 8.6Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span data-baseweb="file-uploader-file-row-upload-message-text">
                          Upload successful
                        </span>
                      } @else {
                        <span
                          data-baseweb="file-uploader-file-row-upload-message-text"
                          [style.color]="'var(--bw-content-tertiary)'"
                        >Uploading...</span>
                      }
                    </div>
                  </div>

                  @if (noFilesAreLoading()) {
                    <button
                      class="bui-fu__delete-btn"
                      [attr.aria-label]="'Remove ' + fileRow.file.name"
                      (click)="removeFileRow(fileRow.id)"
                      data-baseweb="file-uploader-delete-button-component"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                        data-baseweb="file-uploader-trash-can-filled-icon"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 1v2h5v3H3V3h5V1h8ZM5 8h14v15H5V8Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  }
                </div>

                <bui-progress-bar
                  [value]="fileRow.progressAmount"
                  [intent]="progressIntent(fileRow.status)"
                  size="small"
                  aria-hidden="true"
                  data-baseweb="file-uploader-progress-bar"
                />
              </div>
            </div>
          }
        </div>
      }

      @if (hint()) {
        <div class="bui-fu__hint" data-baseweb="file-uploader-hint" id="file-uploader-hint">
          {{ hint() }}
        </div>
      }
    </div>
  `,
})
export class BuiFileUploader {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly itemPreview = input(false, { transform: booleanAttribute });
  readonly maxFiles = input<number>();
  readonly minSize = input<number>();
  readonly maxSize = input<number>();
  readonly accept = input<string | string[]>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly processFileOnDrop =
    input<
      (
        file: File,
        fileId: string,
        fileRows: FileRow[],
      ) => Promise<{ errorMessage: string | null }>
    >();
  readonly progressAmountStartValue = input<number>();

  protected readonly fileRows = signal<FileRow[]>([]);

  protected readonly noFilesAreLoading = computed(
    () => !this.fileRows().find((r) => r.status === 'added'),
  );

  protected readonly isDisabled = computed(
    () => this.disabled() || !this.noFilesAreLoading(),
  );

  protected statusColor(status: FileRowStatus): string {
    if (status === 'error') return 'var(--bw-content-negative)';
    if (status === 'processed') return 'var(--bw-content-positive)';
    return 'var(--bw-background-accent)';
  }

  protected progressIntent(status: FileRowStatus): PbIntent | undefined {
    if (status === 'error') return 'negative';
    if (status === 'processed') return 'positive';
    return undefined;
  }

  protected removeFileRow(id: string): void {
    const rows = this.fileRows();
    const removed = rows.find((r) => r.id === id);
    this.fileRows.update((r) => r.filter((row) => row.id !== id));
    if (removed) this.announceRemoval(removed.file.name);
    const label = document.querySelector('[data-baseweb="file-uploader-label"]') as HTMLElement;
    if (label) label.focus();
  }

  protected onFileDrop(files: File[]): void {
    const startValue = this.progressAmountStartValue() ?? PROGRESS_AMOUNT_LOADING;
    const accept = this.accept();

    const newRows: FileRow[] = files.map((file) => ({
      id: uid(),
      file,
      status: 'added' as FileRowStatus,
      progressAmount: startValue,
      errorMessage: null,
      imagePreviewThumbnail: '',
    }));

    this.fileRows.update((current) => [...current, ...newRows]);

    newRows.forEach((fileRow) => {
      const isAccepted = checkAccept(fileRow.file, accept);
      const reader = new FileReader();

      reader.onerror = () => {
        const msg = 'cannot read file';
        this.updateRow(fileRow.id, {
          errorMessage: msg,
          status: 'error',
          progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
        });
        this.announceAddition(fileRow.file.name, msg);
      };

      reader.onload = (event) => {
        if (fileRow.file.type.startsWith('image/')) {
          this.updateRow(fileRow.id, {
            imagePreviewThumbnail: event.target?.result as string,
          });
        }

        if (!isAccepted) {
          const msg = fileRow.file.type
            ? `file type of ${fileRow.file.type} is not accepted`
            : 'file type is not accepted';
          this.updateRow(fileRow.id, {
            errorMessage: msg,
            status: 'error',
            progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
          });
          this.announceAddition(fileRow.file.name, msg);
          return;
        }

        const currentRows = this.fileRows();
        const fileIndex = currentRows.findIndex((r) => r.id === fileRow.id);
        const maxFiles = this.maxFiles();
        const minSize = this.minSize();
        const maxSize = this.maxSize();

        if (maxFiles !== undefined && Number.isInteger(maxFiles) && fileIndex >= maxFiles) {
          const msg = `cannot process more than ${maxFiles} file(s)`;
          this.updateRow(fileRow.id, {
            errorMessage: msg,
            status: 'error',
            progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
          });
          this.announceAddition(fileRow.file.name, msg);
        } else if (minSize !== undefined && Number.isInteger(minSize) && minSize > fileRow.file.size) {
          const msg = `file size must be greater than ${formatBytes(minSize)}`;
          this.updateRow(fileRow.id, {
            errorMessage: msg,
            status: 'error',
            progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
          });
          this.announceAddition(fileRow.file.name, msg);
        } else if (maxSize !== undefined && Number.isInteger(maxSize) && maxSize < fileRow.file.size) {
          const msg = `file size must be less than ${formatBytes(maxSize)}`;
          this.updateRow(fileRow.id, {
            errorMessage: msg,
            status: 'error',
            progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
          });
          this.announceAddition(fileRow.file.name, msg);
        } else {
          const processFileOnDrop = this.processFileOnDrop();
          if (processFileOnDrop) {
            processFileOnDrop(fileRow.file, fileRow.id, this.fileRows())
              .then(({ errorMessage }) => {
                if (errorMessage) {
                  this.updateRow(fileRow.id, {
                    errorMessage,
                    status: 'error',
                    progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
                  });
                  this.announceAddition(fileRow.file.name, errorMessage);
                } else {
                  this.updateRow(fileRow.id, {
                    status: 'processed',
                    progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
                  });
                  this.announceAddition(fileRow.file.name, null);
                }
              })
              .catch((error) => {
                console.error('error with processFileOnDrop', error);
                const msg = 'unknown processing error';
                this.updateRow(fileRow.id, {
                  errorMessage: msg,
                  status: 'error',
                  progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
                });
                this.announceAddition(fileRow.file.name, msg);
              });
          } else {
            this.updateRow(fileRow.id, {
              status: 'processed',
              progressAmount: PROGRESS_AMOUNT_LOADING_COMPLETE,
            });
            this.announceAddition(fileRow.file.name, null);
          }
        }
      };

      reader.readAsDataURL(fileRow.file);
    });
  }

  updateRow(id: string, updates: Partial<FileRow>): void {
    this.fileRows.update((rows) =>
      rows.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    );
  }

  private announceAddition(fileName: string, errorMsg: string | null): void {
    const msg = errorMsg
      ? `${fileName} added, upload failed: ${errorMsg}`
      : `${fileName} added, upload successful`;
    const el = document.getElementById('file-uploader-addition');
    if (el) {
      el.textContent = msg;
      setTimeout(() => {
        if (el) el.textContent = '';
      }, 5000);
    }
  }

  private announceRemoval(fileName: string): void {
    const el = document.getElementById('file-uploader-removal');
    if (el) {
      el.textContent = `${fileName} removed`;
      setTimeout(() => {
        if (el) el.textContent = '';
      }, 5000);
    }
  }
}
