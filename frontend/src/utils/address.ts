export type Token = 'usdt' | 'xbit' | 'xexp' | 'usdc' | 'jkpt';

type TokenInfo = {
  address: string;
  decimal: string;
};

export type Tokens = {
  usdt: TokenInfo;
  xbit: TokenInfo;
  xexp: TokenInfo;
  usdc: TokenInfo;
  jkpt: TokenInfo;
};

// 11155111 - sperolia test net
export const SepoliaTokens = {
  jkpt: {
    address: '0xE6bAdd30FB1c998Ef509b32C21f97be011956237',
    decimal: '8',
  },
  usdt: {
    address: '0x56D18008C45405672B12F72fBd7Dec1A12146A60',
    decimal: '6',
  },
  xbit: {
    address: '0x6199e96C4F26fAFCFE67FA8cf02b8CE2C63E786d',
    decimal: '18',
  },
  xexp: {
    address: '0xa3475D71A254dF819ccCA4A1ed607A7f8BbFbB4E',
    decimal: '18',
  },
  usdc: {
    address: '0xF70CD4a024ca7DC58CB9f9fe04455Ae33fCccF0D',
    decimal: '6',
  },
};

export const MainnetTokens = {
  jkpt: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimal: '8',
  },
  usdt: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimal: '6',
  },
  xbit: {
    address: '0xc13A770B1Aa13a006A272967a357Ba1EaE78314d',
    decimal: '18',
  },
  xexp: {
    address: '0x51E55BCe4d92dE264453B035A7Fc44313d066B4A',
    decimal: '18',
  },
  usdc: {
    address: '0xF70CD4a024ca7DC58CB9f9fe04455Ae33fCccF0D',
    decimal: '6',
  },
};

export const ArbitrumTokens = {
  jkpt: {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    decimal: '8',
  },
  usdt: {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    decimal: '6',
  },
  xbit: {
    address: '0x6b64117db45821E9e5Bd9652fe6C6d2B6D71D243',
    decimal: '18',
  },
  xexp: {
    address: '0x097745bbD1A285973AE21298C75876D78cbFB908',
    decimal: '18',
  },
  usdc: {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimal: '6',
  },
};

export const HeklaTokens = {
  jkpt: {
    address: '0x21fAaE15Ab50B4c226b325B2Ecda4ea0A2441e6F',
    decimal: '18',
  },
  usdt: {
    address: '0xf0E397F9CC4c2a7Ea0bE4FBeCeFD42a4FEEd29bD',
    decimal: '6',
  },
  usdc: {
    address: '0xFC2400f98528aDd8d3670AaB834c02DC06FdcBF1',
    decimal: '6',
  },
  xbit: {
    address: '0x21BdED9700173120b58022735206EAD1fB49eA53',
    decimal: '18',
  },
  xexp: {
    address: '0xcA214F1554965B190308fAcBCE1be756B7222e0D',
    decimal: '18',
  },
};

export const BaseTokens = {
  jkpt: {
    address: '0x4200000000000000000000000000000000000006',
    decimal: '18',
  },
  usdt: {
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    decimal: '6',
  },
  usdc: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimal: '6',
  },
  xexp: {
    address: '0xE5701294101C694cE249403580008b4f48E7569E',
    decimal: '18',
  },
  xbit: {
    address: '0xE10745D242B67104212C2F844Faf883d1273cCc7',
    decimal: '18',
  },
};
