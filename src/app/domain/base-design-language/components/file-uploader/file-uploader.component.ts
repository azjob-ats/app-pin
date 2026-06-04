import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, output, signal } from '@angular/core';
import { FileUploaderBasic } from '../file-uploader-basic/file-uploader-basic.component';

export type FileStatus = 'uploading' | 'processing' | 'uploaded' | 'error';
export interface FileRow {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  progress?: number;
  errorMessage?: string;
}

const STATUS_COLOR: Record<FileStatus, string> = {
  uploading: 'var(--bw-content-secondary)',
  processing: 'var(--bw-content-secondary)',
  uploaded: 'var(--bw-content-positive)',
  error: 'var(--bw-content-negative)',
};
const STATUS_ICON: Record<FileStatus, string> = {
  uploading: 'attach_file',
  processing: 'attach_file',
  uploaded: 'check_circle',
  error: 'error',
};

/** FileUploader — fiel ao baseui/file-uploader (dropzone + lista de arquivos com progresso). */
@Component({
  selector: 'bui-file-uploader',
  exportAs: 'buiFileUploader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FileUploaderBasic],
  template: `
    <div class="bui-fu">
      @if (label()) { <label class="bui-fu__label">{{ label() }}</label> }
      <bui-file-uploader-basic [accept]="accept()" [disabled]="disabled()" (filesSelected)="onFiles($event)" />
      @if (fileRows().length) {
        <ul class="bui-fu__rows">
          @for (row of fileRows(); track row.id) {
            <li class="bui-fu__row">
              <span class="material-symbols-rounded bui-fu__rowicon" [style.color]="color(row)">{{ icon(row) }}</span>
              <div class="bui-fu__rowtext">
                <div class="bui-fu__rowname">{{ row.name }}</div>
                <div class="bui-fu__rowmsg" [style.color]="color(row)">
                  {{ row.status === 'error' ? (row.errorMessage || 'Upload failed') : message(row) }}
                </div>
                @if (row.status === 'uploading' && row.progress != null) {
                  <div class="bui-fu__bar"><span class="bui-fu__barfill" [style.width.%]="row.progress"></span></div>
                }
              </div>
              <button type="button" class="bui-fu__del" aria-label="Remove file" (click)="remove(row.id)">
                <span class="material-symbols-rounded">delete</span>
              </button>
            </li>
          }
        </ul>
      }
      @if (hint()) { <div class="bui-fu__hint">{{ hint() }}</div> }
    </div>
  `,
  styles: `
    .bui-fu { display:flex; flex-direction:column; }
    .bui-fu__label { font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); margin-bottom:var(--bw-sizing-scale300); }
    .bui-fu__rows { list-style:none; padding:0; margin:var(--bw-sizing-scale400) 0 var(--bw-sizing-scale300); border:1px solid var(--bw-border-opaque); border-radius:var(--bw-borders-radius400); }
    .bui-fu__row { display:flex; align-items:center; gap:var(--bw-sizing-scale500); padding:var(--bw-sizing-scale500); }
    .bui-fu__row + .bui-fu__row { border-top:1px solid var(--bw-border-opaque); }
    .bui-fu__rowicon { font-size:24px; flex-shrink:0; }
    .bui-fu__rowtext { display:flex; flex-direction:column; flex-grow:1; min-width:0; gap:2px; }
    .bui-fu__rowname { font:var(--bw-font-LabelSmall); color:var(--bw-content-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .bui-fu__rowmsg { font:var(--bw-font-ParagraphXSmall); }
    .bui-fu__bar { height:4px; border-radius:2px; background:var(--bw-background-tertiary); overflow:hidden; margin-top:4px; }
    .bui-fu__barfill { display:block; height:100%; background:var(--bw-content-accent); transition:width 120ms linear; }
    .bui-fu__del { display:flex; align-items:center; justify-content:center; flex-shrink:0; width:32px; height:32px; border:none; border-radius:50%; background:transparent; color:var(--bw-content-secondary); cursor:pointer; }
    .bui-fu__del:hover { background:var(--bw-background-secondary); }
    .bui-fu__hint { font:var(--bw-font-ParagraphSmall); color:var(--bw-content-tertiary); }
  `,
})
export class FileUploader {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly accept = input<string>('');
  readonly disabled = input(false);
  readonly fileRows = model<FileRow[]>([]);
  readonly filesAdded = output<File[]>();

  protected color(r: FileRow): string { return STATUS_COLOR[r.status]; }
  protected icon(r: FileRow): string { return STATUS_ICON[r.status]; }
  protected message(r: FileRow): string {
    if (r.status === 'uploaded') return formatBytes(r.size);
    if (r.status === 'processing') return 'Processing…';
    return `${formatBytes(r.size)}`;
  }
  protected onFiles(files: File[]): void {
    const added: FileRow[] = files.map((f) => ({ id: uid(), name: f.name, size: f.size, status: 'uploaded' as FileStatus }));
    this.fileRows.update((rows) => [...rows, ...added]);
    this.filesAdded.emit(files);
  }
  protected remove(id: string): void {
    this.fileRows.update((rows) => rows.filter((r) => r.id !== id));
  }
}

function uid(): string { return Math.random().toString(36).slice(2, 10); }
function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024, units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

@Component({
  selector: 'bui-s-file-uploader', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FileUploader],
  template: `<div style="width:480px;">
    <bui-file-uploader
      label="Upload documents"
      hint="Accepted formats: PDF, PNG, JPG. Max 10MB."
      [fileRows]="rows"
    />
  </div>`,
})
export class FileUploaderScenario {
  protected readonly rows = signal<FileRow[]>([
    { id: '1', name: 'quarterly-report-2025.pdf', size: 248320, status: 'uploaded' },
    { id: '2', name: 'cover-photo.png', size: 1503232, status: 'uploading', progress: 64 },
    { id: '3', name: 'broken-file.zip', size: 90112, status: 'error', errorMessage: 'File type not supported' },
  ])();
}
