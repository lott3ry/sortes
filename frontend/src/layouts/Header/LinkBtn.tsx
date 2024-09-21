import { Link } from 'react-router-dom';

interface LinkBtnProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  href: string;
  isActive: boolean;
  theme?: 'website' | 'app';
  target?: string;
}

const LinkBtn: React.FC<LinkBtnProps> = ({ text, href, isActive, target }) => {
  const activeClz = isActive ? 'font-black text-xl' : 'text-lg ';

  return (
    <Link
      className={`jusfity-center group flex items-center rounded-md font-medium text-white hover:cursor-pointer ${activeClz}`}
      to={href}
      target={target}
    >
      <span className={`mx-auto py-3 font-roboto ${activeClz}`}>{text}</span>
    </Link>
  );
};

export default LinkBtn;
