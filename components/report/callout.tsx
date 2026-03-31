import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { CalloutProps } from "@/lib/report-types";
import { statusColors, accentBar, iconContainer, iconSize, textStyles, cn } from "@/lib/report-styles";

const typeConfig = {
  info: {
    icon: Info,
    colors: statusColors.neutral,
  },
  warning: {
    icon: AlertTriangle,
    colors: statusColors.warning,
  },
  success: {
    icon: CheckCircle,
    colors: statusColors.success,
  },
  danger: {
    icon: XCircle,
    colors: statusColors.danger,
  },
} as const;

export function Callout({ type, title, children }: CalloutProps) {
  const { icon: Icon, colors } = typeConfig[type];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-5 pl-6",
      colors.border,
      colors.bgLight
    )}>
      {/* Left accent bar */}
      <div className={cn(accentBar.left.thin, colors.accentBar)} />
      {title && (
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className={cn(iconContainer.small, colors.iconBg, "flex shrink-0 items-center justify-center")}>
            <Icon className={cn(iconSize.medium, colors.iconColor)} strokeWidth={2} />
          </div>
          <span className={cn(textStyles.componentTitle, colors.text)}>
            {title}
          </span>
        </div>
      )}
      <div className={textStyles.bodySecondary}>
        {children}
      </div>
    </div>
  );
}
