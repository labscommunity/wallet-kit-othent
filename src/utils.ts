import { type Tag } from "arweave/web/lib/transaction";
import { jwtDecode } from "jwt-decode";

import { ConnectResult, DecodedJWT } from "./types";

/**
 * Decode an array of tags
 *
 * @param tags An array of tags
 * @returns An array of decoded tags
 */
export function decodeTags(tags: Tag[]) {
  return tags.map((tag) => {
    try {
      const name = tag.get("name", { decode: true, string: true });
      const value = tag.get("value", { decode: true, string: true });
      return { name, value };
    } catch {
      return tag;
    }
  });
}

export async function userDetails(): Promise<ConnectResult> {
  const id_token = localStorage.getItem("id_token");

  if (!id_token) {
    throw new Error("Error retrieving session id_token.");
  }

  const decoded_JWT: ConnectResult = jwtDecode(id_token);
  delete decoded_JWT.nonce;
  delete decoded_JWT.sid;
  delete decoded_JWT.aud;
  delete decoded_JWT.iss;
  delete decoded_JWT.iat;
  delete decoded_JWT.exp;
  delete decoded_JWT.updated_at;

  return decoded_JWT;
}

export function deleteStoredToken() {
  const id_token = localStorage.getItem("id_token");

  if (!id_token) {
    return true;
  }
  localStorage.removeItem("id_token");
}

export function isBase64(str: string) {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  return base64Regex.test(str);
}
