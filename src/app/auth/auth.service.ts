import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

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
      postOptions).pipe(catchError(this.handleError));
  }

  login(authEmail: string, authPassword: string) {
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

    return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
      postData,
      postOptions).pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage: string = 'An error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Incorrect password!';
        break;
    }

    return throwError(() => errorMessage);
  }
}
