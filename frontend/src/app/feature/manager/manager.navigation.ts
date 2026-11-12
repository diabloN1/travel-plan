import { NavGroup } from '@/core/model/navigation-bar.model';

export const MANAGER_NAVIGATION: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      {
        title: 'Overview',
        url: '/manager/dashboard',
        icon: 'lucideHouse',
        exact: true,
      },
      {
        title: 'My Destinations',
        url: '/manager/destinations',
        icon: 'lucideMapPin',
        exact: true,
      },
      {
        title: 'Activities',
        url: '/manager/activities',
        icon: 'lucideCompass',
        exact: true,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'My Profile',
        url: '/manager/profile',
        icon: 'lucideUserRound',
        exact: true,
      },
    ],
  },
];