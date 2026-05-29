import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmpresaCreatorApi } from '@shared/apis/empresa-creator.api';
import { BoardService } from '@shared/services/board.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { UploadAreaComponent } from '@shared/components/upload-area/upload-area.component';
import {
  CardBoardComponent,
  CardBodyComponent,
  CardContainerComponent,
  CardHeaderComponent,
  CardSectionLeftComponent,
  CardSectionRightComponent,
} from '@shared/components/card-board/card-board.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    UploadAreaComponent,
    CardBoardComponent,
    CardContainerComponent,
    CardHeaderComponent,
    CardSectionLeftComponent,
    CardSectionRightComponent,
    CardBodyComponent,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  // TODO: substituir org/creator de demonstração por contexto real quando auth existir
  // (ver CurrentUserService — hoje só expõe handle, sem vínculo org↔creator).
  private readonly DEMO_ORG_SLUG = 'nubank';
  private readonly DEMO_CREATOR_ID = 'creator-001';

  readonly boards = signal<SelectOption[]>([]);
  readonly products = signal<SelectOption[]>([]);
  readonly previewUrl = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly title = signal('');
  readonly description = signal('');
  readonly link = signal('');
  readonly altText = signal('');
  readonly selectedBoardId = signal('');
  readonly selectedProductId = signal('');
  readonly isPublishing = signal(false);

  private boardService = inject(BoardService);
  private creatorApi = inject(EmpresaCreatorApi);
  private translate = inject(TranslateService);
  private router = inject(Router);

  constructor() {
    this.boardService.getUserBoards('u1').subscribe((boards) => {
      this.boards.set(boards.map((b) => ({ value: b.id, label: b.name })));
      if (boards.length) this.selectedBoardId.set(boards[0].id);
    });

    // Produtos liberados a este creator (regra de elegibilidade definida pela empresa).
    this.creatorApi
      .listCreatorProducts(this.DEMO_ORG_SLUG, this.DEMO_CREATOR_ID)
      .subscribe((response) => {
        const none: SelectOption = {
          value: '',
          label: this.translate.instant('create.sellProductNone'),
        };
        const items =
          response.success && response.data
            ? response.data.map((p) => ({ value: p.id, label: p.title }))
            : [];
        this.products.set([none, ...items]);
      });
  }

  onFileSelected(file: File): void {
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onFileRemoved(): void {
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
