import { AvatarGenerator } from 'random-avatar-generator';

const generator = new AvatarGenerator();

const cacheMap: { [index: string]: string } = {};

// Simply get a random avatar
//generator.generateRandomAvatar();

// Optionally specify a seed for the avatar. e.g. for always getting the same avatar for a user id.
// With seed 'avatar', always returns https://avataaars.io/?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Blue01&clotheType=Hoodie&eyeType=EyeRoll&eyebrowType=RaisedExcitedNatural&facialHairColor=Blonde&facialHairType=BeardMagestic&hairColor=Black&hatColor=White&mouthType=Sad&skinColor=Yellow&topType=ShortHairShortWaved
//generator.generateRandomAvatar('avatar');

export const getUserAvatar = (addr: string) => {
  if (!cacheMap[addr]) {
    cacheMap[addr] = generator.generateRandomAvatar(addr);
  }
  return cacheMap[addr];
};
