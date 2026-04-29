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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {},
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
  addButton: {
    width: 42,
    height: 42,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardInactive: {
    opacity: 0.5,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: spacing.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardTime: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRepeat: {
    fontSize: spacing.fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty
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
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: spacing.fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },

  // Create screen
  createContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  createHeader: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  createBackButton: {
    width: 36,
    height: 36,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createHeaderTitle: {
    fontSize: spacing.fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
  },
  createContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },

  // Form sections
  formSection: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  formSectionTitle: {
    fontSize: spacing.fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  formLabel: {
    fontSize: spacing.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  formInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: spacing.fontSize.md,
    color: colors.textPrimary,
  },

  // Type selector
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeOptionText: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Repeat selector
  repeatOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  repeatOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  repeatOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  repeatOptionText: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  repeatOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Discrete mode
  discreteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discreteInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  discreteTitle: {
    fontSize: spacing.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  discreteSubtitle: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Save button
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: spacing.fontSize.md,
    fontWeight: '700',
  },

  // Time picker
  timePicker: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerText: {
    fontSize: spacing.fontSize.md,
    color: colors.textPrimary,
  },
});

export default styles;