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

const cb = (slug: string, label: string, exp: string): BwStory => ({
  id: `checkbox--${slug}`,
  group: 'checkbox',
  name: label,
  load: () =>
    import('../components/checkbox/checkbox.scenarios').then(
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
  // Checkbox
  cb('checkbox', 'Checkbox', 'CheckboxScenario'),
  cb('indeterminate', 'Indeterminate', 'IndeterminateScenario'),
  cb('placement', 'Placement', 'PlacementScenario'),
  cb('states', 'States', 'StatesScenario'),
  cb('toggle', 'Toggle', 'ToggleScenario'),
  cb('unlabeled', 'Unlabeled', 'UnlabeledScenario'),
  // Banda A — primitivos (1 story default cada)
  { id: 'divider--divider', group: 'divider', name: 'Divider', load: () => import('../components/divider/divider.component').then((m) => m.DividerScenario) },
  { id: 'spinner--spinner', group: 'spinner', name: 'Spinner', load: () => import('../components/spinner/spinner.component').then((m) => m.SpinnerScenario) },
  { id: 'skeleton--skeleton', group: 'skeleton', name: 'Skeleton', load: () => import('../components/skeleton/skeleton.component').then((m) => m.SkeletonScenario) },
  { id: 'avatar--avatar', group: 'avatar', name: 'Avatar', load: () => import('../components/avatar/avatar.component').then((m) => m.AvatarScenario) },
  { id: 'badge--badge', group: 'badge', name: 'Badge', load: () => import('../components/badge/badge.component').then((m) => m.BadgeScenario) },
  // Banda A — lote 2
  { id: 'heading--heading', group: 'heading', name: 'Heading', load: () => import('../components/heading/heading.component').then((m) => m.HeadingScenario) },
  { id: 'typography--typography', group: 'typography', name: 'Typography', load: () => import('../components/typography/typography.directive').then((m) => m.TypographyScenario) },
  { id: 'icon--icon', group: 'icon', name: 'Icon', load: () => import('../components/icon/icon.component').then((m) => m.IconScenario) },
  { id: 'aspect-ratio-box--aspect-ratio-box', group: 'aspect-ratio-box', name: 'Aspect ratio box', load: () => import('../components/aspect-ratio-box/aspect-ratio-box.component').then((m) => m.AspectRatioBoxScenario) },
  // Banda A — lote 3 (Tag + variações de Badge)
  { id: 'tag--tag', group: 'tag', name: 'Tag', load: () => import('../components/tag/tag.component').then((m) => m.TagScenario) },
  { id: 'badge--notification-circle', group: 'badge', name: 'NotificationCircle', load: () => import('../components/badge/badge-variants').then((m) => m.NotificationCircleScenario) },
  { id: 'badge--hint-dot', group: 'badge', name: 'HintDot', load: () => import('../components/badge/badge-variants').then((m) => m.HintDotScenario) },
  // Banda B — form controls (lote 1)
  { id: 'radio--radio', group: 'radio', name: 'Radio', load: () => import('../components/radio/radio.component').then((m) => m.RadioScenario) },
  { id: 'switch--switch', group: 'switch', name: 'Switch', load: () => import('../components/switch/switch.component').then((m) => m.SwitchScenario) },
  { id: 'input--input', group: 'input', name: 'Input', load: () => import('../components/input/input.component').then((m) => m.InputScenario) },
  { id: 'textarea--textarea', group: 'textarea', name: 'Textarea', load: () => import('../components/textarea/textarea.component').then((m) => m.TextareaScenario) },
  // Banda B — lote 2
  { id: 'pin-code--pin-code', group: 'pin-code', name: 'Pin Code', load: () => import('../components/pin-code/pin-code.component').then((m) => m.PinCodeScenario) },
  { id: 'rating--rating', group: 'rating', name: 'Rating', load: () => import('../components/rating/rating.component').then((m) => m.RatingScenario) },
  // Banda B — lote 3 (fecha Banda B; v2 reusam base)
  { id: 'slider--slider', group: 'slider', name: 'Slider', load: () => import('../components/slider/slider.component').then((m) => m.SliderScenario) },
  { id: 'payment-card--payment-card', group: 'payment-card', name: 'Payment Card', load: () => import('../components/payment-card/payment-card.component').then((m) => m.PaymentCardScenario) },
  { id: 'checkbox-v2--checkbox', group: 'checkbox-v2', name: 'Checkbox', load: () => import('../components/checkbox/checkbox.scenarios').then((m) => m.StatesScenario) },
  { id: 'radio-v2--radio', group: 'radio-v2', name: 'Radio', load: () => import('../components/radio/radio.component').then((m) => m.RadioScenario) },
  // Banda C — layout & coleções
  { id: 'layout-grid--layout-grid', group: 'layout-grid', name: 'Layout Grid', load: () => import('../components/layout-grid/layout-grid.component').then((m) => m.LayoutGridScenario) },
  { id: 'flex-grid--flex-grid', group: 'flex-grid', name: 'FlexGrid', load: () => import('../components/flex-grid/flex-grid.component').then((m) => m.FlexGridScenario) },
  { id: 'list--list', group: 'list', name: 'List', load: () => import('../components/list/list-item.component').then((m) => m.ListScenario) },
  { id: 'tree-view--tree-view', group: 'tree-view', name: 'Tree View', load: () => import('../components/tree-view/tree-view.component').then((m) => m.TreeViewScenario) },
  // Banda D — feedback & progresso
  { id: 'banner--banner', group: 'banner', name: 'Banner', load: () => import('../components/banner/banner.component').then((m) => m.BannerScenario) },
  { id: 'notification--notification', group: 'notification', name: 'Notification', load: () => import('../components/notification/notification.component').then((m) => m.NotificationScenario) },
  { id: 'progress-bar--progress-bar', group: 'progress-bar', name: 'Progress Bar', load: () => import('../components/progress-bar/progress-bar.component').then((m) => m.ProgressBarScenario) },
  { id: 'progress-steps--progress-steps', group: 'progress-steps', name: 'Progress Steps', load: () => import('../components/progress-steps/progress-steps.component').then((m) => m.ProgressStepsScenario) },
  { id: 'stepper--stepper', group: 'stepper', name: 'Stepper', load: () => import('../components/progress-steps/progress-steps.component').then((m) => m.StepperScenario) },
  { id: 'message-card--message-card', group: 'message-card', name: 'Message Card', load: () => import('../components/message-card/message-card.component').then((m) => m.MessageCardScenario) },
  { id: 'link--link', group: 'link', name: 'Link', load: () => import('../components/link/link.component').then((m) => m.LinkScenario) },
  // Banda E — navegação (lote 1)
  { id: 'tabs--tabs', group: 'tabs', name: 'Tabs', load: () => import('../components/tabs/tabs.component').then((m) => m.TabsScenario) },
  { id: 'breadcrumbs--breadcrumbs', group: 'breadcrumbs', name: 'Breadcrumbs', load: () => import('../components/breadcrumbs/breadcrumbs.component').then((m) => m.BreadcrumbsScenario) },
  { id: 'pagination--pagination', group: 'pagination', name: 'Pagination', load: () => import('../components/pagination/pagination.component').then((m) => m.PaginationScenario) },
  // Banda E — lote 2 (fecha navegação)
  { id: 'side-navigation--side-navigation', group: 'side-navigation', name: 'Side Navigation', load: () => import('../components/side-navigation/side-navigation.component').then((m) => m.SideNavigationScenario) },
  { id: 'header-navigation--header-navigation', group: 'header-navigation', name: 'Header Navigation', load: () => import('../components/header-navigation/header-navigation.component').then((m) => m.HeaderNavigationScenario) },
  { id: 'app-nav-bar--app-nav-bar', group: 'app-nav-bar', name: 'Navigation Bar', load: () => import('../components/app-nav-bar/app-nav-bar.component').then((m) => m.AppNavBarScenario) },
  { id: 'mobile-header--mobile-header', group: 'mobile-header', name: 'Mobile Header', load: () => import('../components/mobile-header/mobile-header.component').then((m) => m.MobileHeaderScenario) },
  { id: 'dnd-list--dnd-list', group: 'dnd-list', name: 'DnD List', load: () => import('../components/dnd-list/dnd-list.component').then((m) => m.DndListScenario) },
  // Banda F — overlays (lote 1)
  { id: 'card--card', group: 'card', name: 'Card', load: () => import('../components/card/card.component').then((m) => m.CardScenario) },
  { id: 'tooltip--tooltip', group: 'tooltip', name: 'Tooltip', load: () => import('../components/tooltip/tooltip.component').then((m) => m.TooltipScenario) },
  { id: 'popover--popover', group: 'popover', name: 'Popover', load: () => import('../components/popover/popover.component').then((m) => m.PopoverScenario) },
  // Banda F — lote 2 (superfícies)
  { id: 'modal--modal', group: 'modal', name: 'Modal', load: () => import('../components/modal/modal.component').then((m) => m.ModalScenario) },
  { id: 'drawer--drawer', group: 'drawer', name: 'Drawer', load: () => import('../components/drawer/drawer.component').then((m) => m.DrawerScenario) },
  // Banda F — lote 3 (fecha overlays)
  { id: 'menu--menu', group: 'menu', name: 'Menu', load: () => import('../components/menu/menu.component').then((m) => m.MenuScenario) },
  { id: 'snackbar--snackbar', group: 'snackbar', name: 'Snackbar', load: () => import('../components/snackbar/snackbar.component').then((m) => m.SnackbarScenario) },
  { id: 'toast--toast', group: 'toast', name: 'Toast', load: () => import('../components/toast/toast.component').then((m) => m.ToastScenario) },
  // Banda G — pickers & compostos (lote 1)
  { id: 'select--select', group: 'select', name: 'Select', load: () => import('../components/select/select.component').then((m) => m.SelectScenario) },
  { id: 'combobox--combobox', group: 'combobox', name: 'Combobox', load: () => import('../components/combobox/combobox.component').then((m) => m.ComboboxScenario) },
  { id: 'button-group--button-group', group: 'button-group', name: 'Button Group', load: () => import('../components/button-group/button-group.component').then((m) => m.ButtonGroupScenario) },
  { id: 'button-timed--button-timed', group: 'button-timed', name: 'Button Timed', load: () => import('../components/button-timed/button-timed.component').then((m) => m.ButtonTimedScenario) },
  { id: 'sliding-button--sliding-button', group: 'sliding-button', name: 'Sliding Button', load: () => import('../components/sliding-button/sliding-button.component').then((m) => m.SlidingButtonScenario) },
  { id: 'file-uploader-basic--file-uploader-basic', group: 'file-uploader-basic', name: 'File Uploader Basic', load: () => import('../components/file-uploader-basic/file-uploader-basic.component').then((m) => m.FileUploaderBasicScenario) },
  { id: 'file-uploader--file-uploader', group: 'file-uploader', name: 'File Uploader', load: () => import('../components/file-uploader/file-uploader.component').then((m) => m.FileUploaderScenario) },
  { id: 'phone-input--phone-input', group: 'phone-input', name: 'Phone Input', load: () => import('../components/phone-input/phone-input.component').then((m) => m.PhoneInputScenario) },
  { id: 'datepicker--datepicker', group: 'datepicker', name: 'Datepicker', load: () => import('../components/datepicker/datepicker.component').then((m) => m.DatepickerScenario) },
  { id: 'timepicker--timepicker', group: 'timepicker', name: 'Time Picker', load: () => import('../components/timepicker/timepicker.component').then((m) => m.TimepickerScenario) },
  { id: 'timezonepicker--timezonepicker', group: 'timezonepicker', name: 'Timezone Picker', load: () => import('../components/timezonepicker/timezonepicker.component').then((m) => m.TimezonePickerScenario) },
  { id: 'table-semantic--table-semantic', group: 'table-semantic', name: 'Table Semantic', load: () => import('../components/table-semantic/table-semantic.component').then((m) => m.TableSemanticScenario) },
  { id: 'table--table', group: 'table', name: 'Table', load: () => import('../components/table/table.component').then((m) => m.TableScenario) },
  { id: 'table-grid--table-grid', group: 'table-grid', name: 'Table Grid', load: () => import('../components/table-grid/table-grid.component').then((m) => m.TableGridScenario) },
  { id: 'data-table--data-table', group: 'data-table', name: 'Data Table', load: () => import('../components/data-table/data-table.component').then((m) => m.DataTableScenario) },
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
