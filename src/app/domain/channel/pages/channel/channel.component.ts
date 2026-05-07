import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ButtonInscriptionComponent } from '@shared/components/button-inscription/button-inscription.component';
import { CollectionBundleComponent } from '@shared/components/collection-bundle/collection-bundle.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PinCardPlayerShortComponent } from '@shared/components/pin-card-player-short/pin-card-player-short.component';
import { AppTabPanelComponent } from '@shared/components/tabs/tab-panel.component';
import { AppTabComponent } from '@shared/components/tabs/tab.component';
import { AppTabsComponent } from '@shared/components/tabs/tabs.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { Channel } from '@shared/interfaces/entity/channel';
import { CollectionBundle } from '@shared/interfaces/entity/collection-bundle';
import { Post } from '@shared/interfaces/entity/post';
import { ChannelService } from '@shared/services/channel.service';
import { SeoService } from '@shared/services/seo.service';

@Component({
  selector: 'app-channel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    UserAvatarComponent,
    ButtonComponent,
    ButtonInscriptionComponent,
    CollectionBundleComponent,
    EmptyStateComponent,
    PinCardPlayerShortComponent,
    AppTabsComponent,
    AppTabComponent,
    AppTabPanelComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelPageComponent implements OnInit {
  readonly channel = signal<Channel | null>(null);
  readonly gallery = signal<Post[]>([]);
  readonly collection = signal<CollectionBundle[]>([]);
  readonly isLoading = signal(true);

  readonly websiteLabel = computed(() => {
    const url = this.channel()?.visitWebsite;
    if (!url) return '';
    return url.replace(/^https?:\/\//, '');
  });

  readonly websiteHref = computed(() => {
    const url = this.channel()?.visitWebsite;
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  });

  private readonly route = inject(ActivatedRoute);
  private readonly channelService = inject(ChannelService);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const profileName = this.route.snapshot.paramMap.get('username') ?? '';
    if (!profileName) {
      this.isLoading.set(false);
      return;
    }

    this.channelService.getByProfileName(profileName).subscribe({
      next: (channel) => {
        this.channel.set(channel);
        this.isLoading.set(false);
        this.seoService.setPage(
          channel.profileNameOfficial,
          channel.overview || `Canal ${channel.profileName} na RealWe.`,
        );
      },
      error: () => this.isLoading.set(false),
    });

    this.channelService.getGallery(profileName).subscribe((posts) => this.gallery.set(posts));
    this.channelService
      .getCollection(profileName)
      .subscribe((bundles) => this.collection.set(bundles));
  }

  formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }
}
