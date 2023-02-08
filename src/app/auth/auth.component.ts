import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html'
})
export class AuthComponent {
  isLoginMode: boolean = true;

  constructor(private authService: AuthService) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(formValue: NgForm) {
    if (!formValue.valid) {
      return
    }

    if (this.isLoginMode) {

    } else {
      const email = formValue.value.email;
      const password = formValue.value.password;

      this.authService.signup(email, password).subscribe({ // Subscribe now takes only 1 argument, other signatures are deprecated. Pass an object specifying the next, error and complete callbacks.
        next: (responseData) => {
          console.log(responseData);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

    formValue.reset();
  }
}
