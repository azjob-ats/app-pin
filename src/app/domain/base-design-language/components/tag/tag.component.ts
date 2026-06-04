import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

export type TagKind = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'magenta' | 'teal' | 'lime';
export type TagHierarchy = 'primary' | 'secondary';
export type TagSize = 'xSmall' | 'small' | 'medium' | 'large';

/** Tag — fiel ao baseui/tag (SUPPORTED_KIND de cores, hierarchy primary/secondary, closeable). */
@Component({
  selector: 'bui-tag',
  exportAs: 'buiTag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="bui-tag__text"><ng-content /></span>
    @if (closeable()) {
      <button type="button" class="bui-tag__close" aria-label="Remove" (click)="closed.emit()">
        <span class="material-symbols-rounded">close</span>
      </button>
    }
  `,
  styleUrl: './tag.component.scss',
  host: { '[attr.data-kind]': 'kind()', '[attr.data-hier]': 'hierarchy()', '[attr.data-size]': 'size()' },
})
export class Tag {
  readonly kind = input<TagKind>('gray');
  readonly hierarchy = input<TagHierarchy>('primary');
  readonly size = input<TagSize>('medium');
  readonly closeable = input(true);
  readonly closed = output<void>();
}

@Component({
  selector: 'bui-tag-group',
  exportAs: 'buiTagGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content />',
  styles: `bui-tag-group { display:inline-flex; flex-wrap:wrap; gap:var(--bw-sizing-scale300); }`,
})
export class TagGroup {}

const KINDS: TagKind[] = ['gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'magenta', 'teal', 'lime'];

@Component({
  selector: 'bui-s-tag', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [Tag, TagGroup],
  template: `<div style="display:flex; flex-direction:column; gap:16px;">
    <bui-tag-group>@for (k of kinds; track k) { <bui-tag [kind]="k">{{ k }}</bui-tag> }</bui-tag-group>
    <bui-tag-group>@for (k of kinds; track k) { <bui-tag [kind]="k" hierarchy="secondary">{{ k }}</bui-tag> }</bui-tag-group>
    <div style="display:flex; gap:8px; align-items:center;">
      <bui-tag kind="blue" size="xSmall">xSmall</bui-tag>
      <bui-tag kind="blue" size="small">small</bui-tag>
      <bui-tag kind="blue" size="medium">medium</bui-tag>
      <bui-tag kind="blue" size="large">large</bui-tag>
    </div>
  </div>`,
})
export class TagScenario { protected readonly kinds = KINDS; }
