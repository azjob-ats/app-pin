import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { CampaignStatusBadgeComponent } from '@domain/sponsored-campaigns/components/campaign-status-badge/campaign-status-badge.component';
import { CampaignDetailFacade } from '@domain/sponsored-campaigns/services/campaign-detail.facade';

@Component({
  selector: 'app-campaign-success',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, CurrencyPipe, RouterLink, CampaignStatusBadgeComponent],
  template: `
    <section class="campaign-success" aria-labelledby="campaign-success-title">
      <div class="campaign-success__container">
        <div class="campaign-success__icon" aria-hidden="true">
          <span class="material-symbols-rounded">check_circle</span>
        </div>

        <h1 class="campaign-success__title" id="campaign-success-title">
          Campanha Patrocinada com sucesso
        </h1>

        @if (campaign(); as c) {
          <p class="campaign-success__subtitle">
            Sua campanha <strong>"{{ c.keyword }}"</strong> foi criada e já aparece no seu
            histórico.
          </p>

          <div class="campaign-success__card">
            <header class="campaign-success__card-head">
              <app-campaign-status-badge [status]="c.status" />
              <span class="campaign-success__id">#{{ c.id }}</span>
            </header>

            <div class="campaign-success__row">
              <img
                class="campaign-success__thumb"
                [src]="c.video.thumbnailUrl"
                alt=""
                loading="lazy"
              />
              <div class="campaign-success__body">
                <h2 class="campaign-success__video-title">{{ c.video.title }}</h2>
                <p class="campaign-success__credit">
                  {{ c.video.channelName }} <span class="campaign-success__by">by</span>
                  {{ c.video.creatorName }}
                </p>
              </div>
            </div>

            <dl class="campaign-success__stats">
              <div>
                <dt>Janela</dt>
                <dd>
                  {{ c.windowFrom | date: 'dd MMM' }}
                  →
                  {{ c.windowTo | date: 'dd MMM' }}
                </dd>
              </div>
              <div>
                <dt>Horas</dt>
                <dd>{{ c.hours.length }}</dd>
              </div>
              <div>
                <dt>Investimento</dt>
                <dd class="campaign-success__amount">
                  {{ c.totalCost | currency: 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
                </dd>
              </div>
            </dl>

            @if (!c.card) {
              <div class="campaign-success__warn">
                <span class="material-symbols-rounded" aria-hidden="true">credit_card_off</span>
                <p>
                  Sem cartão configurado. A campanha fica pendente até você cadastrar um
                  cartão para débito.
                </p>
              </div>
            }
          </div>

          <div class="campaign-success__actions">
            <a class="campaign-success__btn campaign-success__btn--primary" [routerLink]="detailLink()">
              Acompanhar performance
              <span aria-hidden="true">→</span>
            </a>
            <a class="campaign-success__btn campaign-success__btn--ghost" [routerLink]="hubLink">
              Ver todas as campanhas
            </a>
          </div>
        } @else {
          <p class="campaign-success__subtitle">Campanha criada. Aparece no seu histórico.</p>
          <a class="campaign-success__btn campaign-success__btn--primary" [routerLink]="hubLink">
            Ver minhas campanhas
            <span aria-hidden="true">→</span>
          </a>
        }
      </div>
    </section>
  `,
  styleUrl: './campaign-success.component.scss',
})
export class CampaignSuccessComponent implements OnInit {
  private readonly facade = inject(CampaignDetailFacade);
  private readonly route = inject(ActivatedRoute);

  readonly campaign = this.facade.campaign;

  readonly hubLink = `/${environment.ROUTES.SPONSORED_CAMPAIGNS.ROOT}`;

  readonly detailLink = computed(() => {
    const c = this.campaign();
    if (!c) return this.hubLink;
    return `/${environment.ROUTES.SPONSORED_CAMPAIGNS.DETAIL_PATH}/${c.id}`;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.load(id);
  }
}
