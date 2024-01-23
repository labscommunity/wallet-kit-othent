import { ConnectReturnType } from "@othent/kms";

export type ListenerFunction = (address: string) => void;
export interface ConnectResult extends ConnectReturnType {
  walletAddress: string;
}

export interface DecodedJWT {
  walletAddress: string;
  owner: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at?: string;
  email: string;
  email_verified: string;
  sub: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  sid?: string;
  nonce?: string;
  data?: any;
}
