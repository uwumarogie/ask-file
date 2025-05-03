import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
export const hash = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verify = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) => {
  return await bcrypt.compare(password, hash);
};
