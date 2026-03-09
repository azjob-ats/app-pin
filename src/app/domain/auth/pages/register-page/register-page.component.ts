import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DividerComponent } from '../../../../shared/components/divider/divider.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ButtonComponent, DividerComponent, InputComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  readonly name = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly birthdate = signal('');
  readonly isLoading = signal(false);

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email() || !this.password() || !this.name() || this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/verify-email']);
    }, 1200);
  }

  loginWithGoogle(): void {
    this.router.navigate(['/home']);
  }
}
