import type { SignatureOptions } from "arweave/node/lib/crypto/crypto-interface";
import type { DispatchResult, GatewayConfig, PermissionType } from "arconnect";
import { Strategy } from "@arweave-wallet-kit/core/strategy";
import type Transaction from "arweave/web/lib/transaction";
import * as othent from "@othent/kms";

import { userDetails } from "./utils";
import { ConnectResult } from "./types";

export default class OthentStrategy implements Strategy {
  public id: "othent" = "othent";
  public name = "Google";
  public description =
    "Sign in with Google through Othent Smart Contract Wallets";
  public theme = "35, 117, 239";
  public logo = "33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs";
  public url = "https://othent.io";

  #addressListeners: ListenerFunction[] = [];
  #currentAddress: string = "";

  constructor() {}

  /**
   * Advanced function to override the default API ID
   * Othent uses.
   */

  public async isAvailable() {
    try {
      // ensure instance
      // await this.#othentInstance(false);

      return true;
    } catch {
      return false;
    }
  }

  public async ping() {
    // const othent = await this.#othentInstance(false);
    // return await othent.ping();
  }

  public async connect() {
    const user = (await othent.connect()) as ConnectResult;

    for (const listener of this.#addressListeners) {
      listener(user.walletAddress);
    }

    this.#currentAddress = user.walletAddress;
  }

  public async disconnect() {
    await othent.disconnect();

    for (const listener of this.#addressListeners) {
      listener(undefined as any);
    }

    this.#currentAddress = "";
  }

  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    //

    // return []
    return "" as any;
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return "" as any;
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
  ): Promise<Uint8Array> {
    //

    // return []
    return "" as any;
  }

  public async getPermissions() {
    try {
      const res = await userDetails();

      if (res.walletAddress !== this.#currentAddress) {
        this.#currentAddress = res.walletAddress;
        for (const listener of this.#addressListeners) {
          listener(res.walletAddress);
        }
      }

      return [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "ENCRYPT",
        "DECRYPT",
        "SIGNATURE",
        "ACCESS_ARWEAVE_CONFIG",
        "DISPATCH"
      ] as PermissionType[];
    } catch {
      return [];
    }
  }

  public async getActiveAddress(): Promise<string> {
    const address = await othent.getActiveKey();

    return address;
  }

  public async getAllAddresses(): Promise<string[]> {
    const addr = await othent.getActiveKey();

    return [addr];
  }

  public async getActivePublicKey(): Promise<string> {
    const pubKey = await othent.getActivePublicKey();

    return pubKey;
  }

  public async getArweaveConfig(): Promise<GatewayConfig> {
    return "" as any;
  }

  public async getWalletNames(): Promise<{
    [addr: string]: string;
  }> {
    const addr = await othent.getWalletNames();

    return { addr };
  }

  public async sign(transaction: Transaction, options?: SignatureOptions) {
    if (options) {
      console.warn(
        "[Arweave Wallet Kit] Othent does not support transaction signature options"
      );
    }

    if (!this.#currentAddress) {
      throw new Error("You need to be loggedin before signing a transaction");
    }

    if (transaction.quantity !== "0" && transaction.target !== "") {
      throw new Error(
        "[Arweave Wallet Kit] Signing with Othent only supports data type transactions"
      );
    }

    const signedTransaction = await othent.sign(transaction);

    return signedTransaction;
  }

  public async userDetails() {
    return await userDetails();
  }

  public addAddressEvent(listener: ListenerFunction) {
    this.#addressListeners.push(listener);

    // placeholder function
    return listener as any;
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void
  ) {
    this.#addressListeners.splice(
      this.#addressListeners.indexOf(listener as any),
      1
    );
  }

  public async signature(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
  ): Promise<Uint8Array> {
    return "" as any;
  }
}

type ListenerFunction = (address: string) => void;
