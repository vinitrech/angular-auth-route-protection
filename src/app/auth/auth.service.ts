import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private httpClient: HttpClient) {

  }

  signup(authEmail: string, authPassword: string) {
    const postData = {
      email: authEmail,
      password: authPassword,
      returnSecureToken: true
    }

    const postOptions = {
      params: {
        key: 'AIzaSyBymC9b8hTQM57TkrE_6XQwRdw_3Iei1Tc'
      }
    }

    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp',
      postData,
      postOptions)
  }
}

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
