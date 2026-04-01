import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-button-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-upload.component.html',
  styleUrl: './button-upload.component.scss',
})
export class ButtonUploadComponent {
  readonly accept = input('');
  readonly maxFileSizeMB = input(15);
  readonly multiple = input(false);

  readonly fileChange = output<File | null>();

  readonly isDragging = signal(false);
  readonly attachedFile = signal<File | null>(null);
  readonly errorMessage = signal('');

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.attachedFile.set(null);
    this.errorMessage.set('');
    this.fileChange.emit(null);
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  private processFile(file: File): void {
    const maxBytes = this.maxFileSizeMB() * 1024 * 1024;
    if (file.size > maxBytes) {
      this.errorMessage.set(`Arquivo muito grande. Máximo: ${this.maxFileSizeMB()}MB`);
      return;
    }
    this.errorMessage.set('');
    this.attachedFile.set(file);
    this.fileChange.emit(file);
  }
}
