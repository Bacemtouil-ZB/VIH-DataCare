import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import spacing from '../../../constants/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: spacing.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  patientName: {
    fontSize: spacing.fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numeroText: {
    fontSize: spacing.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },

  // Actions row — 2 boutons
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  actionButtonDashboard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonUrgence: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIconUrgence: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionButtonText: {
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionButtonSub: {
    fontSize: spacing.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButtonTextUrgence: {
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
    color: colors.white,
  },
  actionButtonSubUrgence: {
    fontSize: spacing.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // Section
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: spacing.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Next appointment banner
  bannerContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerEmpty: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerEmptyText: {
    fontSize: spacing.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  bannerDate: {
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bannerTime: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bannerDoctor: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bannerCountdown: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  bannerCountdownText: {
    fontSize: spacing.fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
  },

  // Today reminders
  reminderCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reminderTitle: {
    fontSize: spacing.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reminderTime: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyReminders: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyRemindersText: {
    fontSize: spacing.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

export default styles;