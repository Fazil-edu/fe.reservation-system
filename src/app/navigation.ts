export interface NavItem {
  label: string;
  route: string;
  icon?: string;
}

export const NavigationItems: NavItem[] = [
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/home',
  },
];
