// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC

import BN from 'bn.js';
import { toBuffer, addHexPrefix, bufferToHex, stripHexPrefix, padToEven } from 'ethereumjs-util';
import trimStart from 'lodash/trimStart';

// When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").
export function hexEncodeQuantity(value: BN | Buffer): string {
  const trimmedValue = trimStart((value as any).toString('hex'), '0'); //TODO: fix typing
  return addHexPrefix(trimmedValue === '' ? '0' : trimmedValue);
}

// When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
export function hexEncodeData(value: string | Buffer): string {
  // convert the value to a buffer
  // convert the value to a hex prefixed hex string
  // strip the hex prefix
  // pad the data to even (two hex digits per byte)
  // add the hex prefix back in
  return addHexPrefix(padToEven(stripHexPrefix(bufferToHex(toBuffer(value)))));
}
