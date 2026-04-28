# Winning-Slots

## 1. Visão Geral

### O que é

**Winning-slots** são "cartas curinga" que a plataforma RealWe insere automaticamente nos espaços vazios da grade da home, garantindo que ela apareça sempre completa, fluida e visualmente consistente.

Cada slot pode ser:

- um **vídeo** (recomendação editorial),
- uma **imagem** (anúncio ou promoção),
- um **bloco HTML** (newsletter, dica, banner informativo) ou
- um **componente interativo** (enquete, formulário de inscrição etc).

Diferente dos posts comuns — que são produzidos pelos colaboradores das empresas — os winning-slots são conteúdos **estratégicos**, escolhidos pela plataforma para preencher buracos visuais de forma útil para o usuário.

### Como funciona, em uma frase

Ao montar o feed, o sistema simula como os posts vão se encaixar na grade e, sempre que detecta uma linha incompleta, escolhe um winning-slot do tamanho certo (vertical 9:16 ou horizontal 16:9) para fechar o espaço.

### Onde se encaixa no produto

A funcionalidade vive na **home da RealWe**, dentro do feed principal — o mesmo espaço onde o usuário descobre shorts, vídeos longos, vagas, treinamentos e conteúdos institucionais. Ela é invisível como mecânica: o usuário simplesmente vê uma grade sempre bonita.

```
┌────────── Feed da Home ──────────┐
│  [post]  [post]  [winning-slot]  │  ← linha completa
│  [post]      [post]              │  ← linha completa
│  [post]  [post]  [winning-slot]  │
│  [post]                          │  ← última linha (não preenche)
└──────────────────────────────────┘
```

---

## 2. Propósito

### Por que essa funcionalidade existe

A grade da home é dinâmica: posts variam entre dois formatos (vertical 9:16 e horizontal 16:9), e nem sempre o conjunto que chega da API consegue formar linhas perfeitas. Sem nenhum tratamento, a grade ficava com **buracos visíveis** — espaços em branco que quebravam a sensação de descoberta infinita.

Esses buracos eram um problema porque:

- **Quebravam a estética minimalista** inspirada no Pinterest, que é um pilar de design do produto.
- **Reduziam a densidade de conteúdo** percebida — a página parecia "mais vazia" do que realmente era.
- **Confundiam o usuário** — um espaço em branco em uma plataforma de descoberta sugere que algo deu errado.

### Qual problema resolve

> _"Como manter a grade sempre completa e atraente, mesmo quando os posts disponíveis não fecham a linha?"_

Winning-slots resolvem isso transformando o gap em **oportunidade**: em vez de mostrar nada, mostram algo de valor — uma recomendação que pode interessar ao usuário, um anúncio relevante ou uma dica útil.

### Qual necessidade do usuário atende

- **Continuidade visual**: o usuário rola pela home e nunca encontra "vácuo" — a experiência é fluida.
- **Descoberta ampliada**: além dos posts dos colaboradores, ele encontra conteúdos selecionados pela plataforma (treinamentos, eventos, vagas em destaque).
- **Relevância controlada**: como cada slot é classificado (`ad`, `recommendation`, `informative`, `interactive`), a plataforma pode equilibrar o que entra para evitar saturação publicitária.

---

## 3. Objetivo

### O que se espera alcançar

1. **Grade 100% preenchida** sempre que houver mais de uma linha de conteúdo.
2. **Encaixe determinístico** — a mesma combinação de posts gera sempre o mesmo feed, garantindo previsibilidade para QA, analytics e testes A/B.
3. **Zero impacto perceptível na performance**: nenhum round-trip extra, nada de "remendos" depois que o layout já apareceu.
4. **Flexibilidade de evolução**: novos formatos (imagem, HTML, componente) podem ser adicionados sem mexer na lógica do feed.

### Benefícios diretos para o usuário

| Antes | Depois |
|---|---|
| Grade com buracos brancos | Grade sempre completa |
| Apenas conteúdo dos colaboradores | Conteúdo + recomendações editoriais + ofertas relevantes |
| Sensação de "página vazia" | Sensação de descoberta contínua |
| Anúncios disruptivos no meio do feed | Anúncios discretos, no formato exato dos cards |

### Benefícios para o negócio / plataforma

- **Receita de mídia**: abre um inventário de anúncios nativos, indistinguíveis em forma dos posts orgânicos — sem prejudicar a experiência.
- **Curadoria editorial**: a plataforma ganha um canal para destacar conteúdos estratégicos (eventos, treinamentos, vagas com SLA), sempre alinhado ao funil de descoberta → profundidade → conversão → comunidade.
- **Engajamento**: slots interativos (enquetes, newsletter signup) viram pontos de conversão dentro do próprio feed.
- **Métricas mais limpas**: cada slot tem id e tipo (`slotKind`), permitindo medir CTR, impressões e qualidade da curadoria por categoria.

### Indicadores que validam a feature

- **% de gaps preenchidos** — meta: 100% das linhas intermediárias com mais de uma linha no feed.
- **CTR de slots** segmentado por `slotKind` (`ad`, `recommendation`, `informative`, `interactive`).
- **Tempo médio na home** comparado com a versão sem winning-slots.
- **Taxa de scroll profundo** (proxy para "a grade me convidou a continuar").

---

## Princípios não-negociáveis

1. **Composição na origem, nunca pós-renderização.** O feed já chega ao componente com os slots encaixados; a tela nunca "remenda" depois.
2. **Última linha sempre intocada.** Linhas terminais ficam como vieram — slot de fechamento ali viraria poluição visual.
3. **Linha única não preenche.** Se o usuário tem só um punhado de posts, a home respeita o vazio em vez de forçar conteúdo.
4. **Slots respeitam o formato do gap.** Um buraco vertical é preenchido com 9:16; um buraco largo, com 16:9. Nunca há "esticamento".
5. **Determinismo > criatividade.** A mesma entrada gera a mesma saída — fácil de auditar, fácil de testar.

---

## Para desenvolvedores: ponteiros de código

| Camada | Arquivo |
|---|---|
| Mock de dados | [api-server/src/data/winning-slots.js](../../api-server/src/data/winning-slots.js) |
| Rota REST | [api-server/src/routes/winning-slots.js](../../api-server/src/routes/winning-slots.js) — `GET /api/winning-slots` |
| Entity / DTO / Map | [src/app/shared/interfaces/entity/winning-slot.ts](../../src/app/shared/interfaces/entity/winning-slot.ts), [.../dto/response/winning-slot.ts](../../src/app/shared/interfaces/dto/response/winning-slot.ts), [maps/winning-slot.map.ts](../../src/app/shared/maps/winning-slot.map.ts) |
| HTTP service | [src/app/shared/apis/winning-slots.api.ts](../../src/app/shared/apis/winning-slots.api.ts) |
| **Lógica de composição** | [src/app/shared/services/feed-composer.service.ts](../../src/app/shared/services/feed-composer.service.ts) |
| Renderer | [src/app/shared/components/winning-slot-card/](../../src/app/shared/components/winning-slot-card/) |
| Integração na home | [src/app/domain/home/pages/home/home.component.ts](../../src/app/domain/home/pages/home/home.component.ts) |

Para detalhes da regra de encaixe (tabela determinística por padrão `(H, V)`), ver `FILL_RULES` em [feed-composer.service.ts](../../src/app/shared/services/feed-composer.service.ts).
