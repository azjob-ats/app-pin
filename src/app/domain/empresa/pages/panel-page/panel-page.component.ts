import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationContextService } from '@domain/empresa/services/organization-context.service';
import { OrganizationUpdateFacade } from '@domain/empresa/services/organization-update.facade';

const URL_REGEX = /^https?:\/\/.+/i;

@Component({
  selector: 'app-panel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule],
  templateUrl: './panel-page.component.html',
  styleUrl: './panel-page.component.scss',
})
export class PanelPageComponent implements OnDestroy {
  protected readonly context = inject(OrganizationContextService);
  private readonly facade = inject(OrganizationUpdateFacade);
  private readonly fb = inject(FormBuilder);

  readonly isSaving = this.facade.isSaving;
  readonly serverError = this.facade.error;
  readonly justSaved = this.facade.justSaved;

  readonly socialLinks = signal<string[]>([]);
  readonly socialInput = signal<string>('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    website: ['', [Validators.pattern(URL_REGEX)]],
    bannerUrl: [''],
    logoUrl: [''],
    about: ['', [Validators.maxLength(800)]],
    publicPageEnabled: [false],
  });

  constructor() {
    // Hydrate the form whenever the org context loads/changes.
    effect(() => {
      const org = this.context.organization();
      if (!org) return;
      this.form.patchValue(
        {
          name: org.name,
          website: org.website,
          bannerUrl: org.bannerUrl,
          logoUrl: org.logoUrl,
          about: org.about,
          publicPageEnabled: org.publicPageEnabled,
        },
        { emitEvent: false },
      );
      this.socialLinks.set([...org.socialLinks]);
    });
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }

  protected addSocialLink(): void {
    const value = this.socialInput().trim();
    if (!value || !URL_REGEX.test(value)) return;
    if (this.socialLinks().includes(value)) {
      this.socialInput.set('');
      return;
    }
    this.socialLinks.update((current) => [...current, value]);
    this.socialInput.set('');
  }

  protected removeSocialLink(link: string): void {
    this.socialLinks.update((current) => current.filter((l) => l !== link));
  }

  protected onSocialKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSocialLink();
    }
  }

  protected onSocialInput(event: Event): void {
    this.socialInput.set((event.target as HTMLInputElement).value);
  }

  protected publicUrl(): string {
    const slug = this.context.organization()?.slug;
    return slug ? `/empresa/${slug}/publico` : '#';
  }

  protected submit(): void {
    const org = this.context.organization();
    if (!org) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.facade.update(org.slug, {
      name: raw.name,
      website: raw.website || undefined,
      bannerUrl: raw.bannerUrl || undefined,
      logoUrl: raw.logoUrl || undefined,
      about: raw.about || undefined,
      publicPageEnabled: raw.publicPageEnabled,
      socialLinks: this.socialLinks(),
    });
  }

  protected dismissJustSaved(): void {
    this.facade.clearJustSaved();
  }

  protected hasError(control: 'name' | 'website' | 'about', error: string): boolean {
    const c = this.form.controls[control];
    return c.touched && c.hasError(error);
  }
}
