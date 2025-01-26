import * as argon2 from 'argon2';

export const hashData = async (data: string): Promise<string> => {
  return await argon2.hash(data);
};
