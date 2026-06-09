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
  // Heading
  { id: 'heading--heading', group: 'heading', name: 'Heading', load: () => import('../components/heading/heading.scenarios').then((m) => m.HeadingScenario) },
  // Link
  { id: 'link--link', group: 'link', name: 'Link', load: () => import('../components/link/link.scenarios').then((m) => m.LinkScenario) },
  // Stepper
  { id: 'stepper--stepper', group: 'stepper', name: 'Stepper', load: () => import('../components/stepper/stepper.scenarios').then((m) => m.StepperScenario) },
  // Aspect ratio box
  { id: 'aspect-ratio-box--aspect-ratio-box', group: 'aspect-ratio-box', name: 'Aspect ratio box', load: () => import('../components/aspect-ratio-box/aspect-ratio-box.scenarios').then((m) => m.AspectRatioBoxScenario) },
  // Select (núcleo: controle + dropdown)
  { id: 'select--select', group: 'select', name: 'Select', load: () => import('../components/select/select.component').then((m) => m.SelectScenario) },
  { id: 'select--sizes', group: 'select', name: 'Sizes', load: () => import('../components/select/select.component').then((m) => m.SelectSizesScenario) },
  { id: 'select--states', group: 'select', name: 'States', load: () => import('../components/select/select.component').then((m) => m.SelectStatesScenario) },
  // Menu
  { id: 'menu--menu', group: 'menu', name: 'Menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuScenario) },
  { id: 'menu--empty', group: 'menu', name: 'Empty', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuEmptyScenario) },
  { id: 'menu--dividers', group: 'menu', name: 'Dividers', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuDividersScenario) },
  { id: 'menu--grouped-items', group: 'menu', name: 'Grouped items', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuGroupedItemsScenario) },
  { id: 'menu--stateful', group: 'menu', name: 'Stateful', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuStatefulScenario) },
  { id: 'menu--profile-menu', group: 'menu', name: 'Profile menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuProfileMenuScenario) },
  { id: 'menu--propagation', group: 'menu', name: 'Propagation', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuPropagationScenario) },
  // Popover
  { id: 'popover--popover', group: 'popover', name: 'Popover', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverScenario) },
  { id: 'popover--click', group: 'popover', name: 'Click', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverClickScenario) },
  { id: 'popover--hover', group: 'popover', name: 'Hover', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverHoverScenario) },
  // Tag
  { id: 'tag--tag', group: 'tag', name: 'Tag', load: () => import('../components/tag/tag.scenarios').then((m) => m.TagScenario) },
  { id: 'tag--size', group: 'tag', name: 'Size', load: () => import('../components/tag/tag.scenarios').then((m) => m.TagSizeScenario) },
  { id: 'tag--start-enhancer', group: 'tag', name: 'Start enhancer', load: () => import('../components/tag/tag.scenarios').then((m) => m.TagStartEnhancerScenario) },
  { id: 'tag--long-text', group: 'tag', name: 'Long text', load: () => import('../components/tag/tag.scenarios').then((m) => m.TagLongTextScenario) },
  { id: 'tag--overrides', group: 'tag', name: 'Overrides', load: () => import('../components/tag/tag.scenarios').then((m) => m.TagOverridesScenario) },
  // Input
  { id: 'input--input', group: 'input', name: 'Input', load: () => import('../components/input/input.scenarios').then((m) => m.InputScenario) },
  { id: 'input--sizes', group: 'input', name: 'Sizes', load: () => import('../components/input/input.scenarios').then((m) => m.InputSizesScenario) },
  { id: 'input--states', group: 'input', name: 'States', load: () => import('../components/input/input.scenarios').then((m) => m.InputStatesScenario) },
  { id: 'input--before-after', group: 'input', name: 'Before after', load: () => import('../components/input/input.scenarios').then((m) => m.InputBeforeAfterScenario) },
  { id: 'input--clearable', group: 'input', name: 'Clearable', load: () => import('../components/input/input.scenarios').then((m) => m.InputClearableScenario) },
  { id: 'input--password', group: 'input', name: 'Password', load: () => import('../components/input/input.scenarios').then((m) => m.InputPasswordScenario) },
  { id: 'input--with-button', group: 'input', name: 'With button', load: () => import('../components/input/input.scenarios').then((m) => m.InputWithButtonScenario) },
  { id: 'input--mask', group: 'input', name: 'Mask', load: () => import('../components/input/input.scenarios').then((m) => m.InputMaskScenario) },
  { id: 'input--number', group: 'input', name: 'Number', load: () => import('../components/input/input.scenarios').then((m) => m.InputNumberScenario) },
  { id: 'input--disabled-matches-select', group: 'input', name: 'Disabled matches select', load: () => import('../components/input/input.scenarios').then((m) => m.InputDisabledMatchesSelectScenario) },
  { id: 'input--selector', group: 'input', name: 'Selector', load: () => import('../components/input/input.scenarios').then((m) => m.InputSelectorScenario) },
  // Button
  { id: 'button--button', group: 'button', name: 'Button', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonScenario) },
  { id: 'button--sizes', group: 'button', name: 'Sizes', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonSizesScenario) },
  { id: 'button--sizes-loading', group: 'button', name: 'Sizes loading', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonSizesLoadingScenario) },
  { id: 'button--shapes', group: 'button', name: 'Shapes', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonShapesScenario) },
  { id: 'button--colors', group: 'button', name: 'Colors', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonColorsScenario) },
  { id: 'button--circle', group: 'button', name: 'Circle', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonCircleScenario) },
  { id: 'button--enhancers', group: 'button', name: 'Enhancers', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonEnhancersScenario) },
  { id: 'button--enhancers-compact', group: 'button', name: 'Enhancers compact', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonEnhancersCompactScenario) },
  { id: 'button--enhancers-loading', group: 'button', name: 'Enhancers loading', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonEnhancersLoadingScenario) },
  { id: 'button--width-types', group: 'button', name: 'Width types', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonWidthTypeScenario) },
  { id: 'button--link', group: 'button', name: 'Link', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonLinkScenario) },
  { id: 'button--background-safe', group: 'button', name: 'Background safe', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonBackgroundSafeScenario) },
  { id: 'button--min-hit-area', group: 'button', name: 'Min hit area', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonMinHitAreaScenario) },
  { id: 'button--a11y', group: 'button', name: 'A11y', load: () => import('../components/button/button.scenarios').then((m) => m.ButtonA11yScenario) },
  // Icon (buttons adiada — depende de Button)
  { id: 'icon--attributes', group: 'icon', name: 'Attributes', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconAttributesScenario) },
  { id: 'icon--overrides', group: 'icon', name: 'Overrides', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconOverridesScenario) },
  { id: 'icon--buttons', group: 'icon', name: 'Buttons', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconButtonsScenario) },
  // Tabs
  { id: 'tabs--tabs', group: 'tabs', name: 'Tabs', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsScenario) },
  { id: 'tabs--one-child', group: 'tabs', name: 'One child', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsOneChildScenario) },
  { id: 'tabs--controlled', group: 'tabs', name: 'Controlled', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsControlledScenario) },
  // Switch
  { id: 'switch--switch', group: 'switch', name: 'Switch', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchScenario) },
  { id: 'switch--auto-focus', group: 'switch', name: 'Auto focus', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchAutoFocusScenario) },
  { id: 'switch--disabled', group: 'switch', name: 'Disabled', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchDisabledScenario) },
  { id: 'switch--placement', group: 'switch', name: 'Placement', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchPlacementScenario) },
  { id: 'switch--size', group: 'switch', name: 'Size', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchSizesScenario) },
  { id: 'switch--states', group: 'switch', name: 'States', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchStatesScenario) },
  { id: 'switch--unlabeled', group: 'switch', name: 'Unlabeled', load: () => import('../components/switch/switch.scenarios').then((m) => m.SwitchUnlabeledScenario) },
  // Rating
  { id: 'rating--star', group: 'rating', name: 'Star', load: () => import('../components/rating/rating.scenarios').then((m) => m.RatingStarScenario) },
  { id: 'rating--emoticon', group: 'rating', name: 'Emoticon', load: () => import('../components/rating/rating.scenarios').then((m) => m.RatingEmoticonScenario) },
  { id: 'rating--size', group: 'rating', name: 'Size', load: () => import('../components/rating/rating.scenarios').then((m) => m.RatingSizeScenario) },
  // Progress bar
  { id: 'progress-bar--progressbar', group: 'progress-bar', name: 'Progressbar', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarScenario) },
  { id: 'progress-bar--progressbar-intent', group: 'progress-bar', name: 'Progressbar intent', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarIntentScenario) },
  { id: 'progress-bar--progressbar-negative', group: 'progress-bar', name: 'Progressbar negative', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarNegativeScenario) },
  { id: 'progress-bar--progressbar-rounded', group: 'progress-bar', name: 'Progressbar rounded', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarRoundedScenario) },
  { id: 'progress-bar--progressbar-rounded-animated', group: 'progress-bar', name: 'Progressbar rounded animated', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarRoundedAnimatedScenario) },
  { id: 'progress-bar--progressbar-rounded-overrides', group: 'progress-bar', name: 'Progressbar rounded overrides', load: () => import('../components/progress-bar/progress-bar.scenarios').then((m) => m.ProgressbarRoundedOverridesScenario) },
  // Skeleton
  { id: 'skeleton--skeleton', group: 'skeleton', name: 'Skeleton', load: () => import('../components/skeleton/skeleton.scenarios').then((m) => m.SkeletonScenario) },
  { id: 'skeleton--animation', group: 'skeleton', name: 'Animation', load: () => import('../components/skeleton/skeleton.scenarios').then((m) => m.AnimationScenario) },
  { id: 'skeleton--loading', group: 'skeleton', name: 'Loading', load: () => import('../components/skeleton/skeleton.scenarios').then((m) => m.LoadingScenario) },
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
