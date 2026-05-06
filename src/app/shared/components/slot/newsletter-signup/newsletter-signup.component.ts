import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newsletter-signup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './newsletter-signup.component.html',
  styleUrl: './newsletter-signup.component.scss',
})
export class NewsletterSignupComponent {
  readonly title = input<string>('Crie sua conta');
  readonly placeholder = input<string>('seu@email.com');
  readonly submitLabel = input<string>('Criar conta');
}
