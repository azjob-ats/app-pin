import { ChangeDetectionStrategy, Component, ViewEncapsulation, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { Button } from '../button/button.component';

/** FileUploaderBasic — fiel ao baseui/file-uploader-basic (dropzone tracejado + botão "Browse files"). */
@Component({
  selector: 'bui-file-uploader-basic',
  exportAs: 'buiFileUploaderBasic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button],
  template: `
    <div
      class="bui-fub"
      [class.bui-fub--drag]="dragging()"
      role="button"
      tabindex="-1"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
    >
      @if (swapButtonAndMessage()) {
        <bui-button kind="secondary" shape="pill" size="compact" [disabled]="disabled()" (buttonClick)="open()">
          <span class="material-symbols-rounded bui-fub__icon">cloud_upload</span>{{ buttonText() }}
        </bui-button>
        @if (contentSeparator()) { <div class="bui-fub__sep">{{ contentSeparator() }}</div> }
        <div class="bui-fub__msg">{{ contentMessage() }}</div>
      } @else {
        <div class="bui-fub__msg">{{ contentMessage() }}</div>
        @if (contentSeparator()) { <div class="bui-fub__sep">{{ contentSeparator() }}</div> }
        <bui-button kind="secondary" shape="pill" size="compact" [disabled]="disabled()" (buttonClick)="open()">
          <span class="material-symbols-rounded bui-fub__icon">cloud_upload</span>{{ buttonText() }}
        </bui-button>
      }
      <input #input type="file" class="bui-fub__input" [multiple]="multiple()" [accept]="accept()" [disabled]="disabled()" (change)="onPick($event)" hidden />
    </div>
  `,
  styles: `
    .bui-fub {
      display:flex; flex-direction:column; align-items:center; box-sizing:border-box; width:100%; outline:none;
      padding:var(--bw-sizing-scale900) var(--bw-sizing-scale800);
      border:1px dashed var(--bw-border-opaque); border-radius:var(--bw-borders-radius400);
      background:var(--bw-background-secondary);
      font:var(--bw-font-ParagraphSmall); color:var(--bw-content-secondary);
    }
    .bui-fub--drag { border-color:var(--bw-border-accent); background:var(--bw-background-accent-light); color:var(--bw-content-accent); }
    .bui-fub__msg { font:var(--bw-font-LabelSmall); }
    .bui-fub__sep { font:var(--bw-font-LabelSmall); margin:var(--bw-sizing-scale300) 0; }
    .bui-fub--drag .bui-fub__msg { color:var(--bw-content-accent); }
    .bui-fub bui-button { margin-top:var(--bw-sizing-scale500); }
    .bui-fub__icon { font-size:18px; margin-right:6px; }
    .bui-fub__input { display:none; }
  `,
})
export class FileUploaderBasic {
  readonly disabled = input(false);
  readonly multiple = input(true);
  readonly accept = input<string>('');
  readonly buttonText = input<string>('Browse files');
  readonly contentMessage = input<string>('Drop files here to upload...');
  readonly contentSeparator = input<string>('');
  readonly swapButtonAndMessage = input(false);
  readonly filesSelected = output<File[]>();

  protected readonly dragging = signal(false);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected open(): void {
    if (this.disabled()) return;
    this.input().nativeElement.click();
  }
  protected onPick(e: Event): void {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    if (files.length) this.filesSelected.emit(files);
  }
  protected onDragOver(e: DragEvent): void { e.preventDefault(); if (!this.disabled()) this.dragging.set(true); }
  protected onDragLeave(): void { this.dragging.set(false); }
  protected onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    if (this.disabled()) return;
    const files = Array.from(e.dataTransfer?.files ?? []);
    if (files.length) this.filesSelected.emit(files);
  }
}

@Component({
  selector: 'bui-s-file-uploader-basic', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [FileUploaderBasic],
  template: `<div style="width:420px;"><bui-file-uploader-basic /></div>`,
})
export class FileUploaderBasicScenario {}
