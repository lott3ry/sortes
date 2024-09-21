import ReactEcharts from 'echarts-for-react';
import SwitchBtn from './SwitchBtn';
import Increment from './Increment';
import React, { useCallback, useEffect, useState } from 'react';
import { getPoolSize, getXbitPrice } from '../../../services/api/xbit';
import Loading from '../../../assets/animations/loading.json';
import Lottie from 'lottie-react';
import { useAtomValue } from 'jotai';
import { chainAtom } from '../../../atoms/chain';
import { currentChainInfo, getJkpt } from '../../../utils/env';
import JkptIcon from '../../../components/jkpt/Icon';
import Tooltip from '../../../components/Tooltip.tsx';
import { Popup } from '../../../components/Modal/Popup.tsx';

const defaultPriceChartOption: any = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(170, 170, 170, 0.5)',
    borderWidth: 1,
    borderRadius: 8,
    padding: [12, 16],
    textStyle: {
      color: '#333',
      fontSize: 14,
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#fff',
        type: 'dashed',
        width: 2,
        dashOffset: 0,
        dashArray: [0.5, 6],
      },
    },
    formatter: function (params: any[]) {
      const date = new Date(params[0].axisValue);
      const value = params[0].value;

      return `
           <div style="padding: 4px; font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, -apple-system, sans-serif;">
            <style>
              @media (max-width: 640px) {
                .tooltip-content {
                  font-size: 12px !important;
                }
              }
            </style>
            <div class="tooltip-content" style="font-size: 14px;">
              <div>${date.toISOString().slice(0, 19).replace('T', '&nbsp;'.repeat(6))}</div>
              <div style="margin-top: 20px; display: flex; align-items: center;">
                <span style="
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background-color: #FF884D;
                  margin-right: 6px;
                "></span>
                <span style="color: #828898; margin-right: 10px;">Vol</span>
                <span>${typeof value[1] === 'number' ? value[1].toFixed(8) : value[1]}</span>
              </div>
            </div>
          </div>
        `;
    },
  },
  grid: {
    width: 720,
    height: 272,
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  },
  xAxis: {
    type: 'time',
    max: function (value: { max: number }) {
      return value.max + (3600000 - (value.max % 3600000));
    },
    axisLine: {
      lineStyle: {
        color: '#FFFFFF',
      },
    },
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  series: [
    {
      data: null,
      type: 'line',
      symbol: 'circle',
      showSymbol: false, // 正常状态下不显示圆点
      symbolSize: 8,
      itemStyle: {
        color: () => {
          return '#FF884D';
        },
      },
      lineStyle: {
        color: '#fff', // 线条的默认颜色
        width: 2,
      },
    },
  ],
};

const defaultCirculationChartOption: any = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255)',
    borderColor: 'rgba(170, 170, 170, 0.5)',
    borderWidth: 1,
    borderRadius: 8,
    padding: [12, 16],
    textStyle: {
      color: '#333',
      fontSize: 14,
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#fff',
        type: 'dashed',
        width: 2,
        dashOffset: 0,
        dashArray: [0.5, 6],
      },
    },
    formatter: function (params: any[]) {
      const date = new Date(params[0].axisValue);
      const value = params[0].value;

      return `
           <div style="padding: 4px; font-family: 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, -apple-system, sans-serif;">
            <style>
              @media (max-width: 640px) {
                .tooltip-content {
                  font-size: 12px !important;
                }
              }
            </style>
            <div class="tooltip-content" style="font-size: 14px;">
              <div>${date.toISOString().slice(0, 19).replace('T', '&nbsp;'.repeat(6))}</div>
              <div style="margin-top: 20px; display: flex; align-items: center;">
                <span style="
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background-color: #FF884D;
                  margin-right: 6px;
                "></span>
                <span style="color: #828898; margin-right: 10px;">Vol</span>
                <span>${typeof value[1] === 'number' ? value[1].toFixed(8) : value[1]}</span>
              </div>
            </div>
          </div>
        `;
    },
  },
  grid: {
    width: 720,
    height: 272,
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  },
  xAxis: {
    type: 'time',
    max: function (value: { max: number }) {
      return value.max + (3600000 - (value.max % 3600000));
    },
    axisLine: {
      lineStyle: {
        color: '#FFFFFF',
      },
    },
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  series: [
    {
      data: null,
      type: 'line',
      symbol: 'circle',
      showSymbol: false, // 正常状态下不显示圆点
      symbolSize: 8,
      itemStyle: {
        color: () => {
          return '#FF884D';
        },
      },
      lineStyle: {
        color: '#fff', // 线条的默认颜色
        width: 2,
      },
    },
  ],
};

