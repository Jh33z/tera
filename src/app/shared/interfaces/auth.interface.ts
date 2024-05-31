export interface AuthResData {
  kind: string;
  idToken: string;
  email: string;
  role: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
