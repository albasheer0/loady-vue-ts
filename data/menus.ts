import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'General',
    items: [
      {
        title: 'Home',
        icon: 'i-lucide-home',
        link: '/',
      },
      {
        title: 'Tours',
        icon: 'i-lucide-map',
        link: '/tours',
      },
      {
        title: 'Drivers',
        icon: 'i-lucide-users',
        link: '/drivers',
      },
    ],
  }
]

export const navMenuBottom: NavMenuItems = []
