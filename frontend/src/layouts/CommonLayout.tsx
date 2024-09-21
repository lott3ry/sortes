import AssetPage from '../pages/Asset';
import Lott3ryPage from '../pages/Lott3ry';
import DistributorPage from '../pages/Distributor';
import TestPage from '../pages/Test';
import MinerPage from '../pages/Miner';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { CharityPage } from '../pages/Charity';

export const CommonLayout = () => {
  return (
    <>
      <Header />
      <main className="font-bold">
        <Routes>
          <Route path="test" element={<TestPage />} />
          <Route path="create-distributor-pool" element={<DistributorPage />} />
          <Route path="pool" element={<MinerPage />} />
          <Route path="miner" element={<MinerPage />} />
          <Route path="play" element={<Lott3ryPage />} />
          <Route path="distributor-profit" element={<AssetPage />} />
          <Route path="charity" element={<CharityPage />} />
          <Route path="/" element={<MinerPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};
