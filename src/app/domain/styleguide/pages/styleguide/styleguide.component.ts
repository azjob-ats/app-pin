import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { NgTemplateOutlet, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { DividerComponent } from '@shared/components/divider/divider.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from '@shared/components/card/card.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { SkeletonLoaderComponent } from '@shared/components/skeleton-loader/skeleton-loader.component';
import { MasonryGridComponent } from '@shared/components/masonry-grid/masonry-grid.component';
import { AppTabsComponent } from '@shared/components/tabs/tabs.component';
import { AppTabComponent } from '@shared/components/tabs/tab.component';
import { AppTabPanelComponent } from '@shared/components/tabs/tab-panel.component';
import { PopoverComponent } from '@shared/components/popover/popover.component';
import { UploadAreaComponent } from '@shared/components/upload-area/upload-area.component';
import { CodeDigitsComponent } from '@shared/components/code-digits/code-digits.component';
import { ButtonLikeComponent } from '@shared/components/button-like/button-like.component';
import { InfiniteScrollComponent } from '@shared/components/infinite-scroll/infinite-scroll.component';
import { NotificationItemComponent } from '@shared/components/notification-item/notification-item.component';
import { ButtonInscriptionComponent } from '@shared/components/button-inscription/button-inscription.component';
import { ButtonProviderComponent } from '@shared/components/button-provider/button-provider/button-provider.component';
import {
  CardBoardComponent,
  CardContainerComponent,
  CardSectionLeftComponent,
  CardSectionRightComponent,
  CardBodyComponent,
} from '@shared/components/card-board/card-board.component';
import {
  ChipScrollComponent,
  ChipItem,
} from '@shared/components/chip-scroll/chip-scroll.component';
import { SplitButtonComponent } from '@shared/components/splitbutton/splitbutton.component';
import { RadioGroupComponent, RadioOption } from '@shared/components/radio-group/radio-group.component';
import { CheckboxGroupComponent, CheckboxOption } from '@shared/components/checkbox-group/checkbox-group.component';
import { PinCardComponent } from '@shared/components/pin-card/pin-card.component';
import { Notification } from '@shared/interfaces/entity/notification';
import { Pin } from '@shared/interfaces/entity/pin';
import { Board } from '@shared/interfaces/entity/board';
import { CommentInputComponent } from '@shared/components/comment-input/comment-input.component';
import { CommentSubmitComponent } from '@shared/components/comment-submit/comment-submit.component';
import { BoardCardComponent } from '@shared/components/board-card/board-card.component';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { SidebarHeaderComponent } from '@shared/components/sidebar/sidebar-header.component';
import { SidebarContentComponent } from '@shared/components/sidebar/sidebar-content.component';
import { SidebarGroupComponent } from '@shared/components/sidebar/sidebar-group.component';
import { SidebarFooterComponent } from '@shared/components/sidebar/sidebar-footer.component';
import { TopbarComponent } from '@shared/components/topbar/topbar.component';
import { TopbarContentComponent } from '@shared/components/topbar/topbar-content.component';
import { TopbarGroupComponent } from '@shared/components/topbar/topbar-group.component';
import { ButtonUploadComponent } from '@shared/components/button-upload/button-upload.component';
import { SpinnerStepsComponent } from '@shared/components/spinner-steps/spinner-steps.component';
import { ToggleSwitchComponent } from '@shared/components/toggle-switch/toggle-switch.component';
import { ToggleCheckComponent } from '@shared/components/toggle-check/toggle-check.component';
import { SectionListComponent, SectionItemComponent } from '@shared/components/section-list/section-list.component';
import { environment } from '@env/environment';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

export interface ClassRow {
  cls: string;
  properties: string;
}

export interface SearchResult {
  id: string;
  label: string;
  crumb: string;
}


@Component({
  selector: 'app-styleguide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    DividerComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    UserAvatarComponent,
    EmptyStateComponent,
    DrawerComponent,
    SearchBarComponent,
    FollowButtonComponent,
    SkeletonLoaderComponent,
    MasonryGridComponent,
    AppTabsComponent,
    AppTabComponent,
    AppTabPanelComponent,
    PopoverComponent,
    UploadAreaComponent,
    CodeDigitsComponent,
    ButtonLikeComponent,
    InfiniteScrollComponent,
    NotificationItemComponent,
    ButtonInscriptionComponent,
    ButtonProviderComponent,
    CardBoardComponent,
    CardContainerComponent,
    CardSectionLeftComponent,
    CardSectionRightComponent,
    CardBodyComponent,
    ChipScrollComponent,
    SplitButtonComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
    PinCardComponent,
    CommentInputComponent,
    CommentSubmitComponent,
    BoardCardComponent,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarGroupComponent,
    SidebarFooterComponent,
    TopbarComponent,
    TopbarContentComponent,
    TopbarGroupComponent,
    ButtonUploadComponent,
    SpinnerStepsComponent,
    ToggleSwitchComponent,
    ToggleCheckComponent,
    SectionListComponent,
    SectionItemComponent,
  ],
  templateUrl: './styleguide.component.html',
  styleUrl: './styleguide.component.scss',
  host: { '[class.dark-mode]': 'isDark()' },
})
export class StyleguideComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected APP_NAME = `${environment.APP_NAME}`; 
  readonly isDark = signal(false);
  readonly expandedGroups = signal<Set<string>>(new Set(['utilities', 'standard', 'components']));

  readonly activeSection = toSignal(this.route.paramMap.pipe(map((p) => p.get('section') ?? '')), {
    initialValue: '',
  });

  constructor() {
    effect(() => {
      const section = this.activeSection();
      this.sidebarOpen.set(false);
      if (section) this.autoExpand(section);
      document.getElementById('sg-main')?.scrollTo({ top: 0 });
    });
  }

  inputValue = '';
  textareaValue = '';
  selectValue = '';
  radioValue = '';
  checkboxValues: string[] = [];

  readonly radioOptions: RadioOption[] = [
    { label: 'Até 1 minuto', value: 'lt1' },
    { label: '1 – 5 minutos', value: '1to5' },
    { label: '5 – 10 minutos', value: '5to10' },
    { label: '10 – 30 minutos', value: '10to30' },
    { label: 'Acima de 30 minutos', value: 'gt30' },
  ];

  readonly checkboxOptions: CheckboxOption[] = [
    { label: 'Mercado de Trabalho', value: 'mercado' },
    { label: 'Tecnologia', value: 'tech' },
    { label: 'Startups', value: 'startups' },
    { label: 'Economia', value: 'economia' },
    { label: 'Carreira', value: 'carreira' },
  ];

  readonly sidebarOpen = signal(false);

  readonly importCode = `import { SectionListComponent, SectionItemComponent } from '@shared/components/section-list/section-list.component';`;

  readonly sectionListCode = `<app-section-list>
  <app-section-item [clickable]="true">
    <span item-start class="material-symbols-rounded">laptop</span>
    <div>
      <strong>Device Name</strong>
      <span>macOS · Safari 17</span>
    </div>
    <app-button item-end variant="ghost" size="sm">Encerrar</app-button>
  </app-section-item>
</app-section-list>`;

  readonly searchQuery = signal('');
  readonly searchActive = signal(false);
  readonly copiedCode = signal<string | null>(null);

  readonly searchResults = computed<SearchResult[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return [];
    const results: SearchResult[] = [];
    for (const group of this.nav) {
      for (const item of group.children ?? []) {
        if (item.children?.length) {
          for (const child of item.children) {
            if (child.label.toLowerCase().includes(q) || child.id.includes(q)) {
              results.push({
                id: child.id,
                label: child.label,
                crumb: `${group.label} › ${item.label}`,
              });
            }
          }
        } else {
          if (item.label.toLowerCase().includes(q) || item.id.includes(q)) {
            results.push({ id: item.id, label: item.label, crumb: group.label });
          }
        }
      }
    }
    return results.slice(0, 8);
  });

  readonly drawerOpen = signal(false);
  readonly spinnerCurrentStep = signal(1);
  readonly spinnerTotalSteps = 5;
  readonly toggleSwitchChecked = signal(true);
  readonly toggleCheckChecked = signal(true);
  readonly popoverSelected = signal<string | null>(null);
  readonly drawerPosition = signal<'left' | 'right' | 'top' | 'bottom'>('right');
  readonly infiniteLoading = signal(false);
  readonly inscriptionSubscribed = signal(false);
  readonly chipScrollSelected = signal('all');

  readonly demoChips: ChipItem[] = [
    { key: 'all', labelKey: 'Todos' },
    { key: 'vagas', icon: 'work', labelKey: 'Vagas' },
    { key: 'videos', icon: 'play_circle', labelKey: 'Vídeos' },
    { key: 'artigos', icon: 'article', labelKey: 'Artigos' },
    { key: 'cursos', icon: 'school', labelKey: 'Cursos' },
    { key: 'empresas', icon: 'business', labelKey: 'Empresas' },
  ];

  readonly mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_follower',
      message: 'started following you.',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      actor: {
        id: 'u1',
        username: 'ana.silva',
        displayName: 'Ana Silva',
        avatarUrl: 'https://i.pravatar.cc/48?u=ana',
      },
    },
    {
      id: '2',
      type: 'pin_saved',
      message: 'saved your pin.',
      isRead: true,
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      actor: { id: 'u2', username: 'carlos.dev', displayName: 'Carlos Dev' },
      pin: {
        id: 'p1',
        imageUrl: 'https://picsum.photos/seed/sg1/60/80',
        title: 'Design inspiration',
      },
    },
    {
      id: '3',
      type: 'pin_comment',
      message: 'commented on your pin.',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      actor: {
        id: 'u3',
        username: 'julia.arq',
        displayName: 'Júlia Arq',
        avatarUrl: 'https://i.pravatar.cc/48?u=julia',
      },
    },
  ];

  readonly mockPins: Pin[] = [
    {
      id: 'sg-p1',
      title: 'Design Inspiration',
      imageUrl: 'https://picsum.photos/seed/sg1/300/400',
      imageWidth: 300,
      imageHeight: 400,
      author: { id: 'a1', username: 'designer', displayName: 'Designer' },
      saveCount: 128,
      commentCount: 14,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sg-p2',
      title: 'Architecture',
      imageUrl: 'https://picsum.photos/seed/sg2/300/300',
      imageWidth: 300,
      imageHeight: 300,
      author: { id: 'a2', username: 'arch', displayName: 'Architect' },
      saveCount: 56,
      commentCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sg-p3',
      title: 'Typography',
      imageUrl: 'https://picsum.photos/seed/sg3/300/500',
      imageWidth: 300,
      imageHeight: 500,
      author: { id: 'a3', username: 'typo', displayName: 'Typo' },
      saveCount: 88,
      commentCount: 7,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sg-p4',
      title: 'Colors',
      imageUrl: 'https://picsum.photos/seed/sg4/300/350',
      imageWidth: 300,
      imageHeight: 350,
      author: { id: 'a4', username: 'color', displayName: 'Color' },
      saveCount: 200,
      commentCount: 22,
      createdAt: new Date().toISOString(),
    },
  ];

  readonly mockBoards: Board[] = [
    {
      id: 'b1',
      name: 'UI Inspiration',
      pinsCount: 48,
      coverImages: [
        'https://picsum.photos/seed/b1a/200/200',
        'https://picsum.photos/seed/b1b/200/200',
        'https://picsum.photos/seed/b1c/200/200',
      ],
      owner: { id: 'a1', username: 'ana.silva', displayName: 'Ana Silva' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b2',
      name: 'Arquitetura',
      pinsCount: 22,
      coverImageUrl: 'https://picsum.photos/seed/b2/400/220',
      owner: { id: 'a1', username: 'ana.silva', displayName: 'Ana Silva' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b3',
      name: 'Tipografia',
      pinsCount: 15,
      coverImages: [
        'https://picsum.photos/seed/b3a/200/200',
        'https://picsum.photos/seed/b3b/200/200',
      ],
      owner: { id: 'a1', username: 'ana.silva', displayName: 'Ana Silva' },
      createdAt: new Date().toISOString(),
    },
  ];

  readonly selectOptions: SelectOption[] = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  readonly nav: NavItem[] = [
    {
      id: 'utilities',
      label: 'Utilities',
      icon: 'build',
      children: [
        { id: 'display', label: 'Display', icon: 'grid_on' },
        {
          id: 'spacing',
          label: 'Spacing',
          icon: 'space_bar',
          children: [
            { id: 'padding', label: 'Padding' },
            { id: 'margin', label: 'Margin' },
            { id: 'gap', label: 'Gap' },
          ],
        },
        { id: 'flexbox', label: 'Flexbox', icon: 'view_column' },
        { id: 'border-radius', label: 'Border Radius', icon: 'rounded_corner' },
        { id: 'shadow', label: 'Shadow', icon: 'layers' },
        { id: 'sizing', label: 'Sizing', icon: 'straighten' },
        { id: 'overflow', label: 'Overflow', icon: 'more_horiz' },
        { id: 'opacity', label: 'Opacity', icon: 'opacity' },
        {
          id: 'typography',
          label: 'Typography',
          icon: 'text_fields',
          children: [
            { id: 'font-size', label: 'Font Size' },
            { id: 'font-weight', label: 'Font Weight' },
            { id: 'text-align', label: 'Text Align' },
            { id: 'text-color', label: 'Text Color' },
          ],
        },
        { id: 'background', label: 'Background', icon: 'format_color_fill' },
      ],
    },
    {
      id: 'standard',
      label: 'Standard Classes',
      icon: 'list_alt',
      children: [
        { id: 'icons', label: 'Icons', icon: 'emoji_symbols' },
        { id: 'skeleton', label: 'Skeleton', icon: 'blur_on' },
        { id: 'tooltip', label: 'Tooltip', icon: 'tooltip' },
        { id: 'links', label: 'Links', icon: 'link' },
        { id: 'titles', label: 'Titles', icon: 'title' },
      ],
    },
    {
      id: 'design-tokens',
      label: 'Design Tokens',
      icon: 'palette',
      children: [
        { id: 'colors', label: 'Colors', icon: 'palette' },
        { id: 'spacing-tokens', label: 'Spacing', icon: 'space_bar' },
        { id: 'radius-tokens', label: 'Border Radius', icon: 'rounded_corner' },
        { id: 'typography-tokens', label: 'Typography', icon: 'text_fields' },
      ],
    },
    {
      id: 'components',
      label: 'Components',
      icon: 'widgets',
      children: [
        { id: 'comp-button', label: 'Button', icon: 'touch_app' },
        { id: 'comp-input', label: 'Input', icon: 'input' },
        { id: 'comp-textarea', label: 'Textarea', icon: 'notes' },
        { id: 'comp-select', label: 'Select', icon: 'arrow_drop_down_circle' },
        { id: 'comp-radio-group', label: 'Radio Group', icon: 'radio_button_checked' },
        { id: 'comp-checkbox-group', label: 'Checkbox Group', icon: 'check_box' },
        { id: 'comp-divider', label: 'Divider', icon: 'horizontal_rule' },
        { id: 'comp-card', label: 'Card', icon: 'credit_card' },
        { id: 'comp-user-avatar', label: 'User Avatar', icon: 'account_circle' },
        { id: 'comp-empty-state', label: 'Empty State', icon: 'inbox' },
        { id: 'comp-drawer', label: 'Drawer', icon: 'side_navigation' },
        { id: 'comp-search-bar', label: 'Search Bar', icon: 'search' },
        { id: 'comp-follow-button', label: 'Follow Button', icon: 'person_add' },
        { id: 'comp-skeleton-loader', label: 'Skeleton Loader', icon: 'blur_on' },
        { id: 'comp-masonry-grid', label: 'Masonry Grid', icon: 'grid_view' },
        { id: 'comp-tabs', label: 'Tabs', icon: 'tab' },
        { id: 'comp-popover', label: 'Popover', icon: 'chat_bubble_outline' },
        { id: 'comp-upload-area', label: 'Upload Area', icon: 'upload_file' },
        { id: 'comp-code-digits', label: 'Code Digits', icon: 'pin' },
        { id: 'comp-button-like', label: 'Button Like', icon: 'favorite_border' },
        { id: 'comp-infinite-scroll', label: 'Infinite Scroll', icon: 'all_inclusive' },
        { id: 'comp-notification-item', label: 'Notification Item', icon: 'notifications' },
        { id: 'comp-button-inscription', label: 'Button Inscription', icon: 'how_to_reg' },
        { id: 'comp-button-provider', label: 'Button Provider', icon: 'login' },
        { id: 'comp-card-board', label: 'Card Board', icon: 'dashboard' },
        { id: 'comp-chip-scroll', label: 'Chip Scroll', icon: 'filter_list' },
        { id: 'comp-splitbutton', label: 'Split Button', icon: 'call_split' },
        { id: 'comp-pin-card', label: 'Pin Card', icon: 'image' },
        { id: 'comp-sidebar', label: 'Sidebar', icon: 'dock_to_left' },
        { id: 'comp-topbar', label: 'Topbar', icon: 'web_asset' },
        { id: 'comp-button-upload', label: 'Button Upload', icon: 'upload_file' },
        { id: 'comp-spinner-steps', label: 'Spinner Steps', icon: 'rotate_right' },
        { id: 'comp-toggle-switch', label: 'Toggle Switch', icon: 'toggle_on' },
        { id: 'comp-toggle-check', label: 'Toggle Check', icon: 'check_circle' },
        { id: 'comp-section-list', label: 'Section List', icon: 'format_list_bulleted' },
      ],
    },
  ];

  toggleGroup(id: string): void {
    this.expandedGroups.update((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  selectSearchResult(id: string): void {
    this.searchQuery.set('');
    this.searchActive.set(false);
    this.router.navigate(['/styleguide', id]);
  }

  onSearchBlur(): void {
    setTimeout(() => this.searchActive.set(false), 150);
  }

  navigate(id: string): void {
    this.router.navigate(['/styleguide', id]);
  }

  private autoExpand(id: string): void {
    for (const group of this.nav) {
      const childIds = this.flatIds(group.children ?? []);
      if (childIds.includes(id)) {
        this.expandedGroups.update((s) => {
          const n = new Set(s);
          n.add(group.id);
          return n;
        });
      }
      for (const child of group.children ?? []) {
        const grandIds = this.flatIds(child.children ?? []);
        if (grandIds.includes(id)) {
          this.expandedGroups.update((s) => {
            const n = new Set(s);
            n.add(group.id);
            n.add(child.id);
            return n;
          });
        }
      }
    }
  }

  copyCode(code: string): void {
    const markCopied = () => {
      this.copiedCode.set(code);
      setTimeout(() => this.copiedCode.set(null), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(markCopied)
        .catch(() => this.fallbackCopy(code, markCopied));
    } else {
      this.fallbackCopy(code, markCopied);
    }
  }

  private fallbackCopy(code: string, onSuccess: () => void): void {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } finally {
      document.body.removeChild(textarea);
    }
  }

  private flatIds(items: NavItem[]): string[] {
    return items.flatMap((i) => [i.id, ...this.flatIds(i.children ?? [])]);
  }

  toggleDark(): void {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.isDark());
  }

  // ── Data ──────────────────────────────────────────────────────────────────

  readonly displayClasses: ClassRow[] = [
    { cls: '.d-flex', properties: 'display: flex' },
    { cls: '.d-block', properties: 'display: block' },
    { cls: '.d-none', properties: 'display: none' },
    { cls: '.d-grid', properties: 'display: grid' },
    { cls: '.flex', properties: 'display: flex' },
  ];

  readonly flexboxClasses: ClassRow[] = [
    { cls: '.flex-row', properties: 'flex-direction: row' },
    { cls: '.flex-row-reverse', properties: 'flex-direction: row-reverse' },
    { cls: '.flex-col', properties: 'flex-direction: column' },
    { cls: '.flex-col-reverse', properties: 'flex-direction: column-reverse' },
    { cls: '.flex-wrap', properties: 'flex-wrap: wrap' },
    { cls: '.flex-1', properties: 'flex: 1' },
    { cls: '.flex-shrink-0', properties: 'flex-shrink: 0' },
    { cls: '.align-center', properties: 'align-items: center' },
    { cls: '.align-start', properties: 'align-items: flex-start' },
    { cls: '.align-end', properties: 'align-items: flex-end' },
    { cls: '.align-stretch', properties: 'align-items: stretch' },
    { cls: '.justify-center', properties: 'justify-content: center' },
    { cls: '.justify-start', properties: 'justify-content: flex-start' },
    { cls: '.justify-end', properties: 'justify-content: flex-end' },
    { cls: '.justify-between', properties: 'justify-content: space-between' },
    { cls: '.justify-around', properties: 'justify-content: space-around' },
  ];

  readonly paddingClasses: ClassRow[] = [
    { cls: '.p-1', properties: 'padding: var(--space-xs) → 4px' },
    { cls: '.p-2', properties: 'padding: var(--space-sm) → 8px' },
    { cls: '.p-3', properties: 'padding: var(--space-md) → 12px' },
    { cls: '.p-4', properties: 'padding: var(--space-lg) → 16px' },
    { cls: '.p-5', properties: 'padding: var(--space-xl) → 20px' },
    { cls: '.p-6', properties: 'padding: var(--space-2xl) → 24px' },
    { cls: '.p-7', properties: 'padding: var(--space-3xl) → 32px' },
    { cls: '.p-8', properties: 'padding: var(--space-4xl) → 48px' },
    { cls: '.p-9', properties: 'padding: var(--space-5xl) → 64px' },
    { cls: '.pt-*', properties: 'padding-top (xs → 5xl)' },
    { cls: '.pb-*', properties: 'padding-bottom (xs → 5xl)' },
    { cls: '.pl-*', properties: 'padding-left (xs → 5xl)' },
    { cls: '.pr-*', properties: 'padding-right (xs → 5xl)' },
    { cls: '.px-*', properties: 'padding-left + padding-right (xs → 5xl)' },
    { cls: '.py-*', properties: 'padding-top + padding-bottom (xs → 5xl)' },
  ];

  readonly marginClasses: ClassRow[] = [
    { cls: '.m-1', properties: 'margin: var(--space-xs) → 4px' },
    { cls: '.m-2', properties: 'margin: var(--space-sm) → 8px' },
    { cls: '.m-3', properties: 'margin: var(--space-md) → 12px' },
    { cls: '.m-4', properties: 'margin: var(--space-lg) → 16px' },
    { cls: '.m-5', properties: 'margin: var(--space-xl) → 20px' },
    { cls: '.m-6', properties: 'margin: var(--space-2xl) → 24px' },
    { cls: '.m-7', properties: 'margin: var(--space-3xl) → 32px' },
    { cls: '.m-8', properties: 'margin: var(--space-4xl) → 48px' },
    { cls: '.m-9', properties: 'margin: var(--space-5xl) → 64px' },
    { cls: '.mt-*', properties: 'margin-top (xs → 5xl)' },
    { cls: '.mb-*', properties: 'margin-bottom (xs → 5xl)' },
    { cls: '.ml-*', properties: 'margin-left (xs → 5xl)' },
    { cls: '.mr-*', properties: 'margin-right (xs → 5xl)' },
    { cls: '.mx-*', properties: 'margin-left + margin-right (xs → 5xl)' },
    { cls: '.my-*', properties: 'margin-top + margin-bottom (xs → 5xl)' },
  ];

  readonly gapClasses: ClassRow[] = [
    { cls: '.gap-1', properties: 'gap: var(--space-xs) → 4px' },
    { cls: '.gap-2', properties: 'gap: var(--space-sm) → 8px' },
    { cls: '.gap-3', properties: 'gap: var(--space-md) → 12px' },
    { cls: '.gap-4', properties: 'gap: var(--space-lg) → 16px' },
    { cls: '.gap-5', properties: 'gap: var(--space-xl) → 20px' },
    { cls: '.gap-6', properties: 'gap: var(--space-2xl) → 24px' },
    { cls: '.gap-7', properties: 'gap: var(--space-3xl) → 32px' },
    { cls: '.gap-8', properties: 'gap: var(--space-4xl) → 48px' },
    { cls: '.gap-9', properties: 'gap: var(--space-5xl) → 64px' },
  ];

  readonly radiusClasses: ClassRow[] = [
    { cls: '.radius-0', properties: 'border-radius: var(--radius-none) → 0px' },
    { cls: '.radius-1', properties: 'border-radius: var(--radius-xs) → 4px' },
    { cls: '.radius-2', properties: 'border-radius: var(--radius-sm) → 8px' },
    { cls: '.radius-3', properties: 'border-radius: var(--radius-md) → 12px' },
    { cls: '.radius-4', properties: 'border-radius: var(--radius-lg) → 16px' },
    { cls: '.radius-5', properties: 'border-radius: var(--radius-xl) → 24px' },
    { cls: '.radius-6', properties: 'border-radius: var(--radius-2xl) → 32px' },
    { cls: '.radius-circle', properties: 'border-radius: var(--radius-circle) → 50%' },
    { cls: '.radius-pill', properties: 'border-radius: var(--radius-pill) → 9999px' },
  ];

  readonly shadowClasses: ClassRow[] = [
    { cls: '.shadow-1', properties: 'box-shadow: 0 1px 4px rgba(0,0,0,0.08)' },
    { cls: '.shadow-2', properties: 'box-shadow: 0 4px 16px rgba(0,0,0,0.12)' },
    { cls: '.shadow-3', properties: 'box-shadow: 0 8px 32px rgba(0,0,0,0.16)' },
  ];

  readonly sizingClasses: ClassRow[] = [
    { cls: '.w-full', properties: 'width: 100%' },
    { cls: '.h-full', properties: 'height: 100%' },
  ];

  readonly overflowClasses: ClassRow[] = [
    { cls: '.overflow-hidden', properties: 'overflow: hidden' },
    { cls: '.overflow-auto', properties: 'overflow-y: auto' },
  ];

  readonly opacityClasses: ClassRow[] = [
    { cls: '.opacity-disabled', properties: 'opacity: var(--opacity-disabled) → 0.5' },
    { cls: '.opacity-muted', properties: 'opacity: var(--opacity-muted) → 0.6' },
  ];

  readonly fontSizeClasses: ClassRow[] = [
    { cls: '.text-3xs', properties: 'font-size: var(--text-3xs) → 0.65rem' },
    { cls: '.text-2xs', properties: 'font-size: var(--text-2xs) → 0.75rem' },
    { cls: '.text-1', properties: 'font-size: var(--text-xs) → 0.8rem' },
    { cls: '.text-2', properties: 'font-size: var(--text-sm) → 0.875rem' },
    { cls: '.text-3', properties: 'font-size: var(--text-md) → 0.9rem' },
    { cls: '.text-base', properties: 'font-size: var(--text-base) → 0.95rem' },
    { cls: '.text-4', properties: 'font-size: var(--text-lg) → 1rem' },
    { cls: '.text-5', properties: 'font-size: var(--text-xl) → 1.25rem' },
    { cls: '.text-6', properties: 'font-size: var(--text-2xl) → 1.5rem' },
    { cls: '.text-7', properties: 'font-size: var(--text-3xl) → 1.75rem' },
    { cls: '.text-4xl', properties: 'font-size: var(--text-4xl) → 2rem' },
    { cls: '.text-5xl', properties: 'font-size: var(--text-5xl) → 2.5rem' },
    { cls: '.text-6xl', properties: 'font-size: var(--text-6xl) → 3rem' },
    { cls: '.text-7xl', properties: 'font-size: var(--text-7xl) → 4rem' },
  ];

  readonly fontWeightClasses: ClassRow[] = [
    { cls: '.fw-normal', properties: 'font-weight: var(--font-weight-normal) → 400' },
    { cls: '.fw-medium', properties: 'font-weight: var(--font-weight-medium) → 500' },
    { cls: '.fw-semibold', properties: 'font-weight: var(--font-weight-semibold) → 600' },
    { cls: '.fw-bold', properties: 'font-weight: var(--font-weight-bold) → 700' },
  ];

  readonly textAlignClasses: ClassRow[] = [
    { cls: '.text-center', properties: 'text-align: center' },
    { cls: '.text-left', properties: 'text-align: left' },
    { cls: '.text-right', properties: 'text-align: right' },
    { cls: '.text-justify', properties: 'text-align: justify' },
    {
      cls: '.text-ellipsis',
      properties: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap',
    },
  ];

  readonly textColorClasses: ClassRow[] = [
    { cls: '.text-color-accent', properties: 'color: var(--pin-red) → #E60023' },
    { cls: '.text-color-inverse', properties: 'color: var(--pin-text-inverse)' },
    { cls: '.text-color-inverse-1', properties: 'color: var(--pin-text-inverse-1)' },
    { cls: '.text-color-inverse-2', properties: 'color: var(--pin-text-inverse-2)' },
    { cls: '.text-color-reverse', properties: 'color: var(--pin-text-reverse)' },
    { cls: '.text-color-reverse-1', properties: 'color: var(--pin-text-reverse-1)' },
    { cls: '.text-color-reverse-2', properties: 'color: var(--pin-text-reverse-2)' },
    { cls: '.pin-red', properties: 'color: var(--pin-red) → #E60023' },
    { cls: '.pin-red-dark', properties: 'color: var(--pin-red-dark) → #AD081B' },
    { cls: '.pin-red-light', properties: 'color: var(--pin-red-light) → #FF4747' },
    { cls: '.pin-red-hover', properties: 'color: var(--pin-red-hover) → #CC001F' },
  ];

  readonly backgroundClasses: ClassRow[] = [
    { cls: '.bg-secondary', properties: 'background: var(--pin-bg-secondary)' },
    { cls: '.bg-reverse', properties: 'background: var(--bg-reverse)' },
    { cls: '.bg-reverse-1', properties: 'background: var(--bg-reverse-1)' },
    { cls: '.bg-reverse-2', properties: 'background: var(--bg-reverse-2)' },
    { cls: '.bg-inverse', properties: 'background: var(--bg-inverse)' },
    { cls: '.bg-inverse-1', properties: 'background: var(--bg-inverse-1)' },
    { cls: '.bg-inverse-2', properties: 'background: var(--bg-inverse-2)' },
  ];

  readonly designColors = [
    { name: '--pin-red', value: '#E60023', label: 'Brand Red' },
    { name: '--pin-red-dark', value: '#AD081B', label: 'Red Dark' },
    { name: '--pin-red-light', value: '#FF4747', label: 'Red Light' },
    { name: '--pin-red-hover', value: '#CC001F', label: 'Red Hover' },
    { name: '--pin-bg', value: '#ffffff / #1A1A1A', label: 'Background' },
    { name: '--pin-bg-secondary', value: '#F0F0F0 / #2D2D2D', label: 'Bg Secondary' },
    { name: '--pin-bg-tertiary', value: '#F8F8F8 / #222222', label: 'Bg Tertiary' },
    { name: '--pin-text-primary', value: '#111111 / #EFEFEF', label: 'Text Primary' },
    { name: '--pin-text-secondary', value: '#767676 / #ADADAD', label: 'Text Secondary' },
    { name: '--pin-text-muted', value: '#ADADAD / #767676', label: 'Text Muted' },
    { name: '--pin-border', value: '#E0E0E0 / #404040', label: 'Border' },
    { name: '--pin-color-error', value: '#e53e3e', label: 'Error' },
    { name: '--pin-color-success', value: '#00a000', label: 'Success' },
  ];

  readonly spacingTokens = [
    { name: '--space-xs', value: '4px' },
    { name: '--space-sm', value: '8px' },
    { name: '--space-md', value: '12px' },
    { name: '--space-lg', value: '16px' },
    { name: '--space-xl', value: '20px' },
    { name: '--space-2xl', value: '24px' },
    { name: '--space-3xl', value: '32px' },
    { name: '--space-4xl', value: '48px' },
    { name: '--space-5xl', value: '64px' },
  ];

  readonly radiusTokens = [
    { name: '--radius-none', value: '0px' },
    { name: '--radius-xs', value: '4px' },
    { name: '--radius-sm', value: '8px' },
    { name: '--radius-md', value: '12px' },
    { name: '--radius-lg', value: '16px' },
    { name: '--radius-xl', value: '24px' },
    { name: '--radius-2xl', value: '32px' },
    { name: '--radius-circle', value: '50%' },
    { name: '--radius-pill', value: '9999px' },
  ];

  readonly typographyTokens = [
    { name: '--text-3xs', value: '0.65rem' },
    { name: '--text-2xs', value: '0.75rem' },
    { name: '--text-xs', value: '0.8rem' },
    { name: '--text-sm', value: '0.875rem' },
    { name: '--text-md', value: '0.9rem' },
    { name: '--text-base', value: '0.95rem' },
    { name: '--text-lg', value: '1rem' },
    { name: '--text-xl', value: '1.25rem' },
    { name: '--text-2xl', value: '1.5rem' },
    { name: '--text-3xl', value: '1.75rem' },
    { name: '--text-4xl', value: '2rem' },
    { name: '--text-5xl', value: '2.5rem' },
    { name: '--text-6xl', value: '3rem' },
    { name: '--text-7xl', value: '4rem' },
  ];

  readonly iconSizes = [
    { cls: 'icon-sm', size: '1.25rem', label: 'Small' },
    { cls: 'icon-md', size: '1.5rem', label: 'Medium' },
    { cls: 'icon-lg', size: '2rem', label: 'Large' },
    { cls: 'icon-xl', size: '2.5rem', label: 'XL' },
  ];

  readonly sampleIcons = [
    'home',
    'search',
    'favorite',
    'bookmark',
    'share',
    'add',
    'close',
    'menu',
    'arrow_back',
    'notifications',
    'person',
    'settings',
    'edit',
    'delete',
    'visibility',
  ];
}
