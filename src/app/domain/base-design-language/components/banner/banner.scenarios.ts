import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BuiDeleteAlt } from '../icon/icon.component';
import { BuiDelete } from '../icon/icon.component';
import { BuiBanner, BannerHierarchy, BannerKind } from './banner.component';

const variants: Array<[BannerHierarchy, BannerKind]> = [
  ['low', 'info'],
  ['low', 'negative'],
  ['low', 'positive'],
  ['low', 'warning'],
  ['high', 'info'],
  ['high', 'negative'],
  ['high', 'positive'],
  ['high', 'warning'],
];

// banner--banner
@Component({
  selector: 'bui-banner-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiBanner, BuiDelete],
  template: `
    <div style="display:flex">
      <!-- Column 1: title + paragraph -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text">
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- Column 2: no title, just paragraph -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]">
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- Column 3: with trailing text action -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]"
            [action]="{ label: 'Label', onClick: noop }">
            Paragraph text
          </bui-banner>
        }
        <bui-banner [action]="{ label: 'Longer label text', onClick: noop }">Paragraph text</bui-banner>
      </div>

      <!-- Column 4: with trailing icon action -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]"
            [action]="{ label: 'Label', icon: true, onClick: noop }">
            <bui-delete buiBannerActionIcon size="20" />
            Paragraph text
          </bui-banner>
        }
      </div>
    </div>
  `,
})
export class BannerScenario {
  variants = variants;
  noop = () => {};
}

// banner--artwork
@Component({
  selector: 'bui-banner-artwork-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiBanner, BuiDeleteAlt],
  template: `
    <div style="display:flex">
      <!-- artwork icon, no title -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" [artwork]="{ type: 'icon' }">
            <bui-delete-alt buiBannerArtwork size="32" />
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- artwork icon, with title -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text" [artwork]="{ type: 'icon' }">
            <bui-delete-alt buiBannerArtwork size="32" />
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- artwork badge, no title -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" [artwork]="{ type: 'badge' }">
            <bui-delete-alt buiBannerArtwork size="40" />
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- artwork badge, with title -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text" [artwork]="{ type: 'badge' }">
            <bui-delete-alt buiBannerArtwork size="40" />
            Paragraph text
          </bui-banner>
        }
      </div>
    </div>
  `,
})
export class BannerArtworkScenario {
  variants = variants;
}

// banner--action-below
@Component({
  selector: 'bui-banner-action-below-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiBanner, BuiDeleteAlt],
  template: `
    <div style="display:flex">
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text"
            [action]="{ label: 'Label', position: 'below', onClick: noop }"
            [artwork]="{ type: 'icon' }">
            <bui-delete-alt buiBannerArtwork size="32" />
            Paragraph text
          </bui-banner>
        }
      </div>
    </div>
  `,
})
export class BannerActionBelowScenario {
  variants = variants;
  noop = () => {};
}

// banner--nested
@Component({
  selector: 'bui-banner-nested-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiBanner, BuiDelete],
  template: `
    <div style="display:flex">
      <!-- nested, title only -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text" [nested]="true">
            Paragraph text
          </bui-banner>
        }
      </div>

      <!-- nested + icon action -->
      <div style="width:300px">
        @for (v of variants; track $index) {
          <bui-banner [hierarchy]="v[0]" [kind]="v[1]" title="Headline text" [nested]="true"
            [action]="{ label: 'dismiss', icon: true, onClick: noop }">
            <bui-delete buiBannerActionIcon size="20" />
            Paragraph text
          </bui-banner>
        }
      </div>
    </div>
  `,
})
export class BannerNestedScenario {
  variants = variants;
  noop = () => {};
}

// banner--overrides
@Component({
  selector: 'bui-banner-overrides-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiBanner, BuiDeleteAlt, BuiDelete],
  template: `
    <div style="width:400px">
      <!-- icon action -->
      <bui-banner title="Headline text" [artwork]="{ type: 'icon' }"
        [action]="{ label: 'Label', icon: true, onClick: noop }">
        <bui-delete-alt buiBannerArtwork size="32" />
        <bui-delete buiBannerActionIcon size="20" />
        Paragraph text
      </bui-banner>

      <!-- trailing text action -->
      <bui-banner title="Headline text" [artwork]="{ type: 'icon' }"
        [action]="{ label: 'Label', onClick: noop }">
        <bui-delete-alt buiBannerArtwork size="32" />
        Paragraph text
      </bui-banner>

      <!-- below action -->
      <bui-banner title="Headline text" [artwork]="{ type: 'icon' }"
        [action]="{ label: 'Label', position: 'below', onClick: noop }">
        <bui-delete-alt buiBannerArtwork size="32" />
        Paragraph text
      </bui-banner>
    </div>
  `,
})
export class BannerOverridesScenario {
  noop = () => {};
}
