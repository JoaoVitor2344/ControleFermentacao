// Componente de botão com variantes visuais
// "variant" define o estilo: primary (amarelo), danger (vermelho), secondary (cinza)
import {forwardRef} from 'react';
import type {ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'secondary' | 'search' | 'view' | 'edit' | 'sort' | 'outline' | 'outlineDanger';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({variant = 'primary', className = '', ...props}, ref) => {
    const styles = {
        primary: 'bg-yellow text-navy-dark hover:brightness-95',
        danger: 'bg-red text-navy-dark hover:brightness-95',
        secondary: 'bg-light-gray text-navy-dark hover:bg-blue-gray/30',
        search: 'bg-navy text-white hover:brightness-110',
        view: 'bg-green text-navy-dark hover:brightness-95',
        edit: 'bg-blue-gray text-navy-dark hover:brightness-95',
        sort: 'bg-blue-gray text-navy-dark hover:brightness-95',
        outline: 'border border-blue-gray bg-transparent text-navy-dark hover:bg-light-gray',
        outlineDanger: 'border border-red bg-transparent text-red hover:bg-red/10',
    };

    return (
        <button
            ref={ref}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50
  ${styles[variant]} ${className}`}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export default Button;
