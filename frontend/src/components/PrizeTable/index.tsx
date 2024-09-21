import { HTMLAttributes, useMemo, useState } from 'react';
import PrizeItem from './PrizeItem';
import { PrizeTableItem } from './type';
import { useJkptPrice } from '../../hooks/pool';

interface PrizeTableProps {
  items: PrizeTableItem[];
  isDistributor?: boolean;
}

enum SortType {
  Asc = 'asc',
  Desc = 'desc',
  Default = 'default',
}

const ArrowIcon: React.FC<
  { enable: boolean } & HTMLAttributes<HTMLSpanElement>
> = ({ enable, className }) => {
  return (
    <span className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
      >
        {enable ? (
          <path
            d="M13.2104 10.222L8.15953 4.36524C8.01496 4.19759 7.73658 4.19759 7.59047 4.36524L2.5396 10.222C2.35196 10.4404 2.52114 10.7603 2.82413 10.7603H12.9259C13.2289 10.7603 13.398 10.4404 13.2104 10.222Z"
            fill="#1890FF"
          />
        ) : (
          <path
            d="M13.2104 10.222L8.15953 4.36524C8.01496 4.19759 7.73658 4.19759 7.59047 4.36524L2.5396 10.222C2.35196 10.4404 2.52114 10.7603 2.82413 10.7603H12.9259C13.2289 10.7603 13.398 10.4404 13.2104 10.222Z"
            fill="black"
            fillOpacity="0.25"
          />
        )}
      </svg>
    </span>
  );
};

const PrizeTable: React.FC<PrizeTableProps> = ({
  items,
  isDistributor = false,
}) => {
  const [sortType, setSortType] = useState(SortType.Default);
  const jkptPrice = useJkptPrice();

  const handleSort = () => {
    if (sortType === SortType.Default) setSortType(SortType.Asc);
    else if (sortType === SortType.Asc) setSortType(SortType.Desc);
    else setSortType(SortType.Asc);
  };

  const itemsWithExp = useMemo(() => {
    const expPosibility =
      1 - items.reduce((acc, item) => acc + item.possibility, 0);
    const data = [
      ...items,
      {
        prize: 100,
        possibility: expPosibility,
        isExp: true,
      },
    ];

    // Compare logic, EXP is always smaller than others, then sort by USD value
    const compare = (a: PrizeTableItem, b: PrizeTableItem) => {
      if (a.isExp) return -1;
      if (b.isExp) return 1;
      const getUsdValue = (item: PrizeTableItem) =>
        item.isFixedReward ? item.prize : item.prize * jkptPrice!;
      return getUsdValue(a) - getUsdValue(b);
    };

    if (sortType === SortType.Asc) data.sort(compare);
    else if (sortType === SortType.Desc) data.sort(compare).reverse();

    return data;
  }, [items, jkptPrice, sortType]);

  return (
    <div className="flex w-full flex-col text-left max-sm:pl-0">
      <div className="flex px-4 text-base text-dark3 sm:text-lg">
        <span className="flex flex-1 items-center">
          <span
            className={`mr-2.5 ${isDistributor ? 'font-bold text-[#666666]' : ''}`}
          >
            Prize Amount
          </span>
          <span
            className="mr-1.5 flex cursor-pointer flex-col items-center sm:mr-3.5"
            onClick={handleSort}
          >
            <ArrowIcon
              enable={sortType === SortType.Asc}
              className="-mb-1.5 mr-[1px]"
            />
            <ArrowIcon
              enable={sortType === SortType.Desc}
              className="origin-center rotate-180"
            />
          </span>
          <span
            className="cursor-pointer"
            onClick={() => setSortType(SortType.Default)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
            >
              <path
                d="M13.8351 3.756L12.6831 5.172L18.6771 5.73L16.8831 0L15.4611 1.752C13.9071 0.612 12.0291 0 10.1031 0C5.1171 0 1.0791 4.032 1.0791 8.99999C1.0791 13.974 5.1231 18 10.1031 18C13.8411 18.006 17.1951 15.702 18.5391 12.21C18.6591 11.892 18.6531 11.538 18.5091 11.226C18.3711 10.914 18.1131 10.674 17.7951 10.548C17.1291 10.296 16.3851 10.626 16.1271 11.292C15.1671 13.788 12.7731 15.432 10.1031 15.426C6.5391 15.426 3.6531 12.546 3.6531 8.99399C3.6531 5.442 6.5391 2.568 10.1031 2.568C11.4651 2.574 12.7611 2.994 13.8351 3.756Z"
                fill="#1890FF"
              />
              <defs>
                <clipPath id="clip0_5188_9283">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(0.875)"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>
        </span>
        <span className={` ${isDistributor ? 'font-bold text-[#666666]' : ''}`}>
          Chance
        </span>
      </div>
      <ul className="relative flex flex-1 flex-col space-y-3 pt-4 text-base font-normal sm:text-lg">
        {itemsWithExp.map((item, idx) => (
          <PrizeItem key={idx} {...item} />
        ))}
      </ul>
    </div>
  );
};
export default PrizeTable;
