import { useCallback, useEffect, useState } from 'react';
import { useRef } from 'react';
import IconXbit from '../../../assets/icons/icon-XBit.png';
import { Web3Service } from '../../../services/web3';
import { useJkptBalance, useXbitBalance } from '../../../hooks/balance';
import { useXbitPrice } from '../../../hooks/pool';
import { Link, useSearchParams } from 'react-router-dom';
import { showError, showSucc } from '../../../utils/notify';
import Spin from '../../../components/Spin';
import { currentChainInfo, getJkpt } from '../../../utils/env';
import JkptIcon from '../../../components/jkpt/Icon';
import MinerLeftImage from '../.././../assets/images/miner/miner-left.svg';
import MinerRightImage from '../.././../assets/images/miner/miner-right.svg';
import { formatTokenAmount } from '../../../utils/format';

const IconJkptComp = () => (
  <span
    className="flex w-[119px] items-center space-x-1 rounded-full p-[6px] px-4 font-normal max-sm:w-[76px] max-sm:px-2"
    style={{ background: 'rgba(255, 164, 27, 0.50)' }}
  >
    <div className="size-8 max-sm:size-5">
      <JkptIcon />
    </div>

    <span className="text-center max-sm:text-xs">
      {getJkpt().toUpperCase()}
    </span>
  </span>
);

const IconXbitComp = () => (
  <span className="ml-auto flex items-center space-x-1 text-nowrap rounded-full bg-[#D5F3EA] p-[6px] px-4 font-normal">
    <img className="size-8 max-sm:size-5" src={IconXbit} alt="X-Token"></img>
    <span className="flex-1 text-center max-sm:text-xs">
      {currentChainInfo().xTokenName}
    </span>
  </span>
);

const ReadOnlyInput: React.FC<{ value: number | null }> = ({ value }) => (
  <input
    id="wallet-readonly"
    className="flex-1 text-xl font-normal text-[#3F3535] placeholder:text-[#3F3535] focus:outline-none max-sm:text-base"
    placeholder="---"
    value={value || '---'}
    readOnly
  ></input>
);

const WalletExchange: React.FC = () => {
  const inputRef = useRef(null);

  const [searchParams] = useSearchParams();
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  const [amount, setAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const xbitPrice = useXbitPrice();
  const { balance, loadBalance } = useJkptBalance();
  const jkpt = getJkpt();
  const xTokenName = currentChainInfo().xTokenName;
  const { xbitBalance, loadXbitBalance } = useXbitBalance();

  const disabled = amount === '0' || amount === null || loading;

  const setDepositAmount = useCallback((val: string | number) => {
    const floatVal = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(floatVal)) setAmount('');
    else setAmount((Math.floor(floatVal * 1e8) / 1e8).toFixed(8));
  }, []);

  useEffect(() => {
    const depositVal = searchParams.get('deposit');
    const withdrawVal = searchParams.get('withdraw');
    if (!inputRef.current) return;
    if (depositVal) {
      setIsDeposit(true);
      setDepositAmount(parseFloat(depositVal).toFixed(8));
      (inputRef.current as HTMLInputElement).value = depositVal;
      (inputRef.current as HTMLInputElement).focus();
    } else if (withdrawVal) {
      setIsDeposit(false);
      setAmount(parseFloat(withdrawVal).toFixed(8));
      (inputRef.current as HTMLInputElement).value = withdrawVal;
      (inputRef.current as HTMLInputElement).focus();
      (inputRef.current as HTMLInputElement).dispatchEvent(
        new Event('change', { bubbles: true })
      );
    }
  }, [searchParams, setDepositAmount]);

  const switchTab = useCallback(
    (isDeposit: boolean) => {
      setIsDeposit(isDeposit);
      if (isDeposit) loadBalance();
      else loadXbitBalance();
    },
    [loadBalance, loadXbitBalance]
  );

  const handleDeposit = useCallback(
    async (value: string | null, isDeposit: boolean) => {
      if (value === null) return;
      setLoading(true);
      try {
        if (isDeposit) {
          await Web3Service.service.deposit(value);
          showSucc('Deposit success!');
          loadBalance();
        } else {
          await Web3Service.service.withdraw(value);
          showSucc('Withdraw success!');
          loadXbitBalance();
        }
        setAmount('0');
        if (inputRef && inputRef.current)
          (inputRef.current as HTMLInputElement).value = '';
      } catch (e: any) {
        showError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [loadBalance, loadXbitBalance]
  );

  const handleClickMax = useCallback(() => {
    if (!balance || !isDeposit) return;
    setDepositAmount(balance);
  }, [isDeposit, setDepositAmount, balance]);

  return (
    <section
      className="h-[530px] w-[520px] rounded-xl bg-[#F5F5F5] px-10 pb-3 pt-[42px] max-sm:h-[410px] max-sm:w-full max-sm:px-4 max-sm:pt-[25px]"
      style={{
        backgroundImage: `url("${isDeposit ? MinerLeftImage : MinerRightImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-2xl max-sm:text-xl max-sm:font-medium">
        {(() => {
          if (isDeposit) {
            return (
              <>
                <span className="mr-32 cursor-pointer text-mainV1 max-sm:mr-3 max-sm:mr-[100px]">
                  Deposit
                </span>
                <span
                  className="font-normal hover:cursor-pointer"
                  onClick={() => switchTab(false)}
                >
                  Withdraw
                </span>
              </>
            );
          } else {
            return (
              <>
                <span
                  className="mr-32 cursor-pointer font-normal max-sm:mr-[100px]"
                  onClick={() => switchTab(true)}
                >
                  Deposit
                </span>
                <span className="text-mainV1 hover:cursor-pointer">
                  Withdraw
                </span>
              </>
            );
          }
        })()}
      </div>
      <div className="mt-[60px] flex items-center justify-between text-sm text-[#FFA41B] sm:text-base">
        <div
          className={`flex max-sm:flex-col sm:items-center ${isDeposit ? 'text-[#FFA41B]' : 'text-[#93DC08]'}`}
        >
          <span className="mr-1">Balance:</span>
          <span>
            <span className="mr-1">
              {isDeposit
                ? formatTokenAmount(balance)
                : formatTokenAmount(xbitBalance)}
            </span>
            <span>{isDeposit ? jkpt.toUpperCase() : xTokenName}</span>
          </span>
        </div>

        {isDeposit && (
          <span className="mr-[13px] flex rounded bg-[#3487FF] px-2 py-1 text-sm font-bold text-white">
            <Link
              className="text-nowrap text-[10px] max-sm:text-[8px]"
              to="https://app.uniswap.org/"
              target="_blank"
            >
              Swap USD to {jkpt.toLocaleUpperCase()}
            </Link>
          </span>
        )}
      </div>
      <div className="relative mb-5 mt-4 overflow-hidden rounded-2xl border border-[#7B61FF] bg-white px-5 py-5 max-sm:my-4 max-sm:px-4 max-sm:py-[10px] max-sm:text-sm">
        <div className="relative flex items-center">
          <input
            id="wallet-input"
            ref={inputRef}
            type="number"
            onWheel={() =>
              inputRef.current && (inputRef.current as HTMLInputElement).blur()
            }
            min={0}
            className="flex-1 text-xl font-normal text-[#3F3535] placeholder:text-[#3F3535] focus:outline-none max-sm:text-base"
            placeholder="Amount"
            value={amount ? parseFloat(amount) : ''}
            onChange={(e) => {
              setDepositAmount(e.target.value);
            }}
          />

          {isDeposit && (
            <span
              className="absolute right-32 top-2 cursor-pointer text-xl text-link underline underline-offset-4 max-sm:right-20 max-sm:text-base"
              onClick={handleClickMax}
            >
              Max
            </span>
          )}
          <div className="flex-shrink-0">
            {isDeposit ? <IconJkptComp /> : <IconXbitComp />}
          </div>
        </div>
        <div className="absolute left-0 right-0 my-6 border-t border-[#7B61FF] max-sm:my-3"></div>
        <div className="mt-10 flex max-sm:mt-6">
          <ReadOnlyInput
            value={(() => {
              if (amount === null || xbitPrice === null) return null;
              return isDeposit
                ? parseFloat(amount) / (xbitPrice as number)
                : parseFloat(amount) * (xbitPrice as number);
            })()}
          />
          {isDeposit ? <IconXbitComp /> : <IconJkptComp />}
        </div>
      </div>
      <div className="mb-[30px] font-normal text-[#3F3535] max-sm:mb-5 max-sm:text-sm">
        <span>
          1 {xTokenName} = {formatTokenAmount(xbitPrice)} {jkpt.toUpperCase()}
        </span>
      </div>
      <div
        className={`flex justify-center rounded-xl py-[23px] text-2xl text-white max-sm:py-4 max-sm:text-base ${
          disabled ? 'bg-[#FFA41B]/50' : 'bg-[#FFA41B]'
        }`}
      >
        <button
          disabled={disabled}
          onClick={() => handleDeposit(amount, isDeposit)}
        >
          {!loading &&
            (isDeposit
              ? `Deposit ${jkpt.toUpperCase()} to Pool`
              : `Withdraw ${jkpt.toUpperCase()} to Wallet`)}
          {loading && <Spin className="h-8 w-8"></Spin>}
        </button>
      </div>
    </section>
  );
};

export default WalletExchange;
