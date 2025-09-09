import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        // 基礎樣式 - 不會造成 hydration 問題
        'w-full bg-transparent outline-none',
        'min-h-16 text-base transition-[color,box-shadow]',
        // 互動狀態 - 可能需要客戶端渲染
        'border-input placeholder:text-muted-foreground',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // 主題相關 - 使用 suppressHydrationWarning 或客戶端渲染
        'dark:aria-invalid:ring-destructive/40 dark:bg-input/30',
        // 響應式 - 考慮使用 CSS 變數
        'md:text-sm',
        // 實驗性 CSS - 可能需要 feature detection
        'field-sizing-content shadow-xs',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea }
