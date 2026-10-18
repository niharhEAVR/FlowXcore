import Cryptr from "cryptr";

let _cryptr: Cryptr | null = null;
const getCryptr = () => (_cryptr ??= new Cryptr(process.env.ENCRYPTION_KEY!));

export const encrypt = (text: string) => getCryptr().encrypt(text);
export const decrypt = (text: string) => getCryptr().decrypt(text);