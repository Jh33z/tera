export interface UserInterface {
  email: string;
  token: string;
  username: string;
}

export interface Login {
  email: string;
  password: string;
}
export interface Register {
  email: string;
  password: string;
}
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
