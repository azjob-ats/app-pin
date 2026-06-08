import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BwTypography } from '../typography/typography.directive';
import { BuiHeading, BuiHeadingLevel } from './heading.component';

/** Scenario portada de `src/heading/__tests__/heading.scenario.tsx`. */

const P1 =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum velit ante, ac fringilla nulla pulvinar in. Aenean ut nisi mattis, lobortis purus vel, aliquet ante. In vel viverra lectus. Vivamus a diam faucibus, rutrum quam a, varius felis. Sed pellentesque sodales libero commodo vestibulum. Phasellus convallis gravida tempor. Sed ut bibendum nisl.';
const P2 =
  'Vivamus vehicula justo suscipit, vestibulum nibh eu, faucibus nisi. Aenean molestie sapien nibh, sed sagittis turpis iaculis id. Nam mollis pulvinar ex eget gravida. Pellentesque fringilla odio a consequat condimentum. Curabitur ut auctor mi. Nunc blandit, tellus quis fringilla sollicitudin, risus libero scelerisque lorem, ut sagittis risus ipsum in nisl.';
const P3 =
  'Cras posuere placerat sem sit amet dignissim. Sed pellentesque sagittis sapien at maximus. Ut at gravida lectus. Suspendisse lectus libero, eleifend vestibulum imperdiet ut, rhoncus eu augue. Pellentesque in vulputate lacus, quis molestie lorem. Aenean sit amet blandit nisi. Nullam molestie mi vel quam vehicula, in cursus eros tempus. Sed placerat turpis vestibulum quam suscipit, eget volutpat massa aliquet.';
const P4 =
  'Proin et posuere lectus. Curabitur condimentum, mauris in viverra euismod, diam elit porttitor quam, ac dictum diam diam eu mauris. Maecenas viverra, turpis sed commodo hendrerit, quam ipsum finibus mauris, et scelerisque sapien tellus mollis leo. Praesent posuere, felis at sagittis hendrerit, est massa tincidunt risus, eget tempus dolor ligula et odio. Praesent luctus lacus quis tristique semper. Etiam semper lacus non auctor fringilla.';

// heading.scenario.tsx — 6 níveis aninhados (HeadingLevel) com Headings h1→h6 e
// ParagraphLarge intercalados; volta ao L2 com "Motivation [L2]".
@Component({
  selector: 'bui-s-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiHeading, BuiHeadingLevel, BwTypography],
  template: `
    <bui-heading-level>
      <bui-heading>Base Web [L1]</bui-heading>
      <p buiTypo="ParagraphLarge">${P1}</p>
      <bui-heading-level>
        <bui-heading>Introduction [L2]</bui-heading>
        <p buiTypo="ParagraphLarge">${P2}</p>
        <bui-heading-level>
          <bui-heading>Quotes [L3]</bui-heading>
          <p buiTypo="ParagraphLarge">${P3}</p>
          <bui-heading-level>
            <bui-heading>Subtitle [L4]</bui-heading>
            <p buiTypo="ParagraphLarge">${P4}</p>
            <bui-heading-level>
              <bui-heading>Subtitle [L5]</bui-heading>
              <p buiTypo="ParagraphLarge">${P2}</p>
              <bui-heading-level>
                <bui-heading>Subtitle [L6]</bui-heading>
                <p buiTypo="ParagraphLarge">${P4}</p>
              </bui-heading-level>
            </bui-heading-level>
          </bui-heading-level>
        </bui-heading-level>
        <bui-heading>Motivation [L2]</bui-heading>
        <p buiTypo="ParagraphLarge">${P2}</p>
      </bui-heading-level>
    </bui-heading-level>
  `,
})
export class HeadingScenario {}
