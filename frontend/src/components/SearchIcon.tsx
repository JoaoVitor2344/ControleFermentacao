import searchIcon from '../../../Figma/lupa_preta_fundo_transp.png';

export default function SearchIcon({className = 'w-4 h-4'}: { className?: string }) {
    return <img src={searchIcon} alt="" aria-hidden="true" className={`${className} brightness-0 invert`}/>;
}
