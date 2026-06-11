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
  { id: 'select--in-modal', group: 'select', name: 'In modal', load: () => import('../components/select/select.scenarios').then((m) => m.SelectInModalScenario) },
  { id: 'select--input-ref', group: 'select', name: 'Input ref', load: () => import('../components/select/select.scenarios').then((m) => m.SelectInputRefScenario) },
  { id: 'select--control-ref-set-dropdown-open', group: 'select', name: 'Control ref set dropdown open', load: () => import('../components/select/select.scenarios').then((m) => m.SelectCtrlOpenScenario) },
  { id: 'select--control-ref-set-input-value', group: 'select', name: 'Control ref set input value', load: () => import('../components/select/select.scenarios').then((m) => m.SelectCtrlInputScenario) },
  { id: 'select--calls-provided-blur', group: 'select', name: 'Calls provided blur', load: () => import('../components/select/select.scenarios').then((m) => m.SelectCallsBlurScenario) },
  { id: 'select--click-maintains-focus', group: 'select', name: 'Click maintains focus', load: () => import('../components/select/select.scenarios').then((m) => m.SelectClickFocusScenario) },
  { id: 'select--click-triggers-blur', group: 'select', name: 'Click triggers blur', load: () => import('../components/select/select.scenarios').then((m) => m.SelectClickBlurScenario) },
  { id: 'select--unmount-blur', group: 'select', name: 'Unmount blur', load: () => import('../components/select/select.scenarios').then((m) => m.SelectUnmountScenario) },
  { id: 'select--overridden-icon-container', group: 'select', name: 'Overridden icon container', load: () => import('../components/select/select.scenarios').then((m) => m.SelectOverriddenIconScenario) },
  { id: 'select--overridden-menu', group: 'select', name: 'Overridden menu', load: () => import('../components/select/select.scenarios').then((m) => m.SelectOverriddenMenuScenario) },
  // Menu
  { id: 'menu--menu', group: 'menu', name: 'Menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuScenario) },
  { id: 'menu--empty', group: 'menu', name: 'Empty', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuEmptyScenario) },
  { id: 'menu--dividers', group: 'menu', name: 'Dividers', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuDividersScenario) },
  { id: 'menu--grouped-items', group: 'menu', name: 'Grouped items', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuGroupedItemsScenario) },
  { id: 'menu--stateful', group: 'menu', name: 'Stateful', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuStatefulScenario) },
  { id: 'menu--profile-menu', group: 'menu', name: 'Profile menu', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuProfileMenuScenario) },
  { id: 'menu--propagation', group: 'menu', name: 'Propagation', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuPropagationScenario) },
  { id: 'menu--child', group: 'menu', name: 'Child', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuChildScenario) },
  { id: 'menu--child-render-all', group: 'menu', name: 'Child render all', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuChildRenderAllScenario) },
  { id: 'menu--child-in-popover', group: 'menu', name: 'Child in popover', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuChildInPopoverScenario) },
  { id: 'menu--virtualized', group: 'menu', name: 'Virtualized', load: () => import('../components/menu/menu.scenarios').then((m) => m.MenuVirtualizedScenario) },
  // Drawer
  { id: 'drawer--drawer', group: 'drawer', name: 'Drawer', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerScenario) },
  { id: 'drawer--hide-backdrop', group: 'drawer', name: 'Hide backdrop', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerHideBackdropScenario) },
  { id: 'drawer--render-all', group: 'drawer', name: 'Render all', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerRenderAllScenario) },
  { id: 'drawer--select', group: 'drawer', name: 'Select', load: () => import('../components/drawer/drawer.scenarios').then((m) => m.DrawerSelectScenario) },
  // Popover
  { id: 'popover--popover', group: 'popover', name: 'Popover', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverScenario) },
  { id: 'popover--click', group: 'popover', name: 'Click', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverClickScenario) },
  { id: 'popover--hover', group: 'popover', name: 'Hover', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverHoverScenario) },
  { id: 'popover--auto-focus-without-focus-lock', group: 'popover', name: 'Auto focus without focus lock', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverAutoFocusWithoutFocusLockScenario) },
  { id: 'popover--dynamic-trigger-type', group: 'popover', name: 'Dynamic trigger type', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverDynamicTriggerTypeScenario) },
  { id: 'popover--focus-loop', group: 'popover', name: 'Focus loop', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverFocusLoopScenario) },
  { id: 'popover--large-margin', group: 'popover', name: 'Large margin', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverLargeMarginScenario) },
  { id: 'popover--position', group: 'popover', name: 'Position', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverPositionScenario) },
  { id: 'popover--prevent-scroll-on-focus', group: 'popover', name: 'Prevent scroll on focus', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverPreventScrollOnFocusScenario) },
  { id: 'popover--progress-bar', group: 'popover', name: 'Progress bar', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverProgressBarScenario) },
  { id: 'popover--render-all', group: 'popover', name: 'Render all', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverRenderAllScenario) },
  { id: 'popover--reposition', group: 'popover', name: 'Reposition', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverRepositionScenario) },
  { id: 'popover--reposition-with-anchor-update', group: 'popover', name: 'Reposition with anchor update', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverRepositionWithAnchorUpdateScenario) },
  { id: 'popover--scroll', group: 'popover', name: 'Scroll', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverScrollScenario) },
  { id: 'popover--select', group: 'popover', name: 'Select', load: () => import('../components/popover/popover.scenarios').then((m) => m.PopoverSelectScenario) },
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
  { id: 'input--clearable-icon-overrides', group: 'input', name: 'Clearable icon overrides', load: () => import('../components/input/input.scenarios').then((m) => m.InputClearableIconOverridesScenario) },
  { id: 'input--clearable-noescape', group: 'input', name: 'Clearable noescape', load: () => import('../components/input/input.scenarios').then((m) => m.InputClearableNoescapeScenario) },
  { id: 'input--form-control-states', group: 'input', name: 'Form control states', load: () => import('../components/input/input.scenarios').then((m) => m.InputFormControlStatesScenario) },
  { id: 'input--password-icon-overrides', group: 'input', name: 'Password icon overrides', load: () => import('../components/input/input.scenarios').then((m) => m.InputPasswordIconOverridesScenario) },
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
  { id: 'payment-card--stateful', group: 'payment-card', name: 'Stateful', load: () => import('../components/payment-card/payment-card.scenarios').then((m) => m.StatefulPaymentCardScenario) },
  // File Uploader
  { id: 'file-uploader--file-uploader', group: 'file-uploader', name: 'File uploader', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderScenario) },
  { id: 'file-uploader--item-preview', group: 'file-uploader', name: 'Item preview', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderItemPreviewScenario) },
  { id: 'file-uploader--label-hint', group: 'file-uploader', name: 'Label hint', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderLabelHintScenario) },
  { id: 'file-uploader--long-loading', group: 'file-uploader', name: 'Long loading', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderLongLoadingScenario) },
  { id: 'file-uploader--long-loading-multiple-files', group: 'file-uploader', name: 'Long loading multiple files', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderLongLoadingMultipleScenario) },
  { id: 'file-uploader--overrides', group: 'file-uploader', name: 'Overrides', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderOverridesScenario) },
  { id: 'file-uploader--upload-restrictions', group: 'file-uploader', name: 'Upload restrictions', load: () => import('../components/file-uploader/file-uploader.scenarios').then((m) => m.FileUploaderUploadRestrictionsScenario) },
  // File Uploader Basic
  { id: 'file-uploader-basic--file-uploader', group: 'file-uploader-basic', name: 'File uploader', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicScenario) },
  { id: 'file-uploader-basic--pre-drop', group: 'file-uploader-basic', name: 'Pre drop', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicPreDropScenario) },
  { id: 'file-uploader-basic--post-drop', group: 'file-uploader-basic', name: 'Post drop', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicPostDropScenario) },
  { id: 'file-uploader-basic--spinner', group: 'file-uploader-basic', name: 'Spinner', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicSpinnerScenario) },
  { id: 'file-uploader-basic--progress-bar', group: 'file-uploader-basic', name: 'Progress bar', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicProgressBarScenario) },
  { id: 'file-uploader-basic--error', group: 'file-uploader-basic', name: 'Error', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicErrorScenario) },
  { id: 'file-uploader-basic--disabled', group: 'file-uploader-basic', name: 'Disabled', load: () => import('../components/file-uploader-basic/file-uploader-basic.scenarios').then((m) => m.FileUploaderBasicDisabledScenario) },
  // Side Navigation
  { id: 'side-navigation--nav', group: 'side-navigation', name: 'Nav', load: () => import('../components/side-navigation/side-navigation.scenarios').then((m) => m.SideNavScenario) },
  { id: 'side-navigation--nav-long', group: 'side-navigation', name: 'Nav long', load: () => import('../components/side-navigation/side-navigation.scenarios').then((m) => m.SideNavLongScenario) },
  // Mobile Header
  { id: 'mobile-header--mobile-header-fixed', group: 'mobile-header', name: 'Mobile header fixed', load: () => import('../components/mobile-header/mobile-header.scenarios').then((m) => m.MobileHeaderFixedScenario) },
  { id: 'mobile-header--mobile-header-floating', group: 'mobile-header', name: 'Mobile header floating', load: () => import('../components/mobile-header/mobile-header.scenarios').then((m) => m.MobileHeaderFloatingScenario) },
  // Pin Code
  { id: 'pin-code--pin-code', group: 'pin-code', name: 'Pin code', load: () => import('../components/pin-code/pin-code.scenarios').then((m) => m.PinCodeScenario) },
  { id: 'pin-code--mask', group: 'pin-code', name: 'Mask', load: () => import('../components/pin-code/pin-code.scenarios').then((m) => m.PinCodeMaskScenario) },
  { id: 'pin-code--sizes', group: 'pin-code', name: 'Sizes', load: () => import('../components/pin-code/pin-code.scenarios').then((m) => m.PinCodeSizesScenario) },
  { id: 'pin-code--states', group: 'pin-code', name: 'States', load: () => import('../components/pin-code/pin-code.scenarios').then((m) => m.PinCodeStatesScenario) },
  { id: 'pin-code--overrides', group: 'pin-code', name: 'Overrides', load: () => import('../components/pin-code/pin-code.scenarios').then((m) => m.PinCodeOverridesScenario) },
  // Modal
  { id: 'modal--modal', group: 'modal', name: 'Modal', load: () => import('../components/modal/modal.scenarios').then((m) => m.ModalScenario) },
  { id: 'modal--modal-uncloseable', group: 'modal', name: 'Modal uncloseable', load: () => import('../components/modal/modal.scenarios').then((m) => m.ModalUncloseableScenario) },
  { id: 'modal--modal-select', group: 'modal', name: 'Modal select', load: () => import('../components/modal/modal.scenarios').then((m) => m.ModalSelectScenario) },
  { id: 'modal--modal-rtl', group: 'modal', name: 'Modal RTL', load: () => import('../components/modal/modal.scenarios').then((m) => m.ModalRtlScenario) },
  // Tree View
  { id: 'tree-view--tree-view', group: 'tree-view', name: 'Tree view', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewScenario) },
  { id: 'tree-view--interactable', group: 'tree-view', name: 'Interactable', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewInteractableScenario) },
  { id: 'tree-view--render-all', group: 'tree-view', name: 'Render all', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewRenderAllScenario) },
  { id: 'tree-view--rtl', group: 'tree-view', name: 'RTL', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewRtlScenario) },
  { id: 'tree-view--single-expanded', group: 'tree-view', name: 'Single expanded', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewSingleExpandedScenario) },
  { id: 'tree-view--icon-overrides', group: 'tree-view', name: 'Icon overrides', load: () => import('../components/tree-view/tree-view.scenarios').then((m) => m.TreeViewIconOverridesScenario) },
  // Snackbar
  { id: 'snackbar--snackbar-element', group: 'snackbar', name: 'Snackbar element', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarElementScenario) },
  { id: 'snackbar--snackbar-element-overrides', group: 'snackbar', name: 'Snackbar element overrides', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarElementOverridesScenario) },
  { id: 'snackbar--snackbar-element-rtl', group: 'snackbar', name: 'Snackbar element RTL', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarElementRtlScenario) },
  { id: 'snackbar--snackbar-provider', group: 'snackbar', name: 'Snackbar provider', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarProviderScenario) },
  { id: 'snackbar--snackbar-placement', group: 'snackbar', name: 'Snackbar placement', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarPlacementScenario) },
  { id: 'snackbar--snackbar-async', group: 'snackbar', name: 'Snackbar async', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarAsyncScenario) },
  { id: 'snackbar--snackbar-provider-overrides', group: 'snackbar', name: 'Snackbar provider overrides', load: () => import('../components/snackbar/snackbar.scenarios').then((m) => m.SnackbarProviderOverridesScenario) },
  // Toast
  { id: 'toast--toast', group: 'toast', name: 'Toast', load: () => import('../components/toast/toast.scenarios').then((m) => m.ToastScenario) },
  { id: 'toast--toaster', group: 'toast', name: 'Toaster', load: () => import('../components/toast/toast.scenarios').then((m) => m.ToasterScenario) },
  { id: 'toast--toaster-focus', group: 'toast', name: 'Toaster focus', load: () => import('../components/toast/toast.scenarios').then((m) => m.ToasterFocusScenario) },
  { id: 'toast--toast-application-state', group: 'toast', name: 'Toast application state', load: () => import('../components/toast/toast.scenarios').then((m) => m.ToastApplicationStateScenario) },
  // Tooltip
  { id: 'tooltip--tooltip', group: 'tooltip', name: 'Tooltip', load: () => import('../components/tooltip/tooltip.scenarios').then((m) => m.TooltipScenario) },
  { id: 'tooltip--tooltip-complex', group: 'tooltip', name: 'Tooltip complex', load: () => import('../components/tooltip/tooltip.scenarios').then((m) => m.TooltipComplexScenario) },
  { id: 'tooltip--tooltip-interactive-element', group: 'tooltip', name: 'Tooltip interactive element', load: () => import('../components/tooltip/tooltip.scenarios').then((m) => m.TooltipInteractiveElementScenario) },
  { id: 'tooltip--tooltip-arrow-margin', group: 'tooltip', name: 'Tooltip arrow margin', load: () => import('../components/tooltip/tooltip.scenarios').then((m) => m.TooltipArrowMarginScenario) },
  // Combobox
  { id: 'combobox--combobox', group: 'combobox', name: 'Combobox', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxScenario) },
  { id: 'combobox--combobox-sizes', group: 'combobox', name: 'Combobox sizes', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxSizesScenario) },
  { id: 'combobox--combobox-disabled', group: 'combobox', name: 'Combobox disabled', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxDisabledScenario) },
  { id: 'combobox--combobox-search', group: 'combobox', name: 'Combobox search', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxSearchScenario) },
  { id: 'combobox--combobox-autocomplete-false', group: 'combobox', name: 'Combobox autocomplete false', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxAutocompleteFalseScenario) },
  { id: 'combobox--combobox-inline-text-search', group: 'combobox', name: 'Combobox inline text search', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxInlineTextSearchScenario) },
  { id: 'combobox--combobox-async', group: 'combobox', name: 'Combobox async', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxAsyncScenario) },
  { id: 'combobox--combobox-replacement-node', group: 'combobox', name: 'Combobox replacement node', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxReplacementNodeScenario) },
  { id: 'combobox--combobox-overrides', group: 'combobox', name: 'Combobox overrides', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxOverridesScenario) },
  { id: 'combobox--combobox-form', group: 'combobox', name: 'Combobox form', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxFormScenario) },
  { id: 'combobox--combobox-form-control', group: 'combobox', name: 'Combobox form control', load: () => import('../components/combobox/combobox.scenarios').then((m) => m.ComboboxFormControlScenario) },
  // Slider
  { id: 'slider--slider', group: 'slider', name: 'Slider', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderScenario) },
  { id: 'slider--range', group: 'slider', name: 'Range', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderRangeScenario) },
  { id: 'slider--step', group: 'slider', name: 'Step', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderStepScenario) },
  { id: 'slider--marks', group: 'slider', name: 'Marks', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderMarksScenario) },
  { id: 'slider--disabled', group: 'slider', name: 'Disabled', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderDisabledScenario) },
  { id: 'slider--rtl', group: 'slider', name: 'RTL', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderRtlScenario) },
  { id: 'slider--always-show-label', group: 'slider', name: 'Always show label', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderAlwaysShowLabelScenario) },
  { id: 'slider--custom-label', group: 'slider', name: 'Custom label', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderCustomLabelScenario) },
  { id: 'slider--select-dropdown', group: 'slider', name: 'Select dropdown', load: () => import('../components/slider/slider.scenarios').then((m) => m.SliderSelectDropdownScenario) },
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
  // Timepicker
  { id: 'timepicker--time-picker', group: 'timepicker', name: 'Time picker', load: () => import('../components/timepicker/timepicker.scenarios').then((m) => m.TimepickerScenario) },
  { id: 'timepicker--time-picker-min-max-diff-day', group: 'timepicker', name: 'Time picker min max diff day', load: () => import('../components/timepicker/timepicker.scenarios').then((m) => m.TimepickerMinMaxDiffDayScenario) },
  // Timezonepicker
  { id: 'timezonepicker--timezone-picker', group: 'timezonepicker', name: 'Timezone picker', load: () => import('../components/timezonepicker/timezonepicker.scenarios').then((m) => m.TimezonepickerScenario) },
  { id: 'timezonepicker--timezone-picker-abbreviations', group: 'timezonepicker', name: 'Timezone picker abbreviations', load: () => import('../components/timezonepicker/timezonepicker.scenarios').then((m) => m.TimezonepickerAbbreviationsScenario) },
  { id: 'timezonepicker--timezone-picker-additional', group: 'timezonepicker', name: 'Timezone picker additional', load: () => import('../components/timezonepicker/timezonepicker.scenarios').then((m) => m.TimezonepickerAdditionalScenario) },
  // Phone Input
  { id: 'phone-input--phone-input', group: 'phone-input', name: 'Phone input', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.PhoneInputScenario) },
  { id: 'phone-input--phone-input-lite', group: 'phone-input', name: 'Phone input lite', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.PhoneInputLiteScenario) },
  { id: 'phone-input--phone-input-dropdown', group: 'phone-input', name: 'Phone input dropdown', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.PhoneInputDropdownScenario) },
  { id: 'phone-input--phone-input-rtl', group: 'phone-input', name: 'Phone input RTL', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.PhoneInputRtlScenario) },
  { id: 'phone-input--phone-input-overrides', group: 'phone-input', name: 'Phone input overrides', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.PhoneInputOverridesScenario) },
  { id: 'phone-input--country-select-dropdown', group: 'phone-input', name: 'Country select dropdown', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.CountrySelectDropdownScenario) },
  { id: 'phone-input--country-select-small-dropdown', group: 'phone-input', name: 'Country select small dropdown', load: () => import('../components/phone-input/phone-input.scenarios').then((m) => m.CountrySelectSmallDropdownScenario) },
  // Table Grid (P4.23)
  { id: 'table-grid--table-grid', group: 'table-grid', name: 'Table grid', load: () => import('../components/table-grid/table-grid.scenarios').then((m) => m.TableGridScenario) },
  { id: 'table-grid--jobs', group: 'table-grid', name: 'Jobs', load: () => import('../components/table-grid/table-grid.scenarios').then((m) => m.TableGridJobsScenario) },
  { id: 'table-grid--records', group: 'table-grid', name: 'Records', load: () => import('../components/table-grid/table-grid.scenarios').then((m) => m.TableGridRecordsScenario) },
  { id: 'table-grid--sortable', group: 'table-grid', name: 'Sortable', load: () => import('../components/table-grid/table-grid.scenarios').then((m) => m.TableGridSortableScenario) },
  // Table Semantic (P4.24)
  { id: 'table-semantic--table-semantic', group: 'table-semantic', name: 'Table semantic', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableSemanticScenario) },
  { id: 'table-semantic--builder', group: 'table-semantic', name: 'Builder', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableBuilderScenario) },
  { id: 'table-semantic--builder-divider', group: 'table-semantic', name: 'Builder divider', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableBuilderDividerScenario) },
  { id: 'table-semantic--builder-icon-overrides', group: 'table-semantic', name: 'Builder icon overrides', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableBuilderIconOverridesScenario) },
  { id: 'table-semantic--builder-size', group: 'table-semantic', name: 'Builder size', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableBuilderSizeScenario) },
  { id: 'table-semantic--compose', group: 'table-semantic', name: 'Compose', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableSemanticComposeScenario) },
  { id: 'table-semantic--divider', group: 'table-semantic', name: 'Divider', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableSemanticDividerScenario) },
  { id: 'table-semantic--size', group: 'table-semantic', name: 'Size', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableSemanticSizeScenario) },
  { id: 'table-semantic--spacious-sort', group: 'table-semantic', name: 'Spacious sort', load: () => import('../components/table-semantic/table-semantic.scenarios').then((m) => m.TableSemanticSpaciousSortScenario) },
  // Table (P4.22)
  { id: 'table--borderless', group: 'table', name: 'Borderless', load: () => import('../components/table/table.scenarios').then((m) => m.TableBorderlessScenario) },
  { id: 'table--cells', group: 'table', name: 'Cells', load: () => import('../components/table/table.scenarios').then((m) => m.TableCellsScenario) },
  { id: 'table--few-rows', group: 'table', name: 'Few rows', load: () => import('../components/table/table.scenarios').then((m) => m.TableFewRowsScenario) },
  { id: 'table--filter', group: 'table', name: 'Filter', load: () => import('../components/table/table.scenarios').then((m) => m.TableFilterScenario) },
  { id: 'table--pagination', group: 'table', name: 'Pagination', load: () => import('../components/table/table.scenarios').then((m) => m.TablePaginationScenario) },
  { id: 'table--scroll', group: 'table', name: 'Scroll', load: () => import('../components/table/table.scenarios').then((m) => m.TableScrollScenario) },
  { id: 'table--sortable', group: 'table', name: 'Sortable', load: () => import('../components/table/table.scenarios').then((m) => m.TableSortableScenario) },
  { id: 'table--sortable-fill-click', group: 'table', name: 'Sortable fill click', load: () => import('../components/table/table.scenarios').then((m) => m.TableSortableFillClickScenario) },
  // App Nav Bar (P3.27)
  { id: 'app-nav-bar--app-nav-bar', group: 'app-nav-bar', name: 'App nav bar', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarScenario) },
  { id: 'app-nav-bar--get-unique-identifier', group: 'app-nav-bar', name: 'Get unique identifier', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarGetUniqueIdentifierScenario) },
  { id: 'app-nav-bar--icon-overrides', group: 'app-nav-bar', name: 'Icon overrides', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarIconOverridesScenario) },
  { id: 'app-nav-bar--is-main-item-active', group: 'app-nav-bar', name: 'Is main item active', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarIsMainItemActiveScenario) },
  { id: 'app-nav-bar--map-item-to-node', group: 'app-nav-bar', name: 'Map item to node', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarMapItemToNodeScenario) },
  { id: 'app-nav-bar--overrides', group: 'app-nav-bar', name: 'Overrides', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarOverridesScenario) },
  { id: 'app-nav-bar--title-node', group: 'app-nav-bar', name: 'Title node', load: () => import('../components/app-nav-bar/app-nav-bar.scenarios').then((m) => m.AppNavBarTitleNodeScenario) },
  // Data table (P3.28)
  { id: 'data-table--default', group: 'data-table', name: 'Data table', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableScenario) },
  { id: 'data-table--add-remove-columns', group: 'data-table', name: 'Add remove columns', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableAddRemoveColumnsScenario) },
  { id: 'data-table--batch-action', group: 'data-table', name: 'Batch action', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableBatchActionScenario) },
  { id: 'data-table--categorical-column', group: 'data-table', name: 'Categorical column', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableCategoricalColumnScenario) },
  { id: 'data-table--cell-indices', group: 'data-table', name: 'Cell indices', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableCellIndicesScenario) },
  { id: 'data-table--collection-of-objects', group: 'data-table', name: 'Collection of objects', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableCollectionOfObjectsScenario) },
  { id: 'data-table--column-width-resize', group: 'data-table', name: 'Column width resize', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableColumnWidthResizeScenario) },
  { id: 'data-table--columns-not-sortable', group: 'data-table', name: 'Columns not sortable', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableColumnsNotSortableScenario) },
  { id: 'data-table--columns', group: 'data-table', name: 'Columns', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableColumnsScenario) },
  { id: 'data-table--datetime-column', group: 'data-table', name: 'Datetime column', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableDatetimeColumnScenario) },
  { id: 'data-table--empty', group: 'data-table', name: 'Empty', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableEmptyScenario) },
  { id: 'data-table--extracted-filters', group: 'data-table', name: 'Extracted filters', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableExtractedFiltersScenario) },
  { id: 'data-table--extracted-highlight', group: 'data-table', name: 'Extracted highlight', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableExtractedHighlightScenario) },
  { id: 'data-table--full-window', group: 'data-table', name: 'Full window', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableFullWindowScenario) },
  { id: 'data-table--get-rows', group: 'data-table', name: 'Get rows', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableGetRowsScenario) },
  { id: 'data-table--imperative-clear-selection', group: 'data-table', name: 'Imperative clear selection', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableImperativeClearSelectionScenario) },
  { id: 'data-table--included-rows-change', group: 'data-table', name: 'Included rows change', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableIncludedRowsChangeScenario) },
  { id: 'data-table--initial-filters', group: 'data-table', name: 'Initial filters', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableInitialFiltersScenario) },
  { id: 'data-table--initial-selected-rows', group: 'data-table', name: 'Initial selected rows', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableInitialSelectedRowsScenario) },
  { id: 'data-table--initial-sort', group: 'data-table', name: 'Initial sort', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableInitialSortScenario) },
  { id: 'data-table--loading', group: 'data-table', name: 'Loading', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableLoadingScenario) },
  { id: 'data-table--not-filterable', group: 'data-table', name: 'Not filterable', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableNotFilterableScenario) },
  { id: 'data-table--not-searchable', group: 'data-table', name: 'Not searchable', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableNotSearchableScenario) },
  { id: 'data-table--numerical-column', group: 'data-table', name: 'Numerical column', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableNumericalColumnScenario) },
  { id: 'data-table--resizable-column-widths', group: 'data-table', name: 'Resizable column widths', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableResizableColumnWidthsScenario) },
  { id: 'data-table--row-actions', group: 'data-table', name: 'Row actions', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableRowActionsScenario) },
  { id: 'data-table--row-actions-button', group: 'data-table', name: 'Row actions button', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableRowActionsButtonScenario) },
  { id: 'data-table--row-actions-dynamic', group: 'data-table', name: 'Row actions dynamic', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableRowActionsDynamicScenario) },
  { id: 'data-table--row-height', group: 'data-table', name: 'Row height', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableRowHeightScenario) },
  { id: 'data-table--stateful-callback', group: 'data-table', name: 'Stateful callback', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableStatefulCallbackScenario) },
  { id: 'data-table--text-search', group: 'data-table', name: 'Text search', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableTextSearchScenario) },
  { id: 'data-table--rtl', group: 'data-table', name: 'Test rtl', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableRtlScenario) },
  { id: 'data-table--large-data', group: 'data-table', name: 'Large data', load: () => import('../components/data-table/data-table.scenarios').then((m) => m.DataTableLargeDataScenario) },
  // Datepicker (P3.22)
  { id: 'datepicker--stateful-calendar', group: 'datepicker', name: 'Stateful calendar', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerStatefulCalendarScenario) },
  { id: 'datepicker--calendar', group: 'datepicker', name: 'Calendar', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerCalendarScenario) },
  { id: 'datepicker--range-calendar', group: 'datepicker', name: 'Range calendar', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerRangeCalendarScenario) },
  { id: 'datepicker--multi-month', group: 'datepicker', name: 'Multi month', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerMultiMonthScenario) },
  { id: 'datepicker--quick-select', group: 'datepicker', name: 'Quick select', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerQuickSelectScenario) },
  { id: 'datepicker--time-select', group: 'datepicker', name: 'Time select', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerTimeSelectScenario) },
  { id: 'datepicker--time-select-range', group: 'datepicker', name: 'Time select range', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerTimeSelectRangeScenario) },
  { id: 'datepicker--min-max', group: 'datepicker', name: 'Min max', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerMinMaxScenario) },
  { id: 'datepicker--exclude-dates', group: 'datepicker', name: 'Exclude dates', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerExcludeDatesScenario) },
  { id: 'datepicker--filter-date', group: 'datepicker', name: 'Filter date', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerFilterDateScenario) },
  { id: 'datepicker--highlighted-date', group: 'datepicker', name: 'Highlighted date', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerHighlightedDateScenario) },
  { id: 'datepicker--date-label', group: 'datepicker', name: 'Date label', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerDateLabelScenario) },
  { id: 'datepicker--peek-next-month', group: 'datepicker', name: 'Peek next month', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerPeekNextMonthScenario) },
  { id: 'datepicker--dense', group: 'datepicker', name: 'Dense', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerDenseScenario) },
  { id: 'datepicker--locale', group: 'datepicker', name: 'Locale', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerLocaleScenario) },
  { id: 'datepicker--stateful', group: 'datepicker', name: 'Stateful', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerStatefulScenario) },
  { id: 'datepicker--initial-state', group: 'datepicker', name: 'Initial state', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerInitialStateScenario) },
  { id: 'datepicker--range', group: 'datepicker', name: 'Range', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerRangeScenario) },
  { id: 'datepicker--range-separate', group: 'datepicker', name: 'Range separate', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerRangeSeparateScenario) },
  { id: 'datepicker--controlled', group: 'datepicker', name: 'Controlled', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerControlledScenario) },
  { id: 'datepicker--quick-select-dp', group: 'datepicker', name: 'Quick select dp', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerQuickSelectDpScenario) },
  { id: 'datepicker--time-dp', group: 'datepicker', name: 'Time dp', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerTimeDpScenario) },
  { id: 'datepicker--disabled', group: 'datepicker', name: 'Disabled', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerDisabledScenario) },
  { id: 'datepicker--error', group: 'datepicker', name: 'Error', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerErrorScenario) },
  { id: 'datepicker--positive', group: 'datepicker', name: 'Positive', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerPositiveScenario) },
  { id: 'datepicker--clearable', group: 'datepicker', name: 'Clearable', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerClearableScenario) },
  { id: 'datepicker--sizes', group: 'datepicker', name: 'Sizes', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerSizesScenario) },
  { id: 'datepicker--min-max-dp', group: 'datepicker', name: 'Min max dp', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerMinMaxDpScenario) },
  { id: 'datepicker--vertical', group: 'datepicker', name: 'Vertical', load: () => import('../components/datepicker/datepicker.scenarios').then((m) => m.DatepickerVerticalScenario) },
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
