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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { Group, Member, Role } from '@shared/interfaces/entity/empresa-member';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import {
  permissionsByGroup,
  PERMISSION_GROUPS,
} from '@domain/empresa/constants/permission-catalog';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { PeopleFacade } from '@domain/empresa/services/people.facade';

type SubTab = 'members' | 'roles' | 'groups';

interface PermissionsFormGroup
  extends FormGroup<Record<string, FormControl<boolean>>> {}

@Component({
  selector: 'app-panel-people',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, DrawerComponent, EmpresaPageHeaderComponent],
  templateUrl: './panel-people.component.html',
  styleUrl: './panel-people.component.scss',
})
export class PanelPeopleComponent implements OnDestroy {
  private readonly context = inject(OrganizationContextService);
  private readonly facade = inject(PeopleFacade);
  private readonly fb = inject(FormBuilder);

  readonly permissionGroups = PERMISSION_GROUPS;

  readonly members = this.facade.members;
  readonly roles = this.facade.roles;
  readonly groups = this.facade.groups;
  readonly isLoading = this.facade.isLoading;
  readonly isMutating = this.facade.isMutating;
  readonly error = this.facade.error;

  readonly currentTab = signal<SubTab>('members');

  // Search filters
  readonly memberSearch = signal<string>('');
  readonly roleSearch = signal<string>('');
  readonly groupSearch = signal<string>('');

  // Modal: convite
  readonly showInviteModal = signal<boolean>(false);
  readonly inviteForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    roleId: ['', [Validators.required]],
  });

  // Modal: criar grupo
  readonly showGroupModal = signal<boolean>(false);
  readonly groupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    defaultRoleId: [''],
  });

  // Drawer: permissões da função selecionada
  readonly selectedRole = signal<Role | null>(null);
  readonly showRoleDrawer = computed(() => this.selectedRole() !== null);
  readonly permissionsForm = signal<PermissionsFormGroup | null>(null);

  // Modal: add members to group
  readonly addMembersGroup = signal<Group | null>(null);
  readonly selectedMemberIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly filteredMembers = computed<readonly Member[]>(() => {
    const term = this.memberSearch().trim().toLowerCase();
    if (!term) return this.members();
    return this.members().filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.roleName.toLowerCase().includes(term),
    );
  });

  readonly filteredRoles = computed<readonly Role[]>(() => {
    const term = this.roleSearch().trim().toLowerCase();
    if (!term) return this.roles();
    return this.roles().filter(
      (r) => r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term),
    );
  });

  readonly filteredGroups = computed<readonly Group[]>(() => {
    const term = this.groupSearch().trim().toLowerCase();
    if (!term) return this.groups();
    return this.groups().filter(
      (g) => g.name.toLowerCase().includes(term) || g.description.toLowerCase().includes(term),
    );
  });

  readonly drawerPermissionGroups = computed(() => {
    const role = this.selectedRole();
    if (!role) return null;
    return permissionsByGroup(role.permissions);
  });

  constructor() {
    effect(() => {
      const slug = this.context.organization()?.slug;
      if (slug && this.members().length === 0 && !this.isLoading()) {
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

  // ---------- Members ----------

  protected onMemberSearch(event: Event): void {
    this.memberSearch.set((event.target as HTMLInputElement).value);
  }

  protected openInviteModal(): void {
    this.inviteForm.reset({ email: '', roleId: '' });
    this.showInviteModal.set(true);
  }

  protected closeInviteModal(): void {
    this.showInviteModal.set(false);
  }

  protected submitInvite(): void {
    const slug = this.context.organization()?.slug;
    if (!slug) return;
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }
    const { email, roleId } = this.inviteForm.getRawValue();
    this.facade.invite(slug, { email, roleId });
    this.showInviteModal.set(false);
  }

  // ---------- Roles ----------

  protected onRoleSearch(event: Event): void {
    this.roleSearch.set((event.target as HTMLInputElement).value);
  }

  protected openRoleDrawer(role: Role): void {
    this.selectedRole.set(role);
    const controls: Record<string, FormControl<boolean>> = {};
    for (const p of role.permissions) {
      controls[p.action] = this.fb.nonNullable.control(p.allowed);
    }
    this.permissionsForm.set(this.fb.nonNullable.group(controls) as PermissionsFormGroup);
  }

  protected closeRoleDrawer(): void {
    this.selectedRole.set(null);
    this.permissionsForm.set(null);
  }

  protected onRoleDrawerVisibleChange(visible: boolean): void {
    if (!visible) this.closeRoleDrawer();
  }

  protected saveRolePermissions(): void {
    const slug = this.context.organization()?.slug;
    const role = this.selectedRole();
    const form = this.permissionsForm();
    if (!slug || !role || !form) return;
    const values = form.getRawValue();
    const permissions = Object.entries(values).map(([action, allowed]) => ({
      action,
      allowed,
    }));
    this.facade.updateRole(slug, role.id, { permissions });
    this.closeRoleDrawer();
  }

  // ---------- Groups ----------

  protected onGroupSearch(event: Event): void {
    this.groupSearch.set((event.target as HTMLInputElement).value);
  }

  protected openGroupModal(): void {
    this.groupForm.reset({ name: '', description: '', defaultRoleId: '' });
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
    const { name, description, defaultRoleId } = this.groupForm.getRawValue();
    this.facade.createGroup(slug, {
      name,
      description,
      defaultRoleId: defaultRoleId || undefined,
    });
    this.showGroupModal.set(false);
  }

  protected openAddMembersModal(group: Group): void {
    this.addMembersGroup.set(group);
    this.selectedMemberIds.set(new Set<string>());
  }

  protected closeAddMembersModal(): void {
    this.addMembersGroup.set(null);
    this.selectedMemberIds.set(new Set<string>());
  }

  protected toggleMemberSelection(memberId: string): void {
    this.selectedMemberIds.update((set) => {
      const next = new Set(set);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  }

  protected isMemberSelected(memberId: string): boolean {
    return this.selectedMemberIds().has(memberId);
  }

  protected submitAddMembers(): void {
    const slug = this.context.organization()?.slug;
    const group = this.addMembersGroup();
    if (!slug || !group) return;
    const ids = [...this.selectedMemberIds()];
    if (ids.length === 0) {
      this.closeAddMembersModal();
      return;
    }
    this.facade.addMembersToGroup(slug, group.id, { memberIds: ids });
    this.closeAddMembersModal();
  }

  protected hasInviteError(control: 'email' | 'roleId', error: string): boolean {
    const c = this.inviteForm.controls[control];
    return c.touched && c.hasError(error);
  }

  protected hasGroupError(control: 'name', error: string): boolean {
    const c = this.groupForm.controls[control];
    return c.touched && c.hasError(error);
  }

  protected permissionControl(action: string): FormControl<boolean> | null {
    const form = this.permissionsForm();
    return (form?.get(action) as FormControl<boolean> | null) ?? null;
  }

  protected trackMember = (_: number, m: Member): string => m.id;
  protected trackRole = (_: number, r: Role): string => r.id;
  protected trackGroup = (_: number, g: Group): string => g.id;
}
