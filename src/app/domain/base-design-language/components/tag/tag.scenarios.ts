import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiTag, BuiTagStart } from './tag.component';
import { TagKind } from './tag.component';
import { BuiUpload } from '../icon/icon.component';

/** Scenarios portadas de `src/tag/__tests__/*.scenario.tsx`. */
const KINDS: TagKind[] = ['neutral', 'primary', 'accent', 'positive', 'negative', 'warning'];

// tag.scenario.tsx — por kind: secondary / primary(hierarchy) / disabled (sem ✕) + closeable.
@Component({
  selector: 'bui-s-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTag],
  template: `
    @for (k of kinds; track k) {
      <div style="display:flex;align-items:center;gap:20px;margin:4px 0">
        <div style="display:flex;gap:6px">
          <bui-tag [kind]="k" [clickable]="true" [closeable]="false">Label</bui-tag>
          <bui-tag [kind]="k" [clickable]="true" hierarchy="primary" [closeable]="false">Label</bui-tag>
          <bui-tag [kind]="k" [disabled]="true" [closeable]="false">Label</bui-tag>
        </div>
        <div style="display:flex;gap:6px">
          <bui-tag [kind]="k" [clickable]="true">Label</bui-tag>
          <bui-tag [kind]="k" [clickable]="true" hierarchy="primary">Label</bui-tag>
          <bui-tag [kind]="k" [disabled]="true">Label</bui-tag>
        </div>
      </div>
    }
  `,
})
export class TagScenario {
  protected readonly kinds = KINDS;
}

// tag-size.scenario.tsx — small/medium/large × (sem ✕ / com ✕).
@Component({
  selector: 'bui-s-tag-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTag],
  template: `
    <bui-tag size="small" [closeable]="false">Label</bui-tag>
    <bui-tag size="small">Label</bui-tag>
    <br />
    <bui-tag size="medium" [closeable]="false">Label</bui-tag>
    <bui-tag size="medium">Label</bui-tag>
    <br />
    <bui-tag size="large" [closeable]="false">Label</bui-tag>
    <bui-tag size="large">Label</bui-tag>
  `,
})
export class TagSizeScenario {}

// tag-start-enhancer.scenario.tsx — Upload no start, por size.
@Component({
  selector: 'bui-s-tag-start-enhancer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTag, BuiTagStart, BuiUpload],
  template: `
    <bui-tag size="small"><bui-upload buiTagStart [size]="14" />Label</bui-tag>
    <br />
    <bui-tag size="medium"><bui-upload buiTagStart [size]="16" />Label</bui-tag>
    <br />
    <bui-tag size="large"><bui-upload buiTagStart [size]="18" />Label</bui-tag>
  `,
})
export class TagStartEnhancerScenario {}

// tag-long-text.scenario.tsx — texto longo (+ start enhancer).
@Component({
  selector: 'bui-s-tag-long-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiTag, BuiTagStart, BuiUpload],
  template: `
    <bui-tag>Default Color with long text</bui-tag>
    <br />
    <bui-tag><bui-upload buiTagStart [size]="14" />Default Color with long text</bui-tag>
  `,
})
export class TagLongTextScenario {}
