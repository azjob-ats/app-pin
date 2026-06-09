import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BuiBreadcrumbs } from './breadcrumbs.component';
import { Link } from '../link/link.component';

/** Scenarios portadas de `src/breadcrumbs/__tests__/*.scenario.tsx`. */

// breadcrumbs.scenario.tsx — 2 links + span (chevron entre os itens).
@Component({
  selector: 'bui-s-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBreadcrumbs, Link],
  template: `<bui-breadcrumbs>
    <li><a buiLink href="#">Parent Page</a></li>
    <li><a buiLink href="#">Sub-Parent Page</a></li>
    <li><span>Current Page</span></li>
  </bui-breadcrumbs>`,
})
export class BreadcrumbsScenario {}

// breadcrumbs-trailing.scenario.tsx — showTrailingSeparator (chevron após o último).
@Component({
  selector: 'bui-s-breadcrumbs-trailing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBreadcrumbs, Link],
  template: `<bui-breadcrumbs showTrailingSeparator>
    <li><a buiLink href="#">Parent Page</a></li>
    <li><a buiLink href="#">Sub-Parent Page</a></li>
  </bui-breadcrumbs>`,
})
export class BreadcrumbsTrailingScenario {}

// breadcrumbs-pseudo.scenario.tsx — separador ">" (override ListItem ::before + Separator null).
@Component({
  selector: 'bui-s-breadcrumbs-pseudo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBreadcrumbs, Link],
  template: `<bui-breadcrumbs separator="pseudo">
    <li><a buiLink href="#">Parent Page</a></li>
    <li><a buiLink href="#">Sub-Parent Page</a></li>
    <li><span>Current Page</span></li>
  </bui-breadcrumbs>`,
})
export class BreadcrumbsPseudoScenario {}

// breadcrumbs-icon-overrides.scenario.tsx — aproximação (X verde no separador via tema React).
@Component({
  selector: 'bui-s-breadcrumbs-icon-overrides',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBreadcrumbs, Link],
  template: `<bui-breadcrumbs separator="icon-override">
    <li><a buiLink href="#">Parent Page</a></li>
    <li><a buiLink href="#">Sub-Parent Page</a></li>
    <li><span>Current Page</span></li>
  </bui-breadcrumbs>`,
})
export class BreadcrumbsIconOverridesScenario {}
