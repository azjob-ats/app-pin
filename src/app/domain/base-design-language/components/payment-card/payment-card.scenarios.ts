import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BuiPaymentCard, BuiStatefulPaymentCard } from './payment-card.component';

// payment-card--payment-card
@Component({
  selector: 'bui-pc-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiPaymentCard],
  template: `
    <div style="padding:16px;display:flex;flex-direction:column;gap:16px;max-width:400px">
      <bui-payment-card value="378282246310005" />
      <bui-payment-card value="36259600000004" />
      <bui-payment-card value="6011111111111117" />
      <bui-payment-card value="6550000000000001" />
      <bui-payment-card value="3530111333300000" />
      <bui-payment-card value="6304000000000000" />
      <bui-payment-card value="5555555555554444" />
      <bui-payment-card value="6246729687894613" />
      <bui-payment-card value="4111111111111111" />
      <bui-payment-card value="153342103478161" />
    </div>
  `,
})
export class PaymentCardScenario {}

// payment-card--stateful-payment-card
@Component({
  selector: 'bui-pc-stateful-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BuiStatefulPaymentCard],
  template: `
    <div style="padding:16px;max-width:400px">
      <bui-stateful-payment-card />
    </div>
  `,
})
export class StatefulPaymentCardScenario {}
