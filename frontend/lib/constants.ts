export const PRODUCT_NAME = "Vigil";
export const PRODUCT_TAGLINE = "Know when your AI changes.";

export const CATEGORY_LABELS: Record<string, string> = {
  hallucination: "Factual accuracy",
  format_adherence: "Following format instructions",
  instruction_following: "Following instructions",
  verbosity: "Response length consistency",
};

export const STATUS_CONFIG = {
  stable: {
    label: "All clear",
    sublabel: "Behaving as expected",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  watch: {
    label: "Changes detected",
    sublabel: "Some checks flagged",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  drift: {
    label: "Needs attention",
    sublabel: "Significant changes found",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    dot: "bg-red-400",
  },
};
