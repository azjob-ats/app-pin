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
  // Select (controle + dropdown estilo Menu): single/multi/search/creatable/grupos/states
  { id: 'select--select', group: 'select', name: 'Select', load: () => import('../components/select/select.scenarios').then((m) => m.SelectScenario) },
  { id: 'select--sizes', group: 'select', name: 'Sizes', load: () => import('../components/select/select.scenarios').then((m) => m.SelectSizesScenario) },
  { id: 'select--sizes-selected-value', group: 'select', name: 'Sizes selected value', load: () => import('../components/select/select.scenarios').then((m) => m.SelectSizesValueScenario) },
  { id: 'select--states', group: 'select', name: 'States', load: () => import('../components/select/select.scenarios').then((m) => m.SelectStatesScenario) },
  { id: 'select--open', group: 'select', name: 'Open', load: () => import('../components/select/select.scenarios').then((m) => m.SelectOpenScenario) },
  { id: 'select--search-single', group: 'select', name: 'Search single', load: () => import('../components/select/select.scenarios').then((m) => m.SelectSearchSingleScenario) },
  { id: 'select--search-multi', group: 'select', name: 'Search multi', load: () => import('../components/select/select.scenarios').then((m) => m.SelectSearchMultiScenario) },
  { id: 'select--creatable', group: 'select', name: 'Creatable', load: () => import('../components/select/select.scenarios').then((m) => m.SelectCreatableScenario) },
  { id: 'select--creatable-multi', group: 'select', name: 'Creatable multi', load: () => import('../components/select/select.scenarios').then((m) => m.SelectCreatableMultiScenario) },
  { id: 'select--many-options', group: 'select', name: 'Many options', load: () => import('../components/select/select.scenarios').then((m) => m.SelectManyOptionsScenario) },
  { id: 'select--option-group', group: 'select', name: 'Option group', load: () => import('../components/select/select.scenarios').then((m) => m.SelectOptionGroupScenario) },
  { id: 'select--highlight', group: 'select', name: 'Highlight', load: () => import('../components/select/select.scenarios').then((m) => m.SelectHighlightScenario) },
  { id: 'select--async-options', group: 'select', name: 'Async options', load: () => import('../components/select/select.scenarios').then((m) => m.SelectAsyncScenario) },
  { id: 'select--disable-href-anchor', group: 'select', name: 'Disable href anchor', load: () => import('../components/select/select.scenarios').then((m) => m.SelectDisableHrefScenario) },
  { id: 'select--in-flex-container', group: 'select', name: 'In flex container', load: () => import('../components/select/select.scenarios').then((m) => m.SelectInFlexScenario) },
  { id: 'select--rtl', group: 'select', name: 'RTL', load: () => import('../components/select/select.scenarios').then((m) => m.SelectRtlScenario) },
  { id: 'select--icon-overrides', group: 'select', name: 'Icon overrides', load: () => import('../components/select/select.scenarios').then((m) => m.SelectIconOverridesScenario) },
  { id: 'select--search-single-fontsize', group: 'select', name: 'Search single fontsize', load: () => import('../components/select/select.scenarios').then((m) => m.SelectSearchFontsizeScenario) },
  { id: 'select--maintains-input-value', group: 'select', name: 'Maintains input value', load: () => import('../components/select/select.scenarios').then((m) => m.SelectMaintainsScenario) },
  { id: 'select--backspace-behavior', group: 'select', name: 'Backspace behavior', load: () => import('../components/select/select.scenarios').then((m) => m.SelectBackspaceScenario) },
  // Menu
  { id: 'menu--menu', group: 'menu', name: 'Menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuScenario) },
  { id: 'menu--empty', group: 'menu', name: 'Empty', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuEmptyScenario) },
  { id: 'menu--dividers', group: 'menu', name: 'Dividers', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuDividersScenario) },
  { id: 'menu--grouped-items', group: 'menu', name: 'Grouped items', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuGroupedItemsScenario) },
  { id: 'menu--stateful', group: 'menu', name: 'Stateful', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuStatefulScenario) },
  { id: 'menu--profile-menu', group: 'menu', name: 'Profile menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuProfileMenuScenario) },
  { id: 'menu--propagation', group: 'menu', name: 'Propagation', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuPropagationScenario) },
  // Drawer
  { id: 'drawer--drawer', group: 'drawer', name: 'Drawer', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerScenario) },
  { id: 'drawer--hide-backdrop', group: 'drawer', name: 'Hide backdrop', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerHideBackdropScenario) },
  { id: 'drawer--render-all', group: 'drawer', name: 'Render all', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerRenderAllScenario) },
  { id: 'drawer--select', group: 'drawer', name: 'Select', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerSelectScenario) },
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
  // Message card
  { id: 'message-card--message-card', group: 'message-card', name: 'Message card', load: () => import('../components/message-card/message-card.scenarios').then((m) => m.MessageCardScenario) },
  { id: 'message-card--sizes', group: 'message-card', name: 'Sizes', load: () => import('../components/message-card/message-card.scenarios').then((m) => m.MessageCardSizesScenario) },
  { id: 'message-card--trailing-image', group: 'message-card', name: 'Trailing image', load: () => import('../components/message-card/message-card.scenarios').then((m) => m.MessageCardTrailingScenario) },
  { id: 'message-card--image-positions', group: 'message-card', name: 'Image positions', load: () => import('../components/message-card/message-card.scenarios').then((m) => m.MessageCardImagePositionsScenario) },
  // Banner
  { id: 'banner--banner', group: 'banner', name: 'Banner', load: () => import('../components/banner/banner.scenarios').then((m) => m.BannerScenario) },
  { id: 'banner--artwork', group: 'banner', name: 'Artwork', load: () => import('../components/banner/banner.scenarios').then((m) => m.BannerArtworkScenario) },
  { id: 'banner--action-below', group: 'banner', name: 'Action below', load: () => import('../components/banner/banner.scenarios').then((m) => m.BannerActionBelowScenario) },
  { id: 'banner--nested', group: 'banner', name: 'Nested', load: () => import('../components/banner/banner.scenarios').then((m) => m.BannerNestedScenario) },
  { id: 'banner--overrides', group: 'banner', name: 'Overrides', load: () => import('../components/banner/banner.scenarios').then((m) => m.BannerOverridesScenario) },
  // Button timed
  { id: 'button-timed--button-timed', group: 'button-timed', name: 'Button timed', load: () => import('../components/button-timed/button-timed.scenarios').then((m) => m.ButtonTimedScenario) },
  // Button group
  { id: 'button-group--checkbox', group: 'button-group', name: 'Checkbox', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgCheckboxScenario) },
  { id: 'button-group--radio', group: 'button-group', name: 'Radio', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgRadioScenario) },
  { id: 'button-group--kinds', group: 'button-group', name: 'Kinds', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgKindsScenario) },
  { id: 'button-group--sizes', group: 'button-group', name: 'Sizes', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgSizesScenario) },
  { id: 'button-group--selected', group: 'button-group', name: 'Selected', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgSelectedScenario) },
  { id: 'button-group--disabled', group: 'button-group', name: 'Disabled', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgDisabledScenario) },
  { id: 'button-group--pill', group: 'button-group', name: 'Pill', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgPillScenario) },
  { id: 'button-group--wrap', group: 'button-group', name: 'Wrap', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgWrapScenario) },
  { id: 'button-group--padding', group: 'button-group', name: 'Padding', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgPaddingScenario) },
  { id: 'button-group--a11y', group: 'button-group', name: 'A11y', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgA11yScenario) },
  { id: 'button-group--selected-disabled', group: 'button-group', name: 'Selected disabled', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgSelectedDisabledScenario) },
  { id: 'button-group--overrides', group: 'button-group', name: 'Overrides', load: () => import('../components/button-group/button-group.scenarios').then((m) => m.BgOverridesScenario) },
  // Payment Card
  { id: 'payment-card--payment-card', group: 'payment-card', name: 'Payment card', load: () => import('../components/payment-card/payment-card.scenarios').then((m) => m.PaymentCardScenario) },
  { id: 'payment-card--stateful-payment-card', group: 'payment-card', name: 'Stateful payment card', load: () => import('../components/payment-card/payment-card.scenarios').then((m) => m.StatefulPaymentCardScenario) },
  // Icon (buttons adiada — depende de Button)
  { id: 'icon--attributes', group: 'icon', name: 'Attributes', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconAttributesScenario) },
  { id: 'icon--overrides', group: 'icon', name: 'Overrides', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconOverridesScenario) },
  { id: 'icon--buttons', group: 'icon', name: 'Buttons', load: () => import('../components/icon/icon.scenarios').then((m) => m.IconButtonsScenario) },
  // Tabs
  { id: 'tabs--tabs', group: 'tabs', name: 'Tabs', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsScenario) },
  { id: 'tabs--one-child', group: 'tabs', name: 'One child', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsOneChildScenario) },
  { id: 'tabs--controlled', group: 'tabs', name: 'Controlled', load: () => import('../components/tabs/tabs.scenarios').then((m) => m.TabsControlledScenario) },
  // Checkbox
  { id: 'checkbox--checkbox', group: 'checkbox', name: 'Checkbox', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxScenario) },
  { id: 'checkbox--states', group: 'checkbox', name: 'States', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxStatesScenario) },
  { id: 'checkbox--placement', group: 'checkbox', name: 'Placement', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxPlacementScenario) },
  { id: 'checkbox--indeterminate', group: 'checkbox', name: 'Indeterminate', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxIndeterminateScenario) },
  { id: 'checkbox--toggle', group: 'checkbox', name: 'Toggle', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxToggleScenario) },
  { id: 'checkbox--unlabeled', group: 'checkbox', name: 'Unlabeled', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxUnlabeledScenario) },
  { id: 'checkbox--select', group: 'checkbox', name: 'Select', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxSelectScenario) },
  { id: 'checkbox--react-hook-form', group: 'checkbox', name: 'React hook form', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.CheckboxReactHookFormScenario) },
  // Checkbox v2
  { id: 'checkbox-v2--checkbox', group: 'checkbox-v2', name: 'Checkbox', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2Scenario) },
  { id: 'checkbox-v2--states', group: 'checkbox-v2', name: 'States', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2StatesScenario) },
  { id: 'checkbox-v2--placement', group: 'checkbox-v2', name: 'Placement', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2PlacementScenario) },
  { id: 'checkbox-v2--indeterminate', group: 'checkbox-v2', name: 'Indeterminate', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2IndeterminateScenario) },
  { id: 'checkbox-v2--auto-focus', group: 'checkbox-v2', name: 'Auto focus', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2AutoFocusScenario) },
  { id: 'checkbox-v2--unlabeled', group: 'checkbox-v2', name: 'Unlabeled', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2UnlabeledScenario) },
  { id: 'checkbox-v2--react-hook-form', group: 'checkbox-v2', name: 'React hook form', load: () => import('../components/checkbox-v2/checkbox-v2.scenarios').then((m) => m.CheckboxV2ReactHookFormScenario) },
  // Breadcrumbs
  { id: 'breadcrumbs--breadcrumbs', group: 'breadcrumbs', name: 'Breadcrumbs', load: () => import('../components/breadcrumbs/breadcrumbs.scenarios').then((m) => m.BreadcrumbsScenario) },
  { id: 'breadcrumbs--trailing', group: 'breadcrumbs', name: 'Trailing', load: () => import('../components/breadcrumbs/breadcrumbs.scenarios').then((m) => m.BreadcrumbsTrailingScenario) },
  { id: 'breadcrumbs--pseudo', group: 'breadcrumbs', name: 'Pseudo', load: () => import('../components/breadcrumbs/breadcrumbs.scenarios').then((m) => m.BreadcrumbsPseudoScenario) },
  { id: 'breadcrumbs--icon-overrides', group: 'breadcrumbs', name: 'Icon overrides', load: () => import('../components/breadcrumbs/breadcrumbs.scenarios').then((m) => m.BreadcrumbsIconOverridesScenario) },
  // Radio
  { id: 'radio--radio', group: 'radio', name: 'Radio', load: () => import('../components/radio/radio.scenarios').then((m) => m.RadioScenario) },
  { id: 'radio--states', group: 'radio', name: 'States', load: () => import('../components/radio/radio.scenarios').then((m) => m.RadioStatesScenario) },
  { id: 'radio--select', group: 'radio', name: 'Select', load: () => import('../components/radio/radio.scenarios').then((m) => m.RadioSelectScenario) },
  // Card
  { id: 'card--card', group: 'card', name: 'Card', load: () => import('../components/card/card.scenarios').then((m) => m.CardScenario) },
  { id: 'card--text-only', group: 'card', name: 'Text only', load: () => import('../components/card/card.scenarios').then((m) => m.CardTextOnlyScenario) },
  { id: 'card--image-object', group: 'card', name: 'Image object', load: () => import('../components/card/card.scenarios').then((m) => m.CardImageObjectScenario) },
  { id: 'card--image-link', group: 'card', name: 'Image link', load: () => import('../components/card/card.scenarios').then((m) => m.CardImageLinkScenario) },
  { id: 'card--header-level', group: 'card', name: 'Header level', load: () => import('../components/card/card.scenarios').then((m) => m.CardHeaderLevelScenario) },
  // Header navigation
  { id: 'header-navigation--header-navigation', group: 'header-navigation', name: 'Header navigation', load: () => import('../components/header-navigation/header-navigation.scenarios').then((m) => m.HeaderNavigationScenario) },
  // Textarea
  { id: 'textarea--textarea', group: 'textarea', name: 'Textarea', load: () => import('../components/textarea/textarea.scenarios').then((m) => m.TextareaScenario) },
  { id: 'textarea--textarea-resize', group: 'textarea', name: 'Textarea resize', load: () => import('../components/textarea/textarea.scenarios').then((m) => m.TextareaResizeScenario) },
  // Notification
  { id: 'notification--notification', group: 'notification', name: 'Notification', load: () => import('../components/notification/notification.scenarios').then((m) => m.NotificationScenario) },
  // Progress steps
  { id: 'progress-steps--progress-steps', group: 'progress-steps', name: 'Progress steps', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.ProgressStepsScenario) },
  { id: 'progress-steps--is-active', group: 'progress-steps', name: 'Is active', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.ProgressStepsIsActiveScenario) },
  { id: 'progress-steps--numbered-steps', group: 'progress-steps', name: 'Numbered steps', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.NumberedStepsScenario) },
  { id: 'progress-steps--number', group: 'progress-steps', name: 'Number', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.ProgressStepsNumberScenario) },
  { id: 'progress-steps--numbered-steps-icon-overrides', group: 'progress-steps', name: 'Numbered steps icon overrides', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.NumberedStepsIconOverridesScenario) },
  { id: 'progress-steps--progress-step-overrides', group: 'progress-steps', name: 'Progress step overrides', load: () => import('../components/progress-steps/progress-steps.scenarios').then((m) => m.ProgressStepOverridesScenario) },
  // Sliding button
  { id: 'sliding-button--default', group: 'sliding-button', name: 'Default', load: () => import('../components/sliding-button/sliding-button.scenarios').then((m) => m.SlidingButtonScenario) },
  { id: 'sliding-button--low-threshold', group: 'sliding-button', name: 'Low threshold', load: () => import('../components/sliding-button/sliding-button.scenarios').then((m) => m.SlidingButtonLowThresholdScenario) },
  { id: 'sliding-button--states', group: 'sliding-button', name: 'States', load: () => import('../components/sliding-button/sliding-button.scenarios').then((m) => m.SlidingButtonStatesScenario) },
  // Dnd list
  { id: 'dnd-list--dnd-list', group: 'dnd-list', name: 'Dnd list', load: () => import('../components/dnd-list/dnd-list.scenarios').then((m) => m.DndListScenario) },
  // Radio v2
  { id: 'radio-v2--radio', group: 'radio-v2', name: 'Radio', load: () => import('../components/radio-v2/radio-v2.scenarios').then((m) => m.RadioV2Scenario) },
  { id: 'radio-v2--states', group: 'radio-v2', name: 'States', load: () => import('../components/radio-v2/radio-v2.scenarios').then((m) => m.RadioV2StatesScenario) },
  { id: 'radio-v2--align', group: 'radio-v2', name: 'Align', load: () => import('../components/radio-v2/radio-v2.scenarios').then((m) => m.RadioV2AlignScenario) },
  { id: 'radio-v2--label-placement', group: 'radio-v2', name: 'Label placement', load: () => import('../components/radio-v2/radio-v2.scenarios').then((m) => m.RadioV2LabelPlacementScenario) },
  { id: 'radio-v2--contains-interactive-label', group: 'radio-v2', name: 'Contains interactive label', load: () => import('../components/radio-v2/radio-v2.scenarios').then((m) => m.RadioV2InteractiveLabelScenario) },
  // Badge
  { id: 'badge--badge', group: 'badge', name: 'Badge', load: () => import('../components/badge/badge.scenarios').then((m) => m.BadgeScenario) },
  { id: 'badge--inline-badge', group: 'badge', name: 'Inline badge', load: () => import('../components/badge/badge.scenarios').then((m) => m.InlineBadgeScenario) },
  { id: 'badge--notification-circle', group: 'badge', name: 'Notification circle', load: () => import('../components/badge/badge.scenarios').then((m) => m.NotificationCircleScenario) },
  { id: 'badge--hint-dot', group: 'badge', name: 'Hint dot', load: () => import('../components/badge/badge.scenarios').then((m) => m.HintDotScenario) },
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
  // List
  { id: 'list--item', group: 'list', name: 'Item', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemScenario) },
  { id: 'list--heading', group: 'list', name: 'Heading', load: () => import('../components/list/list.scenarios').then((m) => m.ListHeadingScenario) },
  { id: 'list--item-artwork-sizes', group: 'list', name: 'Item artwork sizes', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemArtworkSizesScenario) },
  { id: 'list--item-artwork-min-width', group: 'list', name: 'Item artwork min width', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemArtworkMinWidthScenario) },
  { id: 'list--item-rtl', group: 'list', name: 'Item rtl', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemRtlScenario) },
  { id: 'list--item-overrides', group: 'list', name: 'Item overrides', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemOverridesScenario) },
  { id: 'list--item-menu-adapter', group: 'list', name: 'Item menu adapter', load: () => import('../components/list/list.scenarios').then((m) => m.ListItemMenuAdapterScenario) },
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
