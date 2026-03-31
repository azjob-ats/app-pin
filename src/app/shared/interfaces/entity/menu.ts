export interface MenuRouterLink {
  label: string;
  link: string;
  target: string | null;
  closeMenu: boolean;
}

export interface MenuItemComponent {
  element: 'LightDarkToggleComponent' | 'LanguageToggleComponent';
  output: string | null;
  input: string | null;
}

export interface MenuItem {
  icon: string;
  name: string;
  description: string;
  routerLink: MenuRouterLink | null;
  component: MenuItemComponent | null;
  text: string | null;
}

export interface MenuSection {
  id: string;
  name: string;
  description: string;
}

export interface MenuSectionDetail extends MenuSection {
  items: MenuItem[];
}
