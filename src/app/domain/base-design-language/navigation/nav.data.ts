import { BwNavCategory, BwNavItem } from './nav.model';

/**
 * Árvore de navegação — idêntica a `documentation-site/routes.jsx` do Base Web
 * (mesmos títulos, categorias e ids). `status`: ready=pronta, soon=em construção,
 * na=conceito React-only (documentado, sem componente Angular).
 */
export const BW_NAV: BwNavCategory[] = [
  {
    label: 'Getting started',
    icon: 'rocket_launch',
    groups: [
      {
        label: 'Getting started',
        items: [
          { label: 'Home', path: '', status: 'ready' },
          { label: 'Setup', path: 'getting-started/setup', status: 'soon' },
          { label: 'Learn Base Web', path: 'getting-started/learn', status: 'soon' },
        ],
      },
    ],
  },
  {
    label: 'Design System',
    icon: 'palette',
    groups: [
      {
        label: 'Styles',
        items: [
          { label: 'Design tokens',  path: 'design-system/styles/design-tokens',  status: 'soon' },
        ],
      },
    ],
  },
  {
    label: 'Doc',
    icon: 'description',
    groups: [],
  },
  {
    label: 'Pages examples',
    icon: 'dashboard',
    groups: [],
  },
  {
    label: 'Standard classes',
    icon: 'style',
    groups: [],
  },
  {
    label: 'Tokens',
    icon: 'token',
    groups: [],
  },
  {
    label: 'Utilities',
    icon: 'build',
    groups: [],
  },
  {
    label: 'Components',
    icon: 'widgets',
    groups: [
      {
        label: 'Inputs',
        items: [
          { label: 'Button', path: 'components/button', status: 'ready' },
          { label: 'Button Group', path: 'components/button-group', status: 'ready' },
          { label: 'Button Timed', path: 'components/button-timed', status: 'ready' },
          { label: 'Checkbox', path: 'components/checkbox', status: 'ready' },
          { label: 'Combobox', path: 'components/combobox', status: 'ready' },
          { label: 'Input', path: 'components/input', status: 'ready' },
          { label: 'Payment Card', path: 'components/payment-card', status: 'ready' },
          { label: 'Phone Input', path: 'components/phone-input', status: 'soon' },
          { label: 'Pin Code', path: 'components/pin-code', status: 'ready' },
          { label: 'Radio', path: 'components/radio', status: 'ready' },
          { label: 'Slider', path: 'components/slider', status: 'ready' },
          { label: 'Sliding Button', path: 'components/sliding-button', status: 'ready' },
          { label: 'Stepper', path: 'components/stepper', status: 'ready' },
          { label: 'Switch', path: 'components/switch', status: 'ready' },
          { label: 'Textarea', path: 'components/textarea', status: 'ready' },
        ],
      },
      {
        label: 'Pickers',
        items: [
          { label: 'File Uploader', path: 'components/file-uploader', status: 'ready' },
          { label: 'File Uploader Basic', path: 'components/file-uploader-basic', status: 'ready' },
          { label: 'Menu', path: 'components/menu', status: 'ready' },
          { label: 'Rating', path: 'components/rating', status: 'ready' },
          { label: 'Select', path: 'components/select', status: 'ready' },
        ],
      },
      {
        label: 'Date & Time',
        items: [
          { label: 'Datepicker', path: 'components/datepicker', status: 'ready' },
          { label: 'Time Picker', path: 'components/timepicker', status: 'soon' },
          { label: 'Timezone Picker', path: 'components/timezonepicker', status: 'soon' },
        ],
      },
      {
        label: 'Navigation',
        items: [
          { label: 'Breadcrumbs', path: 'components/breadcrumbs', status: 'ready' },
          { label: 'Navigation Bar', path: 'components/app-nav-bar', status: 'ready' },
          { label: 'Header Navigation', path: 'components/header-navigation', status: 'ready' },
          { label: 'Link', path: 'components/link', status: 'ready' },
          { label: 'Mobile Header', path: 'components/mobile-header', status: 'ready' },
          { label: 'Pagination', path: 'components/pagination', status: 'soon' },
          { label: 'Side Navigation', path: 'components/side-navigation', status: 'ready' },
          { label: 'Tabs', path: 'components/tabs', status: 'ready' },
        ],
      },
      {
        label: 'Content',
        items: [
          { label: 'Accordion', path: 'components/accordion', status: 'ready' },
          { label: 'Avatar', path: 'components/avatar', status: 'ready' },
          { label: 'Badge', path: 'components/badge', status: 'ready' },
          { label: 'Drag and Drop List', path: 'components/dnd-list', status: 'ready' },
          { label: 'Heading', path: 'components/heading', status: 'ready' },
          { label: 'Icon', path: 'components/icon', status: 'ready' },
          { label: 'List', path: 'components/list', status: 'ready' },
          { label: 'Message Card', path: 'components/message-card', status: 'ready' },
          { label: 'Tag', path: 'components/tag', status: 'ready' },
          { label: 'Tree View', path: 'components/tree-view', status: 'ready' },
          { label: 'Typography', path: 'components/typography', status: 'ready' },
        ],
      },
      {
        label: 'Tables',
        items: [
          { label: 'Table', path: 'components/table-semantic', status: 'ready' },
          { label: 'Data Table', path: 'components/data-table', status: 'ready' },
          { label: 'Grid Table', path: 'components/table-grid', status: 'ready' },
          { label: 'Flex Table', path: 'components/table', status: 'ready' },
        ],
      },
      {
        label: 'Progress & Validation',
        items: [
          { label: 'Banner', path: 'components/banner', status: 'ready' },
          { label: 'Notification', path: 'components/notification', status: 'ready' },
          { label: 'Progress Bar', path: 'components/progress-bar', status: 'ready' },
          { label: 'Progress Steps', path: 'components/progress-steps', status: 'soon' },
          { label: 'Skeleton', path: 'components/skeleton', status: 'ready' },
          { label: 'Snackbar', path: 'components/snackbar', status: 'ready' },
          { label: 'Spinner', path: 'components/spinner', status: 'ready' },
          { label: 'Toast', path: 'components/toast', status: 'ready' },
        ],
      },
      {
        label: 'Surfaces',
        items: [
          { label: 'Card', path: 'components/card', status: 'ready' },
          { label: 'Drawer', path: 'components/drawer', status: 'ready' },
          { label: 'Modal', path: 'components/modal', status: 'ready' },
          { label: 'Popover', path: 'components/popover', status: 'ready' },
          { label: 'Tooltip', path: 'components/tooltip', status: 'ready' },
        ],
      },
      {
        label: 'Utility',
        items: [
          { label: 'AspectRatioBox', path: 'components/aspect-ratio-box', status: 'ready' },
          { label: 'Divider', path: 'components/divider', status: 'ready' },
        ],
      },
    ],
  },
];

export const BW_NAV_ITEMS: BwNavItem[] = BW_NAV.flatMap((c) => c.groups.flatMap((g) => g.items));
