O que foi implementado
IA do módulo (4 rotas)
Rota	Página	Função
/sponsored-campaigns	Hub	Tabs Em andamento / Histórico com cards de campanhas, CTAs "Nova campanha" e "Ver métricas"
/sponsored-campaigns/new	Wizard 4 steps	Palavra-chave → Janela+horas → Vídeo → Checkout → "Iniciar Campanha Patrocinada"
/sponsored-campaigns/success/:id	Sucesso	Tela de confirmação com resumo + CTAs para acompanhar performance ou voltar ao hub
/sponsored-campaigns/:id	Detalhe + Projeção	Performance ao vivo, projeção (se ainda pending), pagamento, vídeo, botão Cancelar
Wizard — destaque é o calendário de preços
pricing-calendar.component.ts renderiza heatmap 31×24 clicável:

Backend devolve {days: [{date, hours:[{hour,price,status}]}]} — frontend só renderiza, conforme decidido.
Faixas de preço (baixo/médio/alto) calculadas client-side por terço estatístico para colorir as células.
Status reserved (hachurado) e sold (cinza) bloqueiam clique.
Click no nome do dia seleciona/limpa o dia inteiro.
Total atualiza ao vivo no painel da step 2.
Regras de preço no backend (data/campaigns.js):

Horário: 21h-05h baixo (factor 1.0) · 06h-13h alto (2.4) · 14h-20h médio (1.5)
Dia do mês: 1-9 alto (1.6) · 10-25 baixo (1.0) · 26-31 médio (1.2)
Preço final = BASE_PRICE × hora × dia (BASE = R$ 250)
Você pode ajustar a função priceFor() ou trocar pela matriz que vier do banco
Camada shared nova
enums/campaign-status.enum.ts (pending, scheduled, running, completed, cancelled, failed)
enums/hour-availability.enum.ts (available, reserved, sold)
entity/campaign.ts, dto/request/campaigns.ts, dto/response/campaigns.ts, maps/campaign.map.ts, apis/campaigns.api.ts
Reaproveitados do código anterior (apoio ao wizard): sponsored-eligibility-list, sponsored-score-panel, sponsored-rules-strip.

Backend mock — 7 endpoints
GET /api/v1/sponsored-campaigns/campaigns — listagem (hub)
GET /api/v1/sponsored-campaigns/campaigns/:id — detalhe
POST /api/v1/sponsored-campaigns/campaigns — criar (wizard)
PATCH /api/v1/sponsored-campaigns/campaigns/:id/cancel — cancelar
GET /api/v1/sponsored-campaigns/pricing-calendar?keyword=&from= — grid 31×24 com preços
GET /api/v1/sponsored-campaigns/eligible-videos — vídeos elegíveis
POST /api/v1/sponsored-campaigns/projection — projeção pré-checkout (impressões, cliques, conversões, prob. de vencer)
5 campanhas mock pré-cadastradas (1 running com perf real, 1 scheduled, 1 pending sem cartão, 1 completed no histórico, 1 cancelled) para você navegar entre as tabs e ver os estados.

Files apagados (marketplace antigo, ainda não comitado)
sponsored-campaigns/pages/sponsored-campaigns/
components/sponsored-hero/, components/sponsored-filters/, components/sponsored-slot-card/
services/sponsored-campaigns.store.ts + facade.ts
shared/apis/sponsored-campaigns.api.ts, enums/sponsored-slot-status.enum.ts
api-server/src/{data,routes}/sponsored-campaigns.js
Para testar: npm run start + npm start no api-server/ → menu → "Para você" → "Campanhas Patrocinadas" → "Nova campanha".