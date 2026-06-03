import { Type } from '@angular/core';
import { BW_NAV } from '../documentation/navigation/nav.data';
import { BwStory } from './ladle.model';

const s = (slug: string, label: string, exp: string): BwStory => ({
  id: `button--${slug}`,
  group: 'button',
  name: label,
  load: () =>
    import('../components/button/button.scenarios').then(
      (m) => (m as unknown as Record<string, Type<unknown>>)[exp],
    ),
});

const acc = (slug: string, label: string, exp: string): BwStory => ({
  id: `accordion--${slug}`,
  group: 'accordion',
  name: label,
  load: () =>
    import('../components/accordion/accordion.scenarios').then(
      (m) => (m as unknown as Record<string, Type<unknown>>)[exp],
    ),
});

/** Stories registradas. Button completo; demais componentes nas próximas fases. */
export const BW_STORIES: BwStory[] = [
  s('a11y', 'A11y', 'A11yScenario'),
  s('background-safe', 'Background safe', 'BackgroundSafeScenario'),
  s('button', 'Button', 'ButtonScenario'),
  s('circle', 'Circle', 'CircleScenario'),
  s('colors', 'Colors', 'ColorsScenario'),
  s('enhancers', 'Enhancers', 'EnhancersScenario'),
  s('enhancers-compact', 'Enhancers compact', 'EnhancersCompactScenario'),
  s('enhancers-loading', 'Enhancers loading', 'EnhancersLoadingScenario'),
  s('functional-children', 'Functional children', 'FunctionalChildrenScenario'),
  s('link', 'Link', 'LinkScenario'),
  s('min-hit-area', 'Min hit area', 'MinHitAreaScenario'),
  s('shapes', 'Shapes', 'ShapesScenario'),
  s('sizes', 'Sizes', 'SizesScenario'),
  s('sizes-loading', 'Sizes loading', 'SizesLoadingScenario'),
  s('width-types', 'Width types', 'WidthTypesScenario'),
  // Accordion
  acc('controlled', 'Controlled', 'ControlledScenario'),
  acc('disabled', 'Disabled', 'DisabledScenario'),
  acc('expanded', 'Expanded', 'ExpandedScenario'),
  acc('panel-override', 'Panel override', 'PanelOverrideScenario'),
  acc('stateless-accordion', 'Stateless accordion', 'StatelessAccordionScenario'),
  acc('accordion', 'Accordion', 'AccordionScenario'),
];

export interface BwLadleGroup {
  slug: string;
  label: string;
  stories: BwStory[];
}

/** Grupos do menu do Ladle = TODOS os componentes do catálogo (alfabético), como no Base Web. */
export function ladleGroups(): BwLadleGroup[] {
  const components = BW_NAV.find((c) => c.label === 'Components');
  const items = components ? components.groups.flatMap((g) => g.items) : [];
  return items
    .map((i) => {
      const slug = i.path.replace('components/', '');
      return { slug, label: i.label, stories: BW_STORIES.filter((st) => st.group === slug) };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
