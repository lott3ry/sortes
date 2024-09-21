import { RewardConfig, RewardType } from '../../../hooks/pool';

export const MaxRatio = 8;

const presetConfig: RewardConfig[][] = [
  [
    {
      type: RewardType.Fixed,
      reward: 5,
      expectation: 2.5,
    },
    {
      type: RewardType.Fixed,
      reward: 20,
      expectation: 5,
    },
    {
      type: RewardType.Fixed,
      reward: 50,
      expectation: 0.05,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 5,
      expectation: 3.5,
    },
    {
      type: RewardType.Fixed,
      reward: 10,
      expectation: 1,
    },
    {
      type: RewardType.Fixed,
      reward: 20,
      expectation: 2,
    },
    {
      type: RewardType.Fixed,
      reward: 1000,
      expectation: 0.15,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 12,
      expectation: 7.2,
    },
    {
      type: RewardType.Fixed,
      reward: 8,
      expectation: 0.8,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 5,
      expectation: 4.5,
    },
    {
      type: RewardType.Fixed,
      reward: 20,
      expectation: 1,
    },
    {
      type: RewardType.Fixed,
      reward: 250,
      expectation: 2.5,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 20,
      expectation: 7,
    },
    {
      type: RewardType.Fixed,
      reward: 1000,
      expectation: 1,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 2,
      expectation: 0.5,
    },
    {
      type: RewardType.Fixed,
      reward: 30,
      expectation: 7.5,
    },
  ],
  [
    {
      type: RewardType.Fixed,
      reward: 800,
      expectation: 8,
    },
  ],
];

export default presetConfig;
