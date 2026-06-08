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

const ARROW_UP = 'M11.2929 6.29289C11.6834 5.90237 12.3166 5.90237 12.7071 6.29289L16.7071 10.2929C17.0976 10.6834 17.0976 11.3166 16.7071 11.7071C16.3166 12.0976 15.6834 12.0976 15.2929 11.7071L13 9.41421V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V9.41421L8.70711 11.7071C8.31658 12.0976 7.68342 12.0976 7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929L11.2929 6.29289Z';
const ARROW_DOWN = 'M12 6C12.5523 6 13 6.44772 13 7V14.5858L15.2929 12.2929C15.6834 11.9024 16.3166 11.9024 16.7071 12.2929C17.0976 12.6834 17.0976 13.3166 16.7071 13.7071L12.7071 17.7071C12.3166 18.0976 11.6834 18.0976 11.2929 17.7071L7.29289 13.7071C6.90237 13.3166 6.90237 12.6834 7.29289 12.2929C7.68342 11.9024 8.31658 11.9024 8.70711 12.2929L11 14.5858V7C11 6.44772 11.4477 6 12 6Z';
const ARROW_LEFT = 'M6.29289 11.2929C5.90237 11.6834 5.90237 12.3166 6.29289 12.7071L10.2929 16.7071C10.6834 17.0976 11.3166 17.0976 11.7071 16.7071C12.0976 16.3166 12.0976 15.6834 11.7071 15.2929L9.41421 13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H9.41421L11.7071 8.70711C12.0976 8.31658 12.0976 7.68342 11.7071 7.29289C11.3166 6.90237 10.6834 6.90237 10.2929 7.29289L6.29289 11.2929Z';
const ARROW_RIGHT = 'M6 12C6 12.5523 6.44772 13 7 13H14.5858L12.2929 15.2929C11.9024 15.6834 11.9024 16.3166 12.2929 16.7071C12.6834 17.0976 13.3166 17.0976 13.7071 16.7071L17.7071 12.7071C17.8946 12.5196 18 12.2652 18 12C18 11.7348 17.8946 11.4804 17.7071 11.2929L13.7071 7.29289C13.3166 6.90237 12.6834 6.90237 12.2929 7.29289C11.9024 7.68342 11.9024 8.31658 12.2929 8.70711L14.5858 11H7C6.44772 11 6 11.4477 6 12Z';
const CHEVRON_RIGHT = 'M9.29289 7.29289C8.90237 7.68342 8.90237 8.31658 9.29289 8.70711L12.5858 12L9.29289 15.2929C8.90237 15.6834 8.90237 16.3166 9.29289 16.7071C9.68342 17.0976 10.3166 17.0976 10.7071 16.7071L14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12C15 11.7348 14.8946 11.4804 14.7071 11.2929L10.7071 7.29289C10.3166 6.90237 9.68342 6.90237 9.29289 7.29289Z';

/** Conjunto de paths nomeados — consumido pelos componentes nomeados e por outros componentes. */
export const ICON_PATHS = {
  check: CHECK, upload: UPLOAD, delete: DELETE, plus: PLUS,
  arrowUp: ARROW_UP, arrowDown: ARROW_DOWN, arrowLeft: ARROW_LEFT, arrowRight: ARROW_RIGHT, chevronRight: CHEVRON_RIGHT,
} as const;

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

@Component({
  selector: 'bui-arrow-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiArrowUp {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Arrow Up');
  protected readonly path = ARROW_UP;
}

@Component({
  selector: 'bui-arrow-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiArrowDown {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Arrow Down');
  protected readonly path = ARROW_DOWN;
}

@Component({
  selector: 'bui-arrow-left',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiArrowLeft {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Arrow Left');
  protected readonly path = ARROW_LEFT;
}

@Component({
  selector: 'bui-arrow-right',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiArrowRight {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Arrow Right');
  protected readonly path = ARROW_RIGHT;
}

@Component({
  selector: 'bui-chevron-right',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiIcon],
  host: { style: 'display: contents' },
  template: `<bui-icon [d]="path" [size]="size()" [color]="color()" [title]="title()" />`,
})
export class BuiChevronRight {
  readonly size = input<string | number>();
  readonly color = input<string>();
  readonly title = input('Chevron Right');
  protected readonly path = CHEVRON_RIGHT;
}
