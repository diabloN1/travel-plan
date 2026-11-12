export interface NavItem {
  title: string;
  url: string;
  icon: string;
  exact?: boolean;
  badge?: string | number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}