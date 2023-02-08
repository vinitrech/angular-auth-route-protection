import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Subject, tap, throwError} from "rxjs";
import {User} from "./user.model";

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
  loggedUser: Subject<User> = new Subject<User>();

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
      postOptions).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
    })); // tap allows to manipulate data without changing the response
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
      postOptions).pipe(catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      })); // tap allows to manipulate data without changing the response
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000); // converts the response data to milliseconds and then add to current time
    const user = new User(email, userId, token, expirationDate);
    this.loggedUser.next(user);
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
