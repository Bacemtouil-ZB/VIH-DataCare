import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import spacing from "../../../constants/spacing";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  topSection: {
    flex: 0.42,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xl,
  },

  bottomSection: {
    flex: 0.58,
    backgroundColor: colors.background,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  logoWrapper: {
    alignItems: "center",
    gap: spacing.md,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },

  logoInnerCircle: {
    width: 70,
    height: 70,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  appName: {
    fontSize: spacing.fontSize.xl,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },

  appTagline: {
    fontSize: spacing.fontSize.sm,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.3,
  },

  languageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  languageLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: spacing.fontSize.sm,
    fontWeight: "600",
  },

  languageOptions: {
    flexDirection: "row",
    gap: spacing.xs,
  },

  languageOption: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  languageOptionActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },

  languageOptionText: {
    color: colors.white,
    fontSize: spacing.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  languageOptionTextActive: {
    color: colors.primary,
  },

  formHeader: {
    marginBottom: spacing.lg,
  },

  formTitle: {
    fontSize: spacing.fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  formSubtitle: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
  },

  form: {
    gap: spacing.md,
  },

  inputWrapper: {
    gap: spacing.xs,
  },

  label: {
    fontSize: spacing.fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },

  inputIcon: {
    marginRight: spacing.sm,
  },

  inputIconRtl: {
    marginRight: 0,
    marginLeft: spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: spacing.fontSize.md,
    color: colors.textPrimary,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  errorText: {
    fontSize: spacing.fontSize.sm,
    color: colors.danger,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.white,
    fontSize: spacing.fontSize.md,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  forgotContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  forgotText: {
    fontSize: spacing.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  forgotHighlight: {
    color: colors.primary,
    fontWeight: "600",
  },

  rtlRow: {
    flexDirection: "row-reverse",
  },

  textAlignRight: {
    textAlign: "right",
  },
});

export default styles;
