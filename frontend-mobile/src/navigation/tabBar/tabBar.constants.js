import colors from '../../constants/colors';

export const TAB_CONFIG = {
  BAR_COLOR: '#FFFFFF',
  ACTIVE_COLOR: colors.primary,
  INACTIVE_COLOR: '#B0B0B0',
  CENTER_COLOR: colors.primary,
};

export const TAB_ROUTES = [
  {
    name: 'Rendezvous',
    iconActive: 'calendar',
    iconInactive: 'calendar-outline',
    label: 'Rendez-vous',
  },
  {
    name: 'Home',
    iconActive: 'home',
    iconInactive: 'home-outline',
    label: 'Accueil',
    isCenter: true,
  },
  {
    name: 'Reminders',
    iconActive: 'alarm',
    iconInactive: 'alarm-outline',
    label: 'Rappels',
  },
];