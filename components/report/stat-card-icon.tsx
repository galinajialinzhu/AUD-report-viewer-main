"use client";

import { useState } from "react";
import { resolveIcon } from "@/lib/icon-map";

/**
 * StatCard 用图标：优先从 public/icons/{name}.svg 加载，没有则用 icon-map 的 Lucide 图标。
 * 这样 home / train / circle-dollar-sign / clock 等既可上传到 public/icons/ 自定义，也可用内置映射。
 */
export function StatCardIcon({
  name,
  imgClassName,
  strokeWidth = 2,
}: {
  name: string;
  imgClassName?: string;
  strokeWidth?: number;
}) {
  const [useLucide, setUseLucide] = useState(false);
  const LucideIcon = resolveIcon(name);

  if (useLucide && LucideIcon) {
    return (
      <LucideIcon
        className={imgClassName ?? "h-5 w-5 text-[var(--color-icon-stroke)]"}
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <img
      src={`/icons/${name}.svg`}
      alt=""
      className={imgClassName ?? "h-5 w-5 object-contain"}
      onError={() => setUseLucide(true)}
    />
  );
}
