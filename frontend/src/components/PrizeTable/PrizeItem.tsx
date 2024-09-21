import { Link } from 'react-router-dom';
import { getJkpt } from '../../utils/env';
import Tooltip from '../Tooltip';
import { PrizeTableItem } from './type';

const getPrize = (prize: number, isExp: boolean, isFixedReward: boolean) => {
  if (isExp) return `${prize} EXP`;
  else if (isFixedReward) return `$${prize}`;
  else return `${prize.toFixed(6)} ${getJkpt().toUpperCase()}`;
};

const PrizeItem: React.FC<PrizeTableItem> = ({
  prize,
  possibility,
  isFixedReward = true,
  isExp = false,
}) => {
  return (
    <li className="relative flex rounded-xl px-4 py-3 hover:cursor-pointer hover:bg-dark0">
      <span className="flex-1">{getPrize(prize, isExp, isFixedReward)}</span>
      {isExp && (
        <span className="absolute left-20 top-0 h-4 w-4">
          <Tooltip type="info">
            <span className="absolute -left-6 -top-16 w-56 rounded-lg bg-dark0 px-3 py-2 sm:-top-16 sm:left-4">
              EXP is the reward points you earn with every lottery.{' '}
              <Link to="/exp" target="_blank" className="text-link underline">
                Explore its various utility scenarios.
              </Link>
            </span>
          </Tooltip>
        </span>
      )}
      <span>
        {isExp ? '≈ ' : ''}
        {(possibility * 100).toFixed(4) + '%'}
      </span>
    </li>
  );
};

export default PrizeItem;
