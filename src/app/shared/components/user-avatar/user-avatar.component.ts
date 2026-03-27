import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-avatar" [class]="'size-' + size()" [class.clickable]="!!link()">
      @if (imageUrl()) {
        <img [src]="imageUrl()" [alt]="alt()" class="avatar-img" loading="lazy" />
      } @else {
        <div class="avatar-fallback">
          {{ alt().charAt(0).toUpperCase() }}
        </div>
      }
    </div>
  `,
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent {
  readonly imageUrl = input<string | undefined>();
  readonly alt = input('User');
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly link = input<string | undefined>();
}
