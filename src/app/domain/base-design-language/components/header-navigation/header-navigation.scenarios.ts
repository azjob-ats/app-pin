import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiHeaderNavigation, BuiNavList, BuiNavItem } from './header-navigation.component';
import { Button } from '../button/button.component';
import { Link } from '../link/link.component';

// header-navigation.scenario.tsx — navbar com menu, marca, links e botão.
@Component({
  selector: 'bui-s-header-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiHeaderNavigation, BuiNavList, BuiNavItem, Button, Link],
  template: `<bui-header-navigation>
    <ul buiNavList align="left">
      <li buiNavItem>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Menu" role="img">
          <rect x="4" y="11" width="16" height="2" rx="1" />
          <rect x="4" y="5" width="16" height="2" rx="1" />
          <rect x="4" y="17" width="16" height="2" rx="1" />
        </svg>
      </li>
      <li buiNavItem>Uber</li>
    </ul>
    <ul buiNavList align="center"></ul>
    <ul buiNavList align="right">
      <li buiNavItem><a buiLink>Tab Link One</a></li>
      <li buiNavItem><a buiLink>Tab Link Two</a></li>
      <li buiNavItem><a buiLink>Tab Link Three</a></li>
    </ul>
    <ul buiNavList align="right">
      <li buiNavItem><bui-button>Get started</bui-button></li>
    </ul>
  </bui-header-navigation>`,
})
export class HeaderNavigationScenario {}
