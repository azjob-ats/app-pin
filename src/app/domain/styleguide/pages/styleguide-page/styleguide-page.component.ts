import { Component, ChangeDetectionStrategy, signal, inject, DOCUMENT } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { DividerComponent } from '../../../../shared/components/divider/divider.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

interface ColorToken {
  label: string;
  value: string;
  token: string;
}

interface SpacingToken {
  label: string;
  size: string;
  barW: number;
}

interface RadiusToken {
  label: string;
  value: string;
  token: string;
}

interface ShadowToken {
  label: string;
  value: string;
  token: string;
}

interface NavSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-styleguide-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './styleguide-page.component.html',
  styleUrl: './styleguide-page.component.scss',
  imports: [ButtonComponent, InputComponent, DividerComponent, EmptyStateComponent, ReactiveFormsModule],
  host: { class: 'sg-host' },
})
export class StyleguidePageComponent {
  private readonly document = inject(DOCUMENT);

  readonly isDark = signal(false);
  readonly activeSection = signal('overview');

  readonly sampleInput = new FormControl('');
  readonly passwordInput = new FormControl('');
  readonly errorInput = new FormControl('');

  readonly sections: NavSection[] = [
    { id: 'overview', label: 'Overview', icon: 'auto_awesome' },
    { id: 'colors', label: 'Colors', icon: 'palette' },
    { id: 'typography', label: 'Typography', icon: 'text_fields' },
    { id: 'spacing', label: 'Spacing', icon: 'straighten' },
    { id: 'radius', label: 'Border Radius', icon: 'rounded_corner' },
    { id: 'shadows', label: 'Shadows', icon: 'blur_on' },
    { id: 'components', label: 'Components', icon: 'widgets' },
  ];

  readonly primaryColors: ColorToken[] = [
    { label: '50', value: '#FFF0F1', token: 'primary-50' },
    { label: '100', value: '#FFD6DA', token: 'primary-100' },
    { label: '200', value: '#FFA8B0', token: 'primary-200' },
    { label: '300', value: '#FF7A87', token: 'primary-300' },
    { label: '400', value: '#FF4747', token: '--pin-red-light' },
    { label: '500', value: '#E60023', token: '--pin-red' },
    { label: '600', value: '#CC001F', token: '--pin-red-hover' },
    { label: '700', value: '#AD081B', token: '--pin-red-dark' },
    { label: '800', value: '#8B0017', token: 'primary-800' },
    { label: '900', value: '#6B0012', token: 'primary-900' },
    { label: '950', value: '#3D010A', token: 'primary-950' },
  ];

  readonly grayColors: ColorToken[] = [
    { label: 'White', value: '#ffffff', token: '--pin-bg' },
    { label: 'Background Tertiary', value: '#F8F8F8', token: '--pin-bg-tertiary' },
    { label: 'Background Secondary', value: '#F0F0F0', token: '--pin-bg-secondary' },
    { label: 'Border', value: '#E0E0E0', token: '--pin-border' },
    { label: 'Text Muted', value: '#ADADAD', token: '--pin-text-muted' },
    { label: 'Text Secondary', value: '#767676', token: '--pin-text-secondary' },
    { label: 'Dark Border', value: '#404040', token: '--pin-border (dark)' },
    { label: 'Saved State', value: '#333333', token: '--pin-saved-bg' },
    { label: 'Dark Surface', value: '#2D2D2D', token: '--pin-bg-secondary (dark)' },
    { label: 'Dark Background', value: '#1A1A1A', token: '--pin-bg (dark)' },
    { label: 'Text Primary', value: '#111111', token: '--pin-text-primary' },
  ];

  readonly semanticColors = [
    {
      label: 'Success',
      value: '#00a000',
      token: '--pin-color-success',
      bgToken: '--pin-color-success-bg',
      bg: 'rgba(0,180,0,0.08)',
      icon: 'check_circle',
      description: 'Confirmation messages, success states, positive feedback',
    },
    {
      label: 'Error',
      value: '#e53e3e',
      token: '--pin-color-error',
      bgToken: '--pin-color-error-bg',
      bg: 'rgba(229,62,62,0.08)',
      icon: 'error',
      description: 'Validation errors, destructive actions, critical alerts',
    },
  ];

  readonly spacingTokens: SpacingToken[] = [
    { label: '4px', size: '4px', barW: 16 },
    { label: '8px', size: '8px', barW: 32 },
    { label: '12px', size: '12px', barW: 48 },
    { label: '16px', size: '16px', barW: 64 },
    { label: '20px', size: '20px', barW: 80 },
    { label: '24px', size: '24px', barW: 96 },
    { label: '32px', size: '32px', barW: 128 },
    { label: '48px', size: '48px', barW: 192 },
    { label: '64px', size: '64px', barW: 256 },
  ];

  readonly radiusTokens: RadiusToken[] = [
    { label: 'None', value: '0px', token: '--radius-none' },
    { label: 'XS', value: '4px', token: '--radius-xs' },
    { label: 'SM', value: '8px', token: '--radius-sm' },
    { label: 'MD', value: '12px', token: '--radius-md' },
    { label: 'LG', value: '16px', token: '--radius-lg' },
    { label: 'XL', value: '24px', token: '--radius-xl' },
    { label: '2XL', value: '32px', token: '--radius-2xl' },
    { label: 'Pill', value: '9999px', token: '--radius-pill' },
  ];

  readonly shadowTokens: ShadowToken[] = [
    { label: 'SM', value: '0 1px 4px rgba(0,0,0,0.08)', token: '--pin-shadow-sm' },
    { label: 'MD', value: '0 4px 16px rgba(0,0,0,0.12)', token: '--pin-shadow-md' },
    { label: 'LG', value: '0 8px 32px rgba(0,0,0,0.16)', token: '--pin-shadow-lg' },
  ];

  toggleDark(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    if (next) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }

  scrollTo(sectionId: string): void {
    this.activeSection.set(sectionId);
    const el = this.document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  isLight(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }
}
