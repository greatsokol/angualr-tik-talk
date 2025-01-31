import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form: FormGroup = new FormGroup({
    username: new FormControl<string>('EugenySokolov', [Validators.required]),
    password: new FormControl<string>('eK6PHNbmS0', [Validators.required])
  });

  onSubmit() {
    if (this.form.valid) {
      firstValueFrom(this.authService.login(this.form.value)).then(
        _ => {
          this.router.navigate(['']);
        }
      );
    }
  }
}
