import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const encryptPassword = async (
  plainPassword: string,
): Promise<string> => {
  try {
    const hashPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashPassword;
  } catch (error) {
    throw new Error('Error while encrypting the password');
  }
};

export const compareHashPassword = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    const passwordsMatch = await bcrypt.compare(plainPassword, hashPassword);
    return passwordsMatch;
  } catch (error) {
    throw new Error('Error while comparing passwords');
  }
};
