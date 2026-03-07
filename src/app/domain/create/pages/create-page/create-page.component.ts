import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardService } from '../../../../shared/services/board.service';
import { Board } from '../../../../shared/interfaces/board.interface';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss',
})
export class CreatePageComponent {
  readonly boards = signal<Board[]>([]);
  readonly isDragging = signal(false);
  readonly previewUrl = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly title = signal('');
  readonly description = signal('');
  readonly link = signal('');
  readonly altText = signal('');
  readonly selectedBoardId = signal('');
  readonly isPublishing = signal(false);

  private boardService = inject(BoardService);
  private router = inject(Router);

  constructor() {
    this.boardService.getUserBoards('u1').subscribe(boards => {
      this.boards.set(boards);
      if (boards.length) this.selectedBoardId.set(boards[0].id);
    });
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
    if (file && file.type.startsWith('image/')) {
      this.handleFile(file);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl.set(null);
    this.selectedFile.set(null);
  }

  publish(): void {
    if (!this.previewUrl() || this.isPublishing()) return;
    this.isPublishing.set(true);
    setTimeout(() => {
      this.isPublishing.set(false);
      this.router.navigate(['/home']);
    }, 1500);
  }
}
