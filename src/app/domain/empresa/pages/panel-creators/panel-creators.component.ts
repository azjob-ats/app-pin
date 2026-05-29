import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatorGroup, OrganizationCreator } from '@shared/interfaces/entity/empresa-creator';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { CreatorFacade } from '@domain/empresa/services/creator.facade';

type SubTab = 'creators' | 'groups';

@Component({
  selector: 'app-panel-creators',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, EmpresaPageHeaderComponent],
  templateUrl: './panel-creators.component.html',
  styleUrl: './panel-creators.component.scss',
})
export class PanelCreatorsComponent implements OnDestroy {
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(CreatorFacade);
  private readonly fb = inject(FormBuilder);

  readonly creators = this.facade.creators;
  readonly groups = this.facade.groups;
  readonly isLoading = this.facade.isLoading;
  readonly isMutating = this.facade.isMutating;
  readonly error = this.facade.error;

  readonly currentTab = signal<SubTab>('creators');

  readonly creatorSearch = signal<string>('');
  readonly groupSearch = signal<string>('');

  // Modal: criar grupo
  readonly showGroupModal = signal<boolean>(false);
  readonly groupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  // Modal: adicionar creators a um grupo
  readonly addCreatorsGroup = signal<CreatorGroup | null>(null);
  readonly selectedCreatorIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly filteredCreators = computed<readonly OrganizationCreator[]>(() => {
    const term = this.creatorSearch().trim().toLowerCase();
    if (!term) return this.creators();
    return this.creators().filter(
      (c) =>
        c.displayName.toLowerCase().includes(term) ||
        c.handle.toLowerCase().includes(term) ||
        c.headline.toLowerCase().includes(term),
    );
  });

  readonly filteredGroups = computed<readonly CreatorGroup[]>(() => {
    const term = this.groupSearch().trim().toLowerCase();
    if (!term) return this.groups();
    return this.groups().filter(
      (g) => g.name.toLowerCase().includes(term) || g.description.toLowerCase().includes(term),
    );
  });

  constructor() {
    effect(() => {
      const slug = this.context.organization()?.slug;
      if (slug && this.creators().length === 0 && !this.isLoading()) {
        this.facade.load(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected setTab(tab: SubTab): void {
    this.currentTab.set(tab);
  }

  // ---------- Creators ----------

  protected onCreatorSearch(event: Event): void {
    this.creatorSearch.set((event.target as HTMLInputElement).value);
  }

  protected statusLabel(status: OrganizationCreator['status']): string {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'invited':
        return 'Convidado';
      default:
        return 'Inativo';
    }
  }

  // ---------- Groups ----------

  protected onGroupSearch(event: Event): void {
    this.groupSearch.set((event.target as HTMLInputElement).value);
  }

  protected openGroupModal(): void {
    this.groupForm.reset({ name: '', description: '' });
    this.showGroupModal.set(true);
  }

  protected closeGroupModal(): void {
    this.showGroupModal.set(false);
  }

  protected submitGroup(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    const { name, description } = this.groupForm.getRawValue();
    this.facade.createGroup(slug, { name, description });
    this.showGroupModal.set(false);
  }

  protected openAddCreatorsModal(group: CreatorGroup): void {
    this.addCreatorsGroup.set(group);
    this.selectedCreatorIds.set(new Set<string>());
  }

  protected closeAddCreatorsModal(): void {
    this.addCreatorsGroup.set(null);
    this.selectedCreatorIds.set(new Set<string>());
  }

  protected toggleCreatorSelection(creatorId: string): void {
    this.selectedCreatorIds.update((set) => {
      const next = new Set(set);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  }

  protected isCreatorSelected(creatorId: string): boolean {
    return this.selectedCreatorIds().has(creatorId);
  }

  protected isCreatorInGroup(group: CreatorGroup, creatorId: string): boolean {
    return group.creatorIds.includes(creatorId);
  }

  protected submitAddCreators(): void {
    const slug = this.context.organization()?.slug;
    const group = this.addCreatorsGroup();
    if (!slug || !group) return;
    const ids = [...this.selectedCreatorIds()];
    if (ids.length === 0) {
      this.closeAddCreatorsModal();
      return;
    }
    this.facade.addCreatorsToGroup(slug, group.id, { creatorIds: ids });
    this.closeAddCreatorsModal();
  }

  protected creatorName(creatorId: string): string {
    return this.creators().find((c) => c.id === creatorId)?.displayName ?? creatorId;
  }

  protected hasGroupError(control: 'name', error: string): boolean {
    const c = this.groupForm.controls[control];
    return c.touched && c.hasError(error);
  }

  protected trackCreator = (_: number, c: OrganizationCreator): string => c.id;
  protected trackGroup = (_: number, g: CreatorGroup): string => g.id;
}
