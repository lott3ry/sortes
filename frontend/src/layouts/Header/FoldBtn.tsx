import { Link, useLocation } from 'react-router-dom';

import arrow_down_img from '../../assets/images/dropdown/arrow-down.svg';
import { useWallets } from '@web3-onboard/react';

const NavbarDropdownBox = (props: { title: string; dropdown: JSX.Element }) => (
  <div className="group relative flex select-none items-center gap-[10px] text-center font-[Roboto] text-[18px] font-medium not-italic leading-[normal]">
    <span
      className="flex cursor-pointer items-center justify-end gap-[10px] px-0.5 py-2.5 text-lg"
      onClick={() => {}}
    >
      <span className="mx-auto py-3 text-white">{props.title}</span>
      <img src={arrow_down_img} alt="arrow" />
    </span>
    <div className="absolute left-0 top-16 hidden h-auto flex-col items-start whitespace-nowrap rounded-2xl bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] group-hover:inline-flex">
      {props.dropdown}
    </div>
  </div>
);

const NavbarDropdownList = (props: {
  title: string;
  dropdownList: { subTitle: string; url: string }[];
}) => {
  const { pathname } = useLocation();
  const [wallet] = useWallets();

  const getLinkClassName = (url: string, subTitle: string) => {
    const isActive = pathname.toLowerCase().includes(url.toLowerCase());
    const isCharityFundActive =
      subTitle === 'Charity Fund' &&
      wallet &&
      pathname.toLowerCase().includes('/charity');

    return `
      text-[#3F3535]
      hover:text-mainV1
      ${isActive ? 'text-mainV1' : ''}
      ${isCharityFundActive ? 'text-mainV1' : ''}
    `.trim();
  };

  const listEle = (
    <div className="space-y-2">
      {props.dropdownList.map(({ subTitle, url }, index) => (
        <span
          key={index}
          className="block w-full cursor-pointer p-1 text-left font-medium"
        >
          <Link to={url} className={getLinkClassName(url, subTitle)}>
            {subTitle}
          </Link>
        </span>
      ))}
    </div>
  );

  return <NavbarDropdownBox title={props.title} dropdown={listEle} />;
};

const NavbarDropdownAsset = () => (
  <NavbarDropdownList
    title="Asset"
    dropdownList={[
      { subTitle: 'Asset', url: '/asset' },
      { subTitle: 'Charity Fund', url: '/charity' },
    ]}
  />
);

const NavBarDropdownDistributor = () => (
  <NavbarDropdownList
    title="Distributor"
    dropdownList={[
      { subTitle: 'Create Distributor Pool', url: '/create-distributor-pool' },
      { subTitle: 'Distributor Profit', url: '/distributor-profit' },
    ]}
  />
);

export {
  NavbarDropdownAsset as HeaderDropdownAsset,
  NavBarDropdownDistributor as HeaderDropdownDistributor,
};
