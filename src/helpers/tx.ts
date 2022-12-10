import * as encUtils from "enc-utils";

import { apiGetAccountNonce, apiGetGasPrices } from "./api";
import { toWad } from "./utilities";

export async function getGasPrice(chainId: string): Promise<string> {
  if (chainId === "eip155:1") return toWad("20", 9).toHexString();
  const gasPrices = await apiGetGasPrices();
  return toWad(`${gasPrices.slow.price}`, 9).toHexString();
}

export async function formatTestTransaction(account: string) {
  const [address, chainId] = account.split("@");
  // nonce
  const _nonce = await apiGetAccountNonce(address, chainId);

  const nonce = encUtils.sanitizeHex(encUtils.numberToHex(_nonce));

  // gasPrice
  const _gasPrice = await getGasPrice(chainId);
  const gasPrice = encUtils.sanitizeHex(_gasPrice);

  // gasLimit
  const _gasLimit = 21000;
  const gasLimit = encUtils.sanitizeHex(encUtils.numberToHex(_gasLimit));

  // value
  const _value = 0;
  const value = encUtils.sanitizeHex(encUtils.numberToHex(_value));

  const tx = { from: address, to: address, data: "0x", nonce, gasPrice, gasLimit, value };

  return tx;
}
