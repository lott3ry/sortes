import { Link } from 'react-router-dom';
import Links from '../../utils/links';

export const MediaLink: React.FC<{
  iconClz: string;
  href: string;
}> = ({ href, iconClz }) => {
  const judgeColor = () => {
    if (href.includes('t.me')) return ' hover:text-[#26a5e5]';
    else if (href.includes('discord.com')) return ' hover:text-[#5865F2] ';
    return ' hover:text-black ';
  };

  return (
    <Link to={href} target="_blank" rel="noreferrer">
      <span
        className={
          'iconfont flex size-12 cursor-pointer items-center justify-center rounded-full border border-white text-white hover:bg-white max-sm:size-6 max-sm:border-white ' +
          iconClz +
          judgeColor()
        }
      ></span>
    </Link>
  );
};

interface FooterProps {
  bgClz?: string;
}

const Footer: React.FC<FooterProps> = ({ bgClz = 'bg-mainV1' }) => {
  return (
    <footer
      className={
        'm-auto w-full pb-14 pt-14 text-center max-sm:py-[30px] ' + bgClz
      }
    >
      <p className="text-xl font-bold text-white max-sm:text-xs">
        Join in Community
      </p>
      <p className="my-5 flex justify-center space-x-5 text-white">
        <MediaLink
          iconClz="icon-Twitter-logo text-2xl max-sm:text-black max-sm:text-[12px] max-sm:bg-white   "
          href={Links.Twitter}
        />
        <MediaLink
          iconClz="icon-TG_default text-5xl max-sm:text-[24px] max-sm:text-[#26a5e5] max-sm:bg-white "
          href={Links.Telegram}
        />
        <MediaLink
          href={Links.Discord}
          iconClz="icon-Discord_default text-5xl max-sm:text-[24px] max-sm:text-[#5865F2] max-sm:bg-white "
        />
        <MediaLink
          href={Links.Medium}
          iconClz="icon-Medium-logo text-lg max-sm:text-[10px] max-sm:text-black max-sm:bg-white "
        />
      </p>
      <p className="text-white max-sm:text-[8px]">
        ©&nbsp;2024&nbsp;Externality Labs
      </p>
    </footer>
  );
};

export default Footer;
