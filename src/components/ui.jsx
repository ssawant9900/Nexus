import { forwardRef } from 'react';

export const Card = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-50 ${className}`} {...props} />
));
Card.displayName = "Card";

export const CardHeader = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef(({ className = "", ...props }, ref) => (
  <h3 ref={ref} className={`font-semibold leading-none tracking-tight ${className}`} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

export const Badge = forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
    destructive: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
    outline: "text-slate-950 dark:text-slate-50 border border-slate-200 dark:border-slate-800",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-400",
  };
  return <div ref={ref} className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`} {...props} />;
});
Badge.displayName = "Badge";

export const Button = forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm dark:bg-cyan-600 dark:hover:bg-cyan-500",
    secondary: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    destructive: "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9",
  };
  return <button ref={ref} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300 ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
});
Button.displayName = "Button";

export const Skeleton = ({ className = "", ...props }) => (
  <div className={`animate-pulse rounded-md bg-slate-100 dark:bg-slate-800 ${className}`} {...props} />
);