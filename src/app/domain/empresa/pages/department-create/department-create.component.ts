import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { CreateDepartmentRequest } from '@shared/interfaces/dto/request/empresa-department';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import { DepartmentCreateFacade } from '@domain/empresa/services/department-create.facade';

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

interface IconOption {
  readonly value: string;
  readonly label: string;
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Component({
  selector: 'app-department-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, RouterLink, EmpresaPageHeaderComponent],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.scss',
})
export class DepartmentCreateComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(DepartmentCreateFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly orgSlug = signal<string>('');

  readonly isSubmitting = this.facade.isSubmitting;
  readonly serverError = this.facade.error;
  readonly showSummaryError = signal<boolean>(false);

  readonly iconOptions: readonly IconOption[] = [
    { value: 'groups', label: 'Pessoas / RH' },
    { value: 'campaign', label: 'Marketing' },
    { value: 'code', label: 'Engenharia' },
    { value: 'payments', label: 'Financeiro' },
    { value: 'shopping_cart', label: 'Vendas' },
    { value: 'support_agent', label: 'Suporte' },
    { value: 'design_services', label: 'Design' },
    { value: 'gavel', label: 'Jurídico' },
    { value: 'science', label: 'P&D' },
    { value: 'inventory_2', label: 'Operações' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required, Validators.pattern(SLUG_REGEX)]],
    description: ['', [Validators.maxLength(400)]],
    icon: ['groups', [Validators.required]],
    color: ['#2563eb'],
  });

  readonly listLink = computed(() =>
    `/${environment.ROUTES.EMPRESA.DEPARTMENTS.replace(':slug', this.orgSlug())}`,
  );

  readonly pathPreview = computed(() => {
    const slug = this.form.controls.slug.value || 'departamento';
    return `${this.orgSlug() || 'empresa'}/${slug}`;
  });

  readonly selectedIcon = computed(() => this.form.controls.icon.value || 'groups');

  constructor() {
    effect(() => {
      const created = this.facade.created();
      if (created) {
        this.router.navigateByUrl(this.listLink());
      }
    });
  }

  ngOnInit(): void {
    this.facade.reset();
    this.orgSlug.set(this.route.snapshot.paramMap.get('slug') ?? '');
    this.form.controls.name.valueChanges.subscribe((name) => {
      const slugCtrl = this.form.controls.slug;
      if (!slugCtrl.dirty || !slugCtrl.value) {
        slugCtrl.setValue(toSlug(name || ''), { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  selectIcon(icon: string): void {
    this.form.controls.icon.setValue(icon);
    this.form.controls.icon.markAsDirty();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummaryError.set(true);
      return;
    }
    this.showSummaryError.set(false);
    const raw = this.form.getRawValue();
    const payload: CreateDepartmentRequest = {
      name: raw.name,
      slug: raw.slug,
      description: raw.description || undefined,
      icon: raw.icon || undefined,
      color: raw.color || undefined,
    };
    this.facade.submit(this.orgSlug(), payload);
  }

  hasError(control: keyof typeof this.form.controls, error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
