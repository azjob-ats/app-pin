import { Type } from '@angular/core';
import { BW_NAV } from '../documentation/navigation/nav.data';
import { BwStory } from './ladle.model';

const acc = (slug: string, label: string, exp: string): BwStory => ({
  id: `accordion--${slug}`,
  group: 'accordion',
  name: label,
  load: () =>
    import('../components/accordion/accordion.scenarios').then(
      (m) => (m as unknown as Record<string, Type<unknown>>)[exp],
    ),
});

const typo = (slug: string, label: string, exp: string): BwStory => ({
  id: `typography--${slug}`,
  group: 'typography',
  name: label,
  load: () =>
    import('../components/typography/typography.scenarios').then(
      (m) => (m as unknown as Record<string, Type<unknown>>)[exp],
    ),
});

const av = (slug: string, label: string, exp: string): BwStory => ({
  id: `avatar--${slug}`,
  group: 'avatar',
  name: label,
  load: () =>
    import('../components/avatar/avatar.scenarios').then(
      (m) => (m as unknown as Record<string, Type<unknown>>)[exp],
    ),
});

/** Stories registradas — Accordion, Pagination e Typography (demais componentes removidos do clone). */
export const BW_STORIES: BwStory[] = [
  // Accordion
  acc('controlled', 'Controlled', 'ControlledScenario'),
  acc('disabled', 'Disabled', 'DisabledScenario'),
  acc('expanded', 'Expanded', 'ExpandedScenario'),
  acc('panel-override', 'Panel override', 'PanelOverrideScenario'),
  acc('stateless-accordion', 'Stateless accordion', 'StatelessAccordionScenario'),
  acc('accordion', 'Accordion', 'AccordionScenario'),
  // Pagination
  { id: 'pagination--pagination', group: 'pagination', name: 'Pagination', load: () => import('../components/pagination/pagination.component').then((m) => m.PaginationScenario) },
  // Typography
  typo('body', 'Body', 'BodyScenario'),
  typo('display', 'Display', 'DisplayScenario'),
  typo('heading', 'Heading', 'HeadingScenario'),
  typo('mono', 'Mono', 'MonoScenario'),
  typo('mono-styletron', 'Mono styletron', 'MonoStyletronScenario'),
  typo('overrides', 'Overrides', 'OverridesScenario'),
  // Spinner
  { id: 'spinner--spinner', group: 'spinner', name: 'Spinner', load: () => import('../components/spinner/spinner.scenarios').then((m) => m.SpinnerScenario) },
  // Avatar
  av('avatar', 'Avatar', 'AvatarScenario'),
  av('custom-initials', 'Custom initials', 'CustomInitialsScenario'),
  av('error', 'Error', 'ErrorScenario'),
  av('no-src', 'No src', 'NoSrcScenario'),
  av('update-image', 'Update image', 'UpdateImageScenario'),
  // Divider
  { id: 'divider--divider', group: 'divider', name: 'Divider', load: () => import('../components/divider/divider.scenarios').then((m) => m.DividerScenario) },
];

export interface BwLadleGroup {
  slug: string;
  label: string;
  stories: BwStory[];
}

/** Grupos do menu do Ladle = componentes do catálogo que têm stories (alfabético). */
export function ladleGroups(): BwLadleGroup[] {
  const components = BW_NAV.find((c) => c.label === 'Components');
  const items = components ? components.groups.flatMap((g) => g.items) : [];
  return items
    .map((i) => {
      const slug = i.path.replace('components/', '');
      return { slug, label: i.label, stories: BW_STORIES.filter((st) => st.group === slug) };
    })
    .filter((g) => g.stories.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}
