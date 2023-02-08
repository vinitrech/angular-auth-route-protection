import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html'
})
export class AuthComponent {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formValue: NgForm) {
    if (!formValue.valid) {
      return
    }

    const email = formValue.value.email;
    const password = formValue.value.password;

    this.isLoading = true;
    this.error = '';

    let authObservable: Observable<AuthResponseData> = new Observable<AuthResponseData>();

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe({ // Subscribe now takes only 1 argument, other signatures are deprecated. Pass an object specifying the next, error and complete callbacks.
      next: (responseData) => {
        console.log(responseData);
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage
        this.isLoading = false;
      }
    })

    formValue.reset();
  }
}
