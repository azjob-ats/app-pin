import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  readonly email = signal('');
  readonly password = signal('');
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email() || !this.password() || this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/home']);
    }, 1200);
  }

  loginWithGoogle(): void {
    this.router.navigate(['/home']);
  }
}
