export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  name: string;
}
