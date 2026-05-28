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
import { Router, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { CreateOrganizationRequest } from '@shared/interfaces/dto/request/empresa-organization';
import { EmpresaPageHeaderComponent } from '@domain/empresa/components/empresa-page-header/empresa-page-header.component';
import { OrganizationCreateFacade } from '@domain/empresa/services/organization-create.facade';

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const URL_REGEX = /^https?:\/\/.+/i;

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
  selector: 'app-organization-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, RouterLink, EmpresaPageHeaderComponent],
  templateUrl: './organization-create.component.html',
  styleUrl: './organization-create.component.scss',
})
export class OrganizationCreateComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(OrganizationCreateFacade);
  private readonly router = inject(Router);

  readonly listLink = `/${environment.ROUTES.EMPRESA.LIST}`;

  readonly isSubmitting = this.facade.isSubmitting;
  readonly serverError = this.facade.error;

  readonly socialLinks = signal<string[]>([]);
  readonly socialInput = signal<string>('');
  readonly showSummaryError = signal<boolean>(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    corporateEmail: ['', [Validators.required, Validators.email]],
    slug: ['', [Validators.required, Validators.pattern(SLUG_REGEX)]],
    website: ['', [Validators.pattern(URL_REGEX)]],
    bannerUrl: [''],
    logoUrl: [''],
    about: ['', [Validators.maxLength(800)]],
    representativeConfirmed: [false, [Validators.requiredTrue]],
  });

  readonly domainPreview = computed(() => {
    const slug = this.form.controls.slug.value || 'sua-empresa';
    return `${slug}.realwe`;
  });

  constructor() {
    effect(() => {
      const created = this.facade.created();
      if (created) {
        this.router.navigateByUrl(this.listLink);
      }
    });
  }

  ngOnInit(): void {
    this.facade.reset();
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

  addSocialLink(): void {
    const value = this.socialInput().trim();
    if (!value || !URL_REGEX.test(value)) return;
    if (this.socialLinks().includes(value)) {
      this.socialInput.set('');
      return;
    }
    this.socialLinks.update((current) => [...current, value]);
    this.socialInput.set('');
  }

  removeSocialLink(link: string): void {
    this.socialLinks.update((current) => current.filter((l) => l !== link));
  }

  onSocialKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSocialLink();
    }
  }

  onSocialInput(event: Event): void {
    this.socialInput.set((event.target as HTMLInputElement).value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummaryError.set(true);
      return;
    }
    this.showSummaryError.set(false);
    const raw = this.form.getRawValue();
    const payload: CreateOrganizationRequest = {
      name: raw.name,
      corporateEmail: raw.corporateEmail,
      slug: raw.slug,
      website: raw.website || undefined,
      socialLinks: this.socialLinks(),
      bannerUrl: raw.bannerUrl || undefined,
      logoUrl: raw.logoUrl || undefined,
      about: raw.about || undefined,
      representativeConfirmed: raw.representativeConfirmed,
    };
    this.facade.submit(payload);
  }

  hasError(control: keyof typeof this.form.controls, error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
