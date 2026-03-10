import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PinService } from '../../../../shared/services/pin.service';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { FollowButtonComponent } from '../../../../shared/components/follow-button/follow-button.component';
import { MOCK_NOTIFICATIONS } from '../../../../shared/mocks/notifications.mock';
import { Comment } from '../../../../shared/interfaces/comment.interface';

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1', text: 'Absolutely stunning! This is my new wallpaper 😍', pinId: '296604325483937524', createdAt: new Date(Date.now() - 3600000).toISOString(), likesCount: 12, isLiked: false,
    author: { id: 'u2', username: 'design_lover', displayName: 'Design Lover', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  },
  {
    id: 'c2', text: 'The colors are incredible! Where was this taken?', pinId: '296604325483937524', createdAt: new Date(Date.now() - 7200000).toISOString(), likesCount: 8, isLiked: false,
    author: { id: 'u3', username: 'art_studio', displayName: 'Art Studio', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  },
  {
    id: 'c3', text: 'Perfect composition and lighting. Love it!', pinId: '296604325483937524', createdAt: new Date(Date.now() - 86400000).toISOString(), likesCount: 5, isLiked: true,
    author: { id: 'u4', username: 'photo_world', displayName: 'Photo World', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  },
];

@Component({
  selector: 'app-pin',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, FormsModule, MasonryGridComponent, UserAvatarComponent, FollowButtonComponent],
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.scss',
})
export class PinComponent implements OnInit {
  readonly pin = signal<Pin | null>(null);
  readonly relatedPins = signal<Pin[]>([]);
  readonly comments = signal<Comment[]>(MOCK_COMMENTS);
  readonly isLoading = signal(true);
  readonly isSaved = signal(false);
  readonly commentText = signal('');

  private route = inject(ActivatedRoute);
  private pinService = inject(PinService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '296604325483937524';
    this.pinService.getPinById(id).subscribe(pin => {
      this.pin.set(pin);
      this.isSaved.set(pin.isSaved ?? false);
      this.isLoading.set(false);
    });
    this.pinService.getRelatedPins(id).subscribe(pins => this.relatedPins.set(pins));
  }

  onSave(): void {
    const p = this.pin();
    if (!p) return;
    this.pinService.toggleSave(p).subscribe(saved => this.isSaved.set(saved));
  }

  onShare(): void {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  }

  addComment(): void {
    const text = this.commentText().trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      text,
      pinId: this.pin()?.id ?? '',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      author: { id: 'current', username: 'myprofile', displayName: 'Meu Perfil', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
    };
    this.comments.update(c => [newComment, ...c]);
    this.commentText.set('');
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }
}
