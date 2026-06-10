import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BuiMessageCard } from './message-card.component';

const A = '/assets/bw';

// message-card--message-card
@Component({
  selector: 'bui-mc-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMessageCard],
  template: `
    <div style="display:flex;flex-direction:column">
      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" backgroundColor="#FFD2CD"
            [image]="{ src: A+'/deliveryHeroItalian.svg', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now"
            [image]="{ src: A+'/deliveryLargeStrawberries.svg', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#A9C9FF"
            [image]="{ src: A+'/earnerLargeRiderDriver.svg', ariaLabel: 'A car with a driver and a passenger' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" buttonKind="tertiary" backgroundColor="#7FD99A"
            [image]="{ src: A+'/deliveryHeroItalian@3x.png', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" buttonKind="tertiary" backgroundColor="#ffffff"
            [image]="{ src: A+'/deliveryLargeStrawberries@3x.png', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#DDB9FF"
            [image]="{ src: A+'/earnerLargeRiderDriver@3x.png', ariaLabel: 'A car with a driver and a passenger' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Heading" paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            buttonLabel="Make it happen" backgroundColor="#A91A90"
            [image]="{ src: A+'/deliveryHeroItalian.svg', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Made it happen')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Go!" backgroundColor="#016974"
            [image]="{ src: A+'/deliveryLargeStrawberries.svg', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Gone')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Much longer heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#845201"
            [image]="{ src: A+'/earnerLargeRiderDriver.svg', ariaLabel: 'A car with a driver and a passenger' }"
            (cardClick)="log('Gone')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Much longer heading" paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            buttonLabel="Make it happen" buttonKind="tertiary" backgroundColor="#C54600"
            [image]="{ src: A+'/deliveryHeroItalian@3x.png', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Made it happen')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            buttonLabel="Go!" buttonKind="tertiary" backgroundColor="#BB032A"
            [image]="{ src: A+'/deliveryLargeStrawberries@3x.png', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Gone')" />
        </div>
        <div style="padding:16px;width:440px">
          <bui-message-card heading="Much longer heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#050C4D"
            [image]="{ src: A+'/earnerLargeRiderDriver@3x.png', ariaLabel: 'A car with a driver and a passenger' }"
            (cardClick)="log('Gone')" />
        </div>
      </div>
    </div>
  `,
})
export class MessageCardScenario {
  A = A;
  log = console.log;
}

// message-card--sizes
@Component({
  selector: 'bui-mc-sizes-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMessageCard],
  template: `
    <div style="display:flex;flex-direction:column">
      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:840px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" backgroundColor="#FFD2CD"
            [image]="{ src: A+'/deliveryHeroItalian.svg', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:200px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" backgroundColor="#FFD2CD"
            [image]="{ src: A+'/deliveryHeroItalian.svg', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:200px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now"
            [image]="{ src: A+'/deliveryLargeStrawberries.svg', layout: 'trailing', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;width:200px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#A9C9FF"
            [image]="{ src: A+'/earnerLargeRiderDriver.svg', ariaLabel: 'A car with a driver' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;width:1240px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" buttonKind="tertiary" backgroundColor="#7FD99A"
            [image]="{ src: A+'/deliveryHeroItalian@3x.png', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>
    </div>
  `,
})
export class MessageCardSizesScenario {
  A = A;
  log = console.log;
}

// message-card--trailing-image
@Component({
  selector: 'bui-mc-trailing-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMessageCard],
  template: `
    <div style="display:flex;flex-direction:column">
      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" backgroundColor="#FFD2CD"
            [image]="{ src: A+'/deliveryHeroItalian.svg', layout: 'trailing', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now"
            [image]="{ src: A+'/deliveryLargeStrawberries.svg', layout: 'trailing', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#A9C9FF"
            [image]="{ src: A+'/earnerLargeRiderDriver.svg', layout: 'trailing', ariaLabel: 'A car with a driver' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" buttonKind="tertiary" backgroundColor="#7FD99A"
            [image]="{ src: A+'/deliveryHeroItalian@3x.png', layout: 'trailing', ariaLabel: 'Illustration of an Italian meal' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            buttonLabel="Save now" buttonKind="tertiary" backgroundColor="#ffffff"
            [image]="{ src: A+'/deliveryLargeStrawberries@3x.png', layout: 'trailing', ariaLabel: 'Illustration of strawberries' }"
            (cardClick)="log('Saved')" />
        </div>
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card heading="Heading" paragraph="ipsum lorem dopem topo logic hippos bananas and the rest"
            backgroundColor="#DDB9FF"
            [image]="{ src: A+'/earnerLargeRiderDriver@3x.png', layout: 'trailing', ariaLabel: 'A car with a driver' }"
            (cardClick)="log('Saved')" />
        </div>
      </div>

      <div style="display:flex;margin-bottom:32px">
        <div style="padding:16px;flex-basis:440px">
          <bui-message-card heading="Tall JPG image doesn't oversize" buttonLabel="CTA!"
            backgroundColor="#050C4D"
            [image]="{ src: A+'/venice.jpg', layout: 'trailing', ariaLabel: 'Venetian canal in a gondola' }"
            (cardClick)="log('CTA')" />
        </div>
      </div>
    </div>
  `,
})
export class MessageCardTrailingScenario {
  A = A;
  log = console.log;
}

// message-card--image-positions
@Component({
  selector: 'bui-mc-positions-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiMessageCard],
  template: `
    <div style="display:flex;flex-direction:column">
      @for (pos of positions; track pos) {
        <div style="display:flex;margin-bottom:32px">
          <div style="padding:16px;width:440px">
            <bui-message-card [heading]="pos" buttonLabel="CTA" backgroundColor="#FFD2CD"
              [image]="{ src: A+'/venice.jpg', backgroundPosition: pos, ariaLabel: 'Venetian canal' }"
              (cardClick)="log('CTA')" />
          </div>
        </div>
      }
    </div>
  `,
})
export class MessageCardImagePositionsScenario {
  A = A;
  log = console.log;
  positions = ['left top','center top','right top','left center','center center','right center','left bottom','center bottom','right bottom'];
}