const PrizePoolChart: React.FC = () => {
  const [xbitPoolJkpt, setXbitPoolJkpt] = useState<string>('--');
  const [xbitPrice, setXbitPrice] = useState<string>('--');

  const [showLeftChart, setShowLeftChart] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceChartOption, setPriceChartOption] = useState<any>(
    defaultPriceChartOption
  );
  const [circulationChartOption, setCirculationChartOption] = useState<any>(
    defaultCirculationChartOption
  );
  const [circulationIncrement, setCirculationIncrement] = useState<number>(0);
  const [priceIncrement, setPriceIncrement] = useState<number>(0);
  const [hisoryPrice, setHisoryPrice] = useState<
    { day: string; value: number }[]
  >([]);

  const chainId = useAtomValue(chainAtom);
  const xTokenName = currentChainInfo().xTokenName;

  const handleSwitch = useCallback((newIdx: number) => {
    if (newIdx === 0) {
      setShowLeftChart(true);
    } else {
      setShowLeftChart(false);
    }
  }, []);

  const loadChartData = useCallback(async () => {
    const priceData = await getXbitPrice(/*Date.now() - 30 * 86400000*/);
    const pLength = priceData.length;
    const priceDataFormatted = priceData.map((item) => [
      new Date(item.time),
      item.price,
    ]);
    const circulationData = await getPoolSize(/*Date.now() - 30 * 86400000*/);
    // ------------------------
    const currentTime = Date.now();
    const latestData = circulationData[circulationData.length - 1];

    // 辅助函数：找到最接近给定时间的数据点
    const findClosestData = (targetTime: number) => {
      return circulationData.reduce((prev, curr) =>
        Math.abs(curr.time - targetTime) < Math.abs(prev.time - targetTime)
          ? curr
          : prev
      );
    };

    // 计算变化率
    const calculateChangeRate = (oldValue: number, newValue: number) => {
      return ((newValue - oldValue) / oldValue) * 100;
    };

    // 计算1天、1周、1月的变化率
    const oneDayAgo = findClosestData(currentTime - 24 * 60 * 60 * 1000);
    const oneWeekAgo = findClosestData(currentTime - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = findClosestData(currentTime - 30 * 24 * 60 * 60 * 1000);

    const oneDayChangeRate = calculateChangeRate(
      oneDayAgo.poolSize,
      latestData.poolSize
    );
    const oneWeekChangeRate = calculateChangeRate(
      oneWeekAgo.poolSize,
      latestData.poolSize
    );
    const oneMonthChangeRate = calculateChangeRate(
      oneMonthAgo.poolSize,
      latestData.poolSize
    );

    setHisoryPrice([
      { day: 'D', value: oneDayChangeRate },
      { day: 'W', value: oneWeekChangeRate },
      { day: 'M', value: oneMonthChangeRate },
    ]);

    // ---------------------
    const cLength = circulationData.length;
    const circulationDataFormatted = circulationData.map((item) => [
      new Date(item.time),
      item.poolSize,
    ]);

    const ps1 =
      cLength > 23
        ? circulationData[cLength - 24].poolSize
        : circulationData[0].poolSize;
    const ps2 = circulationData[cLength - 1].poolSize;

    setCirculationIncrement(((ps2 - ps1) / ps1) * 100);
    setXbitPoolJkpt(circulationData[cLength - 1].poolSize.toFixed(4));

    const pr1 =
      pLength > 23 ? priceData[pLength - 24].price : priceData[0].price;
    const pr2 = priceData[pLength - 1].price;
    setPriceIncrement(((pr2 - pr1) / pr1) * 100);
    setXbitPrice(priceData[pLength - 1].price.toFixed(8));

    setCirculationChartOption({
      ...defaultCirculationChartOption,
      series: [
        {
          ...defaultCirculationChartOption.series[0],
          data: circulationDataFormatted,
        },
      ],
    });
    setPriceChartOption({
      ...defaultPriceChartOption,
      series: [
        {
          ...defaultPriceChartOption.series[0],
          data: priceDataFormatted,
        },
      ],
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChartData();
  }, [loadChartData, chainId]);

  const jkpt = getJkpt().toUpperCase();
  const chartTitle = showLeftChart ? `Pool(${jkpt})` : `${xTokenName} Price`;

  const chartValue = showLeftChart ? xbitPoolJkpt : xbitPrice;

  const [showHistoryPrice, setShowHistoryPrice] = useState(false);
  const xtoken = currentChainInfo().xTokenName;
  return (
    <div className="mr-[76px] w-[720px] max-sm:mr-0 max-sm:w-full max-sm:pb-10">
      <div className="text-white">
        <div className="item-center flex text-xl max-sm:mb-[30px] max-sm:mt-10 max-sm:text-lg">
          <div className="-mt-[2px] max-sm:-mt-1 max-sm:size-5">
            <JkptIcon />
          </div>

          <h1 className="relative ml-2 text-dark2 max-sm:text-base">
            {chartTitle}
            <div className="absolute -right-4 -top-3 size-[14px] max-sm:-right-3 max-sm:-top-2 max-sm:size-[10px]">
              <Tooltip type="info">
                <span className="absolute bottom-[20px] left-2 z-40 w-[400px] rounded bg-[#F8F8F8] p-[10px] text-xs max-sm:w-[200px] max-sm:text-[8px]">
                  {xTokenName} is minted by depositing wBTC into the Lott3ry
                  smart contract, with no other issuance methods. The value of{' '}
                  {xTokenName} is inherently linked to the size of the BTC pool
                  on Lott3ry, dynamically fluctuating with users' lottery draws.{' '}
                  {xTokenName} serves as a record-keeping certificate for
                  depositing and withdrawing BTC from the prize pool.
                </span>
              </Tooltip>
            </div>
          </h1>

          <div
            className="cursor-pointer"
            onClick={() => setShowHistoryPrice(true)}
          >
            <Increment
              value={showLeftChart ? circulationIncrement : priceIncrement}
            ></Increment>
          </div>

          <Popup visible={showHistoryPrice} setVisible={() => null}>
            <div className="relative flex max-h-[684px] w-[358px] flex-col overflow-y-auto rounded-2xl bg-white px-1 py-10 text-left">
              <span
                onClick={() => setShowHistoryPrice(false)}
                className="absolute right-2.5 top-2.5 cursor-pointer"
              >
                <i className="iconfont icon-close-outlined text-2xl text-black" />
              </span>
              <div className="flex flex-col text-xl text-black">
                <h1 className="mx-auto my-[10px] mb-[30px]">
                  Price Change Rate of {xtoken}
                </h1>

                <div className="mx-auto flex flex-col space-y-5">
                  {hisoryPrice.map((item) => {
                    return (
                      <div
                        key={item.day}
                        className="flex text-base font-normal"
                      >
                        <section
                          className={`flex w-[107px] justify-between text-base font-normal ${item}`}
                        >
                          <span className="">1{item.day}:</span>
                          <span
                            className={
                              item.value > 0
                                ? 'text-[#00D1B5]'
                                : item.value < 0
                                  ? 'text-[#FF925C]'
                                  : 'text-[#3F3535]'
                            }
                          >
                            {(item.value > 0
                              ? '+'
                              : item.value < 0
                                ? '-'
                                : '') +
                              item.value.toFixed(2) +
                              '%'}
                          </span>
                        </section>
                        {item.value < 0 && (
                          <span
                            style={{ transform: 'scaleY(-1)' }}
                            className="iconfont icon-arrow-top-right ml-[10px] inline-block pt-[0.5px] text-[13px] text-[#FF925C]"
                          ></span>
                        )}
                        {item.value === 0 && (
                          <span className="iconfont icon-a-Line1Stroke ml-[10px] inline-block pt-[0.5px] text-[2.4px] text-[#3F3535]"></span>
                        )}
                        {item.value > 0 && (
                          <span className="iconfont icon-arrow-top-right ml-[10px] inline-block pt-[0.5px] text-[13px] text-[#00D1B5]"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Popup>

          <h1 className="relative ml-[10px] font-bold text-[#CCD0D9] max-sm:text-base">
            Today
            <div className="absolute -right-3 -top-3 size-[14px] max-sm:-right-3 max-sm:-top-2 max-sm:size-[10px]">
              <Tooltip type="info">
                <span className="absolute bottom-[20px] left-2 z-40 w-[220px] rounded bg-[#F8F8F8] p-[10px] text-xs leading-normal max-sm:-left-[11rem] max-sm:w-[180px] max-sm:text-[8px]">
                  Price momentum compared to yesterday.
                  <h1 className="mt-1">24h change starts at 00:00 UTC</h1>
                </span>
              </Tooltip>
            </div>
          </h1>
        </div>
        <div className="mt-[30px] flex items-center">
          <span className="flex-1 text-[36px] max-sm:text-4xl">
            {isNaN(Number(chartValue))
              ? chartValue
              : Number(chartValue).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-end">
          <SwitchBtn
            labels={['Circulation', 'Price']}
            initIdx={0}
            onSwitch={handleSwitch}
          ></SwitchBtn>
        </div>
      </div>
      <div id="chart-container" className="relative mt-[30px]">
        {loading && (
          <Lottie
            animationData={Loading}
            className="absolute left-1/2 top-1/2 ml-[-80px] mt-[-80px] h-[160px] w-[160px] rounded-[8px] bg-transparent"
          />
        )}
        {showLeftChart && (
          <div id="chart-circulation" className="h-[300px]">
            <ReactEcharts option={circulationChartOption} />
          </div>
        )}
        {!showLeftChart && (
          <div id="chart-price" className="h-[300px]">
            <ReactEcharts option={priceChartOption} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizePoolChart;
