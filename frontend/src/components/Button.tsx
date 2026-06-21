// Componente de botão com variantes visuais
// "variant" define o estilo: primary (amarelo), danger (vermelho), secondary (cinza)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'secondary';
}

export default function Button({variant = 'primary', className = '', ...props}: ButtonProps) {
    const styles = {
        primary: 'bg-yellow text-navy-dark hover:brightness-95',
        danger: 'bg-red text-navy-dark hover:brightness-95',
        secondary: 'bg-light-gray text-navy-dark hover:bg-blue-gray/30',
    };

    return (
        <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50
  ${styles[variant]} ${className}`}
            {...props}
        />
    );
}