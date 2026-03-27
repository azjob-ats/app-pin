import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DividerComponent } from '@shared/components/divider/divider.component';
import { InputComponent } from '@shared/components/input/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent } from '@shared/components/card/card.component';
import { LabelButtonComponent } from '@shared/components/button-provider/label-button/label-button.component';
import { GoogleProviderComponent } from '@shared/components/button-provider/google-provider/google-provider.component';
import { ButtonProviderComponent } from '@shared/components/button-provider/button-provider/button-provider.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, ButtonComponent, DividerComponent, InputComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, CardFooterComponent, ButtonProviderComponent, GoogleProviderComponent, LabelButtonComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
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
