import { StyleSheet, Dimensions, Platform } from 'react-native';
import { TAB_CONFIG } from './tabBar.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BAR_WIDTH = SCREEN_WIDTH - 40;
export const HOLE_WIDTH = 100;
export const BAR_HEIGHT = 80;

export default StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    height: BAR_HEIGHT,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },

  svgWrapper: {
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 12,
  },

  buttonWrapper: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    width: BAR_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },

  label: {
    fontSize: 10,
    fontWeight: '400',
    color: TAB_CONFIG.INACTIVE_COLOR,
    marginTop: 2,
  },

  labelActive: {
    fontSize: 10,
    fontWeight: '600',
    color: TAB_CONFIG.ACTIVE_COLOR,
    marginTop: 2,
  },

  centerTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  centerButton: {
    top: -22,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: TAB_CONFIG.CENTER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: TAB_CONFIG.CENTER_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 14,
  },

  centerLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: TAB_CONFIG.ACTIVE_COLOR,
    marginTop: -16,
  },

  centerLabelInactive: {
    fontSize: 10,
    fontWeight: '400',
    color: TAB_CONFIG.INACTIVE_COLOR,
    marginTop: -16,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: TAB_CONFIG.ACTIVE_COLOR,
    marginTop: 2,
  },

  dotHidden: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'transparent',
    marginTop: 2,
  },
});