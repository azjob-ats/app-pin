import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BoardCardComponent } from '../../../../shared/components/board-card/board-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FollowButtonComponent } from '../../../../shared/components/follow-button/follow-button.component';
import { MasonryGridComponent } from '../../../../shared/components/masonry-grid/masonry-grid.component';
import { UserAvatarComponent } from '../../../../shared/components/user-avatar/user-avatar.component';
import { Board } from '../../../../shared/interfaces/board.interface';
import { Pin } from '../../../../shared/interfaces/pin.interface';
import { User } from '../../../../shared/interfaces/user.interface';
import { BoardService } from '../../../../shared/services/board.service';
import { PinService } from '../../../../shared/services/pin.service';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    MasonryGridComponent,
    FollowButtonComponent,
    UserAvatarComponent,
    BoardCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  readonly user = signal<User | null>(null);
  readonly createdPins = signal<Pin[]>([]);
  readonly savedPins = signal<Pin[]>([]);
  readonly boards = signal<Board[]>([]);
  readonly isLoading = signal(true);
  readonly activeTab = signal('created');

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private pinService = inject(PinService);
  private boardService = inject(BoardService);

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username') ?? 'fondecranvip';
    this.userService.getUserByUsername(username).subscribe(user => {
      this.user.set(user);
      this.isLoading.set(false);
    });
    this.pinService.getUserPins('u1').subscribe(pins => this.createdPins.set(pins));
    this.pinService.getUserPins('u1', 1).subscribe(pins => this.savedPins.set(pins));
    this.boardService.getUserBoards('u1').subscribe(boards => this.boards.set(boards));
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }
}
