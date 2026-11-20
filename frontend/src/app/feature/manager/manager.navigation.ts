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
        title: 'Travels',
        url: '/manager/travels',
        icon: 'lucideMap',
        exact: true,
      },
      {
        title: 'Departures',
        url: '/manager/departures',
        icon: 'lucideTicketsPlane',
        exact: true,
      },
      {
        title: 'Destinations',
        url: '/manager/destinations',
        icon: 'lucideMapPin',
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
