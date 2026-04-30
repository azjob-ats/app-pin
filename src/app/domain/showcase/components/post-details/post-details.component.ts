import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { Post } from '@shared/interfaces/entity/post';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ButtonInscriptionComponent } from '@shared/components/button-inscription/button-inscription.component';
import { ButtonLikeComponent } from '@shared/components/button-like/button-like.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { CommentInputComponent } from '@shared/components/comment-input/comment-input.component';
import { CommentSubmitComponent } from '@shared/components/comment-submit/comment-submit.component';

@Component({
  selector: 'app-post-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    ButtonInscriptionComponent,
    ButtonLikeComponent,
    UserAvatarComponent,
    CommentInputComponent,
    CommentSubmitComponent,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent {
  readonly post = input.required<Post>();
  readonly learnMoreClicked = output<void>();

  readonly commentText = signal('');

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days} dia${days > 1 ? 's' : ''} atrás`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months > 1 ? 'meses' : 'mês'} atrás`;
    const years = Math.floor(months / 12);
    return `${years} ano${years > 1 ? 's' : ''} atrás`;
  }

  commentTimeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  addComment(): void {
    this.commentText.set('');
  }

  onLearnMore(): void {
    this.learnMoreClicked.emit();
  }
}
