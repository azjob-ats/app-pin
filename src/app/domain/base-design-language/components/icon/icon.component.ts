import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

/**
 * Icon — clone fiel do `baseui/icon`. Base de todos os ícones: `<svg data-baseweb="icon">`
 * com `width`/`height` = `size` (número→px, `scale*`→token, ou valor CSS; default `scale600`
 * = 16px) e `fill`/`color` = `color` (default `currentColor`). O path vem por `d` (string ou
 * lista) — projeção de `<path>` SVG entre componentes não preserva o namespace, por isso o
 * desenho é renderizado aqui dentro do próprio `<svg>`.
 */
@Component({
  selector: 'bui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { style: 'display: contents' },
  template: `
    <svg
      data-baseweb="icon"
      class="bui-icon"
      xmlns="http://www.w3.org/2000/svg"
      [attr.viewBox]="viewBox()"
      [style.display]="'inline-block'"
      [style.width]="dim()"
      [style.height]="dim()"
      [style.fill]="col()"
      [style.color]="col()"
    >
      @if (title()) {
        <title>{{ title() }}</title>
      }
      @for (p of paths(); track $index) {
        <path fill-rule="evenodd" clip-rule="evenodd" [attr.d]="p" />
      }
    </svg>
  `,
})
export class BuiIcon {
  /** Path(s) do desenho. */
  readonly d = input<string | string[]>();
  /** Tamanho: número/numérico → px; `scale*` → token de sizing; outro → valor CSS. Default 16px. */
  readonly size = input<string | number>();
  /** Cor (`fill`/`color`). Default `currentColor`. */
  readonly color = input<string>();
  /** `<title>` do SVG (acessibilidade). */
  readonly title = input<string>();
  readonly viewBox = input('0 0 24 24');

  protected readonly paths = computed(() => {
    const d = this.d();
    return Array.isArray(d) ? d : d ? [d] : [];
  });

  protected readonly dim = computed(() => {
    const s = this.size();
    if (s == null) return 'var(--bw-sizing-scale600)';
    if (typeof s === 'number') return `${s}px`;
    if (/^scale\d+$/.test(s)) return `var(--bw-sizing-${s})`;
    if (/^\d+$/.test(s)) return `${s}px`;
    return s;
  });

  protected readonly col = computed(() => this.color() ?? 'currentColor');
}

/* ── Ícones nomeados (paths gerados pelo baseweb) ──────────────────────────── */

const CHECK = 'M17.6 7.20006C18.0418 7.53143 18.1314 8.15823 17.8 8.60006L11.8 16.6001C11.6261 16.832 11.3601 16.977 11.0709 16.9975C10.7817 17.0181 10.4979 16.9122 10.2929 16.7072L7.29289 13.7072C6.90237 13.3166 6.90237 12.6835 7.29289 12.293C7.68342 11.9024 8.31658 11.9024 8.70711 12.293L10.8918 14.4777L16.2 7.40006C16.5314 6.95823 17.1582 6.86869 17.6 7.20006Z';
const UPLOAD = 'M14.5 5C12.8755 5 11.4519 5.86084 10.6609 7.15112C10.2905 7.05249 9.90137 7 9.5 7C7.14185 7 5.20752 8.81372 5.01562 11.1221C3.28247 11.5605 2 13.1304 2 15C2 17.2092 3.79077 19 6 19H11V14.4143L9.70703 15.707C9.31665 16.0977 8.68335 16.0977 8.29297 15.707C7.90234 15.3167 7.90234 14.6833 8.29297 14.293L11.293 11.293C11.6833 10.9023 12.3167 10.9023 12.707 11.293L15.707 14.293C16.0977 14.6833 16.0977 15.3167 15.707 15.707C15.3167 16.0977 14.6833 16.0977 14.293 15.707L13 14.4143V19H17C19.7615 19 22 16.7615 22 14C22 11.9492 20.7656 10.187 18.9993 9.41577C18.9543 6.96924 16.9573 5 14.5 5Z';
const DELETE = 'M7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L12 10.5858L15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711L13.4142 12L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12 13.4142L8.70711 16.7071C8.31658 17.0976 7.68342 17.0976 7.29289 16.7071C6.90237 16.3166 6.90237 15.6834 7.29289 15.2929L10.5858 12L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289Z';
const PLUS = 'M12 5C12.5523 5 13 5.44772 13 6V11L18 11C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13L13 13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13L6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44771 11 6 11L11 11V6C11 5.44772 11.4477 5 12 5Z';

/** Conjunto de paths nomeados — consumido pelos componentes nomeados e por outros componentes. */
export const ICON_PATHS = { check: CHECK, upload: UPLOAD, delete: DELETE, plus: PLUS } as const;

@Component({
  selector: 'bui-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiCheck {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Check');
  protected readonly path = CHECK;
}

@Component({
  selector: 'bui-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiUpload {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Upload');
  protected readonly path = UPLOAD;
}

@Component({
  selector: 'bui-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiDelete {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Delete');
  protected readonly path = DELETE;
}

@Component({
  selector: 'bui-plus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiPlus {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Plus');
  protected readonly path = PLUS;
}
