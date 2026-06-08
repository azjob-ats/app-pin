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
    label: 'Guides',
    icon: 'menu_book',
    groups: [
      {
        label: 'Guides',
        items: [
          { label: 'Internationalization', path: 'guides/internationalization', status: 'soon', keywords: ['i18n'] },
          { label: 'Bidirectionality', path: 'guides/bidirectionality', status: 'soon', keywords: ['rtl'] },
          { label: 'Theming', path: 'guides/theming', status: 'soon' },
          { label: 'Styling', path: 'guides/styling', status: 'soon' },
          { label: 'Overrides', path: 'guides/understanding-overrides', status: 'soon' },
          { label: 'Colors', path: 'guides/colors', status: 'soon' },
          { label: 'API Cheat Sheet', path: 'cheat-sheet', status: 'soon' },
        ],
      },
    ],
  },
  {
    label: 'Components',
    icon: 'widgets',
    groups: [
      {
        label: 'Inputs',
        items: [
          { label: 'Button', path: 'components/button', status: 'soon' },
          { label: 'Button Group', path: 'components/button-group', status: 'soon' },
          { label: 'Button Timed', path: 'components/button-timed', status: 'soon' },
          { label: 'Checkbox', path: 'components/checkbox', status: 'soon' },
          { label: 'Checkbox-v2', path: 'components/checkbox-v2', status: 'soon' },
          { label: 'Combobox', path: 'components/combobox', status: 'soon' },
          { label: 'Input', path: 'components/input', status: 'soon' },
          { label: 'Payment Card', path: 'components/payment-card', status: 'soon' },
          { label: 'Phone Input', path: 'components/phone-input', status: 'soon' },
          { label: 'Pin Code', path: 'components/pin-code', status: 'soon' },
          { label: 'Radio', path: 'components/radio', status: 'soon' },
          { label: 'Radio-v2', path: 'components/radio-v2', status: 'soon' },
          { label: 'Slider', path: 'components/slider', status: 'soon' },
          { label: 'Sliding Button', path: 'components/sliding-button', status: 'soon' },
          { label: 'Stepper', path: 'components/stepper', status: 'soon' },
          { label: 'Switch', path: 'components/switch', status: 'ready' },
          { label: 'Textarea', path: 'components/textarea', status: 'soon' },
        ],
      },
      {
        label: 'Pickers',
        items: [
          { label: 'File Uploader', path: 'components/file-uploader', status: 'soon' },
          { label: 'File Uploader Basic', path: 'components/file-uploader-basic', status: 'soon' },
          { label: 'Menu', path: 'components/menu', status: 'soon' },
          { label: 'Rating', path: 'components/rating', status: 'ready' },
          { label: 'Select', path: 'components/select', status: 'soon' },
        ],
      },
      {
        label: 'Date & Time',
        items: [
          { label: 'Datepicker', path: 'components/datepicker', status: 'soon' },
          { label: 'Time Picker', path: 'components/timepicker', status: 'soon' },
          { label: 'Timezone Picker', path: 'components/timezonepicker', status: 'soon' },
        ],
      },
      {
        label: 'Navigation',
        items: [
          { label: 'Breadcrumbs', path: 'components/breadcrumbs', status: 'soon' },
          { label: 'Navigation Bar', path: 'components/app-nav-bar', status: 'soon' },
          { label: 'Header Navigation', path: 'components/header-navigation', status: 'soon' },
          { label: 'Link', path: 'components/link', status: 'ready' },
          { label: 'Mobile Header', path: 'components/mobile-header', status: 'soon' },
          { label: 'Pagination', path: 'components/pagination', status: 'soon' },
          { label: 'Side Navigation', path: 'components/side-navigation', status: 'soon' },
          { label: 'Tabs', path: 'components/tabs', status: 'ready' },
        ],
      },
      {
        label: 'Content',
        items: [
          { label: 'Accordion', path: 'components/accordion', status: 'ready' },
          { label: 'Avatar', path: 'components/avatar', status: 'ready' },
          { label: 'Badge', path: 'components/badge', status: 'soon' },
          { label: 'Drag and Drop List', path: 'components/dnd-list', status: 'soon' },
          { label: 'Layout Grid', path: 'components/layout-grid', status: 'soon' },
          { label: 'Heading', path: 'components/heading', status: 'ready' },
          { label: 'Icon', path: 'components/icon', status: 'soon' },
          { label: 'List', path: 'components/list', status: 'soon' },
          { label: 'Message Card', path: 'components/message-card', status: 'soon' },
          { label: 'Tag', path: 'components/tag', status: 'soon' },
          { label: 'Tree View', path: 'components/tree-view', status: 'soon' },
          { label: 'Typography', path: 'components/typography', status: 'ready' },
        ],
      },
      {
        label: 'Tables',
        items: [
          { label: 'Table', path: 'components/table-semantic', status: 'soon' },
          { label: 'Data Table', path: 'components/data-table', status: 'soon' },
          { label: 'Grid Table', path: 'components/table-grid', status: 'soon' },
          { label: 'Flex Table', path: 'components/table', status: 'soon' },
        ],
      },
      {
        label: 'Progress & Validation',
        items: [
          { label: 'Banner', path: 'components/banner', status: 'soon' },
          { label: 'Notification', path: 'components/notification', status: 'soon' },
          { label: 'Progress Bar', path: 'components/progress-bar', status: 'ready' },
          { label: 'Progress Steps', path: 'components/progress-steps', status: 'soon' },
          { label: 'Skeleton', path: 'components/skeleton', status: 'ready' },
          { label: 'Snackbar', path: 'components/snackbar', status: 'soon' },
          { label: 'Spinner', path: 'components/spinner', status: 'ready' },
          { label: 'Toast', path: 'components/toast', status: 'soon' },
        ],
      },
      {
        label: 'Surfaces',
        items: [
          { label: 'Card', path: 'components/card', status: 'soon' },
          { label: 'Drawer', path: 'components/drawer', status: 'soon' },
          { label: 'Modal', path: 'components/modal', status: 'soon' },
          { label: 'Popover', path: 'components/popover', status: 'soon' },
          { label: 'Tooltip', path: 'components/tooltip', status: 'soon' },
        ],
      },
      {
        label: 'Utility',
        items: [
          { label: 'AspectRatioBox', path: 'components/aspect-ratio-box', status: 'ready' },
          { label: 'Divider', path: 'components/divider', status: 'ready' },
          { label: 'FlexGrid', path: 'components/flex-grid', status: 'soon' },
        ],
      },
    ],
  },
  {
    label: 'Discover more',
    icon: 'explore',
    groups: [
      {
        label: 'Discover more',
        items: [
          { label: 'Versioning policy', path: 'discover-more/versioning-policy', status: 'soon' },
          { label: 'Supported platforms', path: 'discover-more/supported-platforms', status: 'soon' },
          { label: 'Comparison', path: 'discover-more/comparison', status: 'soon' },
          { label: 'SEO', path: 'guides/seo', status: 'soon' },
          { label: 'Blog', path: 'blog', status: 'soon' },
        ],
      },
    ],
  },
];

export const BW_NAV_ITEMS: BwNavItem[] = BW_NAV.flatMap((c) => c.groups.flatMap((g) => g.items));
