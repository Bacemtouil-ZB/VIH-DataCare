import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import spacing from '../../../constants/spacing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: spacing.fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: spacing.fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },

  // List
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardDate: {
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardTime: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardType: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cardArrow: {
    opacity: 0.4,
  },

  // Badge
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.full,
  },
  badgeText: {
    fontSize: spacing.fontSize.xs,
    fontWeight: '700',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: spacing.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  errorText: {
    fontSize: spacing.fontSize.md,
    color: colors.danger,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
  },

  // Detail screen
  detailContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailHeader: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontSize: spacing.fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  detailContent: {
    padding: spacing.lg,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    width: 90,
  },
  detailValue: {
    fontSize: spacing.fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  commentaireBox: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  commentaireTitle: {
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  commentaireText: {
    fontSize: spacing.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default styles;