import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { TAB_ROUTES, TAB_CONFIG } from './tabBar.constants';
import styles, { BAR_WIDTH, HOLE_WIDTH, BAR_HEIGHT } from './tabBar.styles';
import useI18n from '../../i18n/useI18n';
import { useNavigationState } from '@react-navigation/native';

const TAB_LABEL_KEYS = {
  Rendezvous: 'tabs.rendezvous',
  Home: 'tabs.home',
  Reminders: 'tabs.reminders',
};

const getSvgPath = () => {
  const w = BAR_WIDTH;
  const h = BAR_HEIGHT;
  const holeW = HOLE_WIDTH;
  const r = 24;
  const curveDepth = 42;

  return `
    M0,${r}
    C0,${r / 2} ${r / 2},0 ${r},0
    H${(w - holeW) / 2}
    C${w / 2 - 38},0 ${w / 2 - 42},${curveDepth} ${w / 2},${curveDepth}
    C${w / 2 + 42},${curveDepth} ${w / 2 + 38},0 ${(w + holeW) / 2},0
    H${w - r}
    C${w - r / 2},0 ${w},${r / 2} ${w},${r}
    V${h - r}
    C${w},${h - r / 2} ${w - r / 2},${h} ${w - r},${h}
    H${r}
    C${r / 2},${h} 0,${h - r / 2} 0,${h - r}
    Z
  `;
};

export default function CustomTabBar({ state, navigation }) {
  const { t } = useI18n();
 const activeRouteName = useNavigationState(s => s.routes[s.index]?.state?.routes?.at(-1)?.name);
if (['RendezvousDetail', 'CreateReminder'].includes(activeRouteName)) return null;
  return (
    <View style={styles.tabContainer}>

      {/* SVG Background */}
      <View style={styles.svgWrapper}>
        <Svg width={BAR_WIDTH} height={BAR_HEIGHT}>
          <Path d={getSvgPath()} fill={TAB_CONFIG.BAR_COLOR} />
        </Svg>
      </View>

      {/* Tab Buttons */}
      <View style={styles.buttonWrapper}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_ROUTES.find(t => t.name === route.name);
          if (!tabConfig) return null;
          const tabLabel = t(TAB_LABEL_KEYS[route.name] || route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center button
          if (tabConfig.isCenter) {
            return (
              <View key={route.key} style={styles.centerTabItem}>
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={styles.centerButton}
                >
                  <Ionicons
                    name={tabConfig.iconActive}
                    size={28}
                    color="#fff"
                  />
                </TouchableOpacity>
                <Text style={isFocused
                  ? styles.centerLabel
                  : styles.centerLabelInactive
                }>
                  {tabLabel}
                </Text>
              </View>
            );
          }

          // Side buttons
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? tabConfig.iconActive : tabConfig.iconInactive}
                size={24}
                color={isFocused ? TAB_CONFIG.ACTIVE_COLOR : TAB_CONFIG.INACTIVE_COLOR}
              />
              <Text style={isFocused ? styles.labelActive : styles.label}>
                {tabLabel}
              </Text>
              <View style={isFocused ? styles.dot : styles.dotHidden} />
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}
