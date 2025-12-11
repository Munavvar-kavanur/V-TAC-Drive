import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                    // Variants
                    {
                        'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/25 border border-transparent': variant === 'primary',
                        'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700': variant === 'secondary',
                        'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white': variant === 'ghost',
                        'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20': variant === 'danger',
                        'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300': variant === 'outline',
                    },
                    // Sizes
                    {
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6 text-lg': size === 'lg',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
