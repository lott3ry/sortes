import React from 'react';
import { currentChainInfo, RandomnessSource } from '../../utils/env';
import ChainLink from '../../assets/icons/chainlink.png';
import Arpa from '../../assets/icons/arpa.png';

type RandomnessIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const RandomnessIcon: React.FC<RandomnessIconProps> = (props) => {
  const randomness = currentChainInfo().randomness;
  const iconSrc = randomness === RandomnessSource.Chainlink ? ChainLink : Arpa;
  const altText =
    randomness === RandomnessSource.Chainlink ? 'ChainLink' : 'Arpa';

  return (
    <img
      src={iconSrc as string}
      alt={altText}
      className={`h-auto w-20 sm:w-[103px] ${props.className || ''}`}
      {...props}
    />
  );
};
