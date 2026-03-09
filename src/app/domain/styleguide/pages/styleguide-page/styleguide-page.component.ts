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
  token: string;
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

interface FontSizeToken {
  label: string;
  value: string;
  token: string;
  px: string;
}

interface FontWeightToken {
  label: string;
  value: number;
  token: string;
}

interface SizingToken {
  label: string;
  value: string;
  token: string;
}

interface OpacityToken {
  label: string;
  value: number;
  token: string;
}

interface ZIndexToken {
  label: string;
  value: number;
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
    { id: 'overview',   label: 'Overview',     icon: 'auto_awesome' },
    { id: 'colors',     label: 'Colors',        icon: 'palette' },
    { id: 'typography', label: 'Typography',    icon: 'text_fields' },
    { id: 'spacing',    label: 'Spacing',       icon: 'straighten' },
    { id: 'radius',     label: 'Border Radius', icon: 'rounded_corner' },
    { id: 'shadows',    label: 'Shadows',       icon: 'blur_on' },
    { id: 'sizing',     label: 'Sizing',        icon: 'open_in_full' },
    { id: 'opacity',    label: 'Opacity',       icon: 'opacity' },
    { id: 'zindex',     label: 'Z-Index',       icon: 'layers' },
    { id: 'utilities',  label: 'Utilities',     icon: 'build' },
    { id: 'components', label: 'Components',    icon: 'widgets' },
  ];

  readonly primaryColors: ColorToken[] = [
    { label: '400', value: '#FF4747', token: '--pin-red-light' },
    { label: '500', value: '#E60023', token: '--pin-red' },
    { label: '600', value: '#CC001F', token: '--pin-red-hover' },
    { label: '700', value: '#AD081B', token: '--pin-red-dark' },
  ];

  readonly grayColors: ColorToken[] = [
    { label: 'White',                value: '#ffffff', token: '--pin-bg' },
    { label: 'Background Tertiary',  value: '#F8F8F8', token: '--pin-bg-tertiary' },
    { label: 'Background Secondary', value: '#F0F0F0', token: '--pin-bg-secondary' },
    { label: 'Border',               value: '#E0E0E0', token: '--pin-border' },
    { label: 'Text Muted',           value: '#ADADAD', token: '--pin-text-muted' },
    { label: 'Text Secondary',       value: '#767676', token: '--pin-text-secondary' },
    { label: 'Dark Border',          value: '#404040', token: '--pin-border (dark)' },
    { label: 'Saved State',          value: '#333333', token: '--pin-saved-bg' },
    { label: 'Dark Surface',         value: '#2D2D2D', token: '--pin-bg-secondary (dark)' },
    { label: 'Dark Background',      value: '#1A1A1A', token: '--pin-bg (dark)' },
    { label: 'Text Primary',         value: '#111111', token: '--pin-text-primary' },
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
    { label: 'XS',  size: '4px',  token: '--space-xs',  barW: 16 },
    { label: 'SM',  size: '8px',  token: '--space-sm',  barW: 32 },
    { label: 'MD',  size: '12px', token: '--space-md',  barW: 48 },
    { label: 'LG',  size: '16px', token: '--space-lg',  barW: 64 },
    { label: 'XL',  size: '20px', token: '--space-xl',  barW: 80 },
    { label: '2XL', size: '24px', token: '--space-2xl', barW: 96 },
    { label: '3XL', size: '32px', token: '--space-3xl', barW: 128 },
    { label: '4XL', size: '48px', token: '--space-4xl', barW: 192 },
    { label: '5XL', size: '64px', token: '--space-5xl', barW: 256 },
  ];

  readonly radiusTokens: RadiusToken[] = [
    { label: 'None',   value: '0px',    token: '--radius-none' },
    { label: 'XS',     value: '4px',    token: '--radius-xs' },
    { label: 'SM',     value: '8px',    token: '--radius-sm' },
    { label: 'MD',     value: '12px',   token: '--radius-md' },
    { label: 'LG',     value: '16px',   token: '--radius-lg' },
    { label: 'XL',     value: '24px',   token: '--radius-xl' },
    { label: '2XL',    value: '32px',   token: '--radius-2xl' },
    { label: 'Circle', value: '50%',    token: '--radius-circle' },
    { label: 'Pill',   value: '9999px', token: '--radius-pill' },
  ];

  readonly shadowTokens: ShadowToken[] = [
    { label: 'SM', value: '0 1px 4px rgba(0,0,0,0.08)',  token: '--pin-shadow-sm' },
    { label: 'MD', value: '0 4px 16px rgba(0,0,0,0.12)', token: '--pin-shadow-md' },
    { label: 'LG', value: '0 8px 32px rgba(0,0,0,0.16)', token: '--pin-shadow-lg' },
  ];

  readonly fontSizeTokens: FontSizeToken[] = [
    { label: '3XS',  value: '0.65rem',  token: '--text-3xs',  px: '10.4px' },
    { label: '2XS',  value: '0.75rem',  token: '--text-2xs',  px: '12px' },
    { label: 'XS',   value: '0.8rem',   token: '--text-xs',   px: '12.8px' },
    { label: 'SM',   value: '0.875rem', token: '--text-sm',   px: '14px' },
    { label: 'MD',   value: '0.9rem',   token: '--text-md',   px: '14.4px' },
    { label: 'Base', value: '0.95rem',  token: '--text-base', px: '15.2px' },
    { label: 'LG',   value: '1rem',     token: '--text-lg',   px: '16px' },
    { label: 'XL',   value: '1.25rem',  token: '--text-xl',   px: '20px' },
    { label: '2XL',  value: '1.5rem',   token: '--text-2xl',  px: '24px' },
    { label: '3XL',  value: '1.75rem',  token: '--text-3xl',  px: '28px' },
    { label: '4XL',  value: '2rem',     token: '--text-4xl',  px: '32px' },
    { label: '5XL',  value: '2.5rem',   token: '--text-5xl',  px: '40px' },
    { label: '6XL',  value: '3rem',     token: '--text-6xl',  px: '48px' },
    { label: '7XL',  value: '4rem',     token: '--text-7xl',  px: '64px' },
  ];

  readonly fontWeightTokens: FontWeightToken[] = [
    { label: 'Normal',   value: 400, token: '--font-weight-normal' },
    { label: 'Medium',   value: 500, token: '--font-weight-medium' },
    { label: 'Semibold', value: 600, token: '--font-weight-semibold' },
    { label: 'Bold',     value: 700, token: '--font-weight-bold' },
  ];

  readonly sizingTokens: SizingToken[] = [
    { label: 'XS', value: '24px', token: '--size-xs' },
    { label: 'SM', value: '32px', token: '--size-sm' },
    { label: 'MD', value: '48px', token: '--size-md' },
    { label: 'LG', value: '64px', token: '--size-lg' },
    { label: 'XL', value: '96px', token: '--size-xl' },
  ];

  readonly opacityTokens: OpacityToken[] = [
    { label: 'Disabled', value: 0.5, token: '--opacity-disabled' },
    { label: 'Muted',    value: 0.6, token: '--opacity-muted' },
  ];

  readonly zIndexTokens: ZIndexToken[] = [
    { label: 'Base',    value: 10,   token: '--z-base' },
    { label: 'Topbar',  value: 50,   token: '--z-topbar' },
    { label: 'Sidebar', value: 100,  token: '--z-sidebar' },
    { label: 'Toast',   value: 9999, token: '--z-toast' },
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
