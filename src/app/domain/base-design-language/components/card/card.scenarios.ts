import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiCard, BuiCardThumbnail, BuiCardTitle, BuiCardBody, BuiCardAction } from './card.component';
import { Button } from '../button/button.component';
import { Link } from '../link/link.component';

const IMG = 'assets/bw/adorable.png';
const LOREM =
  'Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare faucibus ex, non facilisis nisl. Maecenas aliquet mauris ut tempus cursus. Etiam semper luctus sem ac blandit.';

// card.scenario.tsx — thumbnail + title + body + action (botão).
@Component({
  selector: 'bui-s-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCard, BuiCardThumbnail, BuiCardTitle, BuiCardBody, BuiCardAction, Button],
  template: `<div style="width:328px">
    <bui-card>
      <img buiCardThumbnail src="${IMG}" alt="my-image" />
      <h1 buiCardTitle>Card Title Entry</h1>
      <div buiCardBody>Card text</div>
      <div buiCardAction><bui-button style="width:100%">Button Label</bui-button></div>
    </bui-card>
  </div>`,
})
export class CardScenario {}

// card-text-only.scenario.tsx — só body.
@Component({
  selector: 'bui-s-card-text-only',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCard, BuiCardBody],
  template: `<div style="width:328px"><bui-card><div buiCardBody>${LOREM}</div></bui-card></div>`,
})
export class CardTextOnlyScenario {}

// card-image-object.scenario.tsx — headerImage + title + body.
@Component({
  selector: 'bui-s-card-image-object',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCard, BuiCardBody],
  template: `<div style="width:328px">
    <bui-card headerImage="${IMG}" headerAlt="Card Alt Entry" title="Card Title Entry">
      <div buiCardBody>${LOREM}</div>
    </bui-card>
  </div>`,
})
export class CardImageObjectScenario {}

// card-image-link.scenario.tsx — headerImage + title + body + action (link).
@Component({
  selector: 'bui-s-card-image-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCard, BuiCardBody, BuiCardAction, Link],
  template: `<div style="width:328px">
    <bui-card headerImage="${IMG}" title="Card Title Entry">
      <div buiCardBody>${LOREM}</div>
      <div buiCardAction><a buiLink href="#">Link to a Place</a></div>
    </bui-card>
  </div>`,
})
export class CardImageLinkScenario {}

// card-header-level.scenario.tsx — aproximação (Title sempre H1; LevelContext é React).
@Component({
  selector: 'bui-s-card-header-level',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiCard, BuiCardBody],
  template: `<div style="width:328px">
    <bui-card headerImage="${IMG}" title="Card Title Should be H3">
      <div buiCardBody>${LOREM}</div>
    </bui-card>
  </div>`,
})
export class CardHeaderLevelScenario {}
