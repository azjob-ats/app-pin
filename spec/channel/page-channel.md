# Página Channel — Documentação

---

## 1. Visão Geral

A **página Channel** é o espaço institucional de cada empresa, organização ou criador autorizado dentro da RealWe. É onde o canal se apresenta ao mundo e organiza tudo o que publica em dois eixos: a **Galeria** (todas as suas mídias e publicações) e a **Coleção** (agrupamentos temáticos curados).

Cada canal tem um endereço próprio e fixo na URL (`/:profileName`) — o que torna o canal um destino reconhecível e compartilhável, e não apenas um identificador de autoria nos posts.

### Onde se encaixa no produto

A RealWe opera em quatro estágios de engajamento:

```
Descoberta → Profundidade → Conversão → Comunidade
```

A página Channel atua como **âncora de autoridade** entre os quatro estágios. É o ponto onde o usuário, depois de descobrir um conteúdo no feed ou na vitrine, pode entender quem o publicou, ver tudo o que aquele canal já produziu e decidir se quer seguir e voltar.

### Distinção em relação a "perfil de usuário"

Antes desta funcionalidade, a tela `:username` representava simultaneamente conta de pessoa e canal de empresa, o que misturava dois conceitos com regras de negócio diferentes. A página Channel separa esses dois mundos:

| Conceito | O que é | Estado atual |
|---|---|---|
| **Channel** | Entidade publicável (empresa/organização) com seguidores, publicações, verificação | **Implementado** |
| **User Profile** | Conta pessoal com bio, pins salvos, painéis | Reservado para o futuro |

A rota `/:username` carrega hoje a página Channel. A página de perfil de usuário fica preservada para quando a plataforma abrir publicação para pessoas físicas além das empresariais.

---

## 2. Propósito

### Por que essa funcionalidade existe

A RealWe é construída sobre o princípio de que **pessoas confiam em pessoas** — e que empresas precisam mostrar como realmente trabalham. Para isso funcionar, cada empresa precisa de um espaço próprio onde a sua identidade, sua produção e sua autoridade ficam visíveis num só lugar.

A página Channel existe para dar a cada empresa esse espaço. Sem ela, a presença da empresa fica espalhada em posts isolados no feed, sem um destino consolidado que reforce reputação e construa relacionamento de longo prazo.

### Qual problema ela resolve

| Problema | Como a Channel resolve |
|---|---|
| Conteúdo da empresa fragmentado pelo feed | Reúne toda a produção do canal em um só endereço |
| Sem identidade visual da marca empregadora | Capa, foto, bio, link e selo de verificado |
| Difícil entender se o canal é oficial | Selo `verified` claro junto ao nome |
| Conteúdos relacionados se perdem | Tab `Coleção` mostra agrupamentos temáticos |
| Não há como "voltar a um canal" depois de descobrir um post | URL própria por canal (`/:profileName`) |
| Inscrição/follow precisa acontecer no canal, não no post | Botão `Inscrever-se` em destaque na página |

### Qual necessidade do usuário atende

- Conhecer a empresa por trás de um conteúdo que chamou atenção
- Avaliar a autoridade e a recorrência de produção do canal
- Encontrar em poucos cliques outros conteúdos da mesma empresa
- Seguir o canal para receber novidades sem precisar voltar ao feed
- Acessar canais oficiais (verificados) de marcas que já segue fora da plataforma

---

## 3. Objetivo

### O que se espera alcançar

A Channel tem três objetivos centrais, em ordem de prioridade:

1. **Identidade:** apresentar de forma clara e confiável quem é o canal
2. **Profundidade:** dar acesso a tudo o que foi publicado, agrupado de forma navegável
3. **Relacionamento:** transformar visitantes em inscritos e seguidores recorrentes

### Benefícios para o usuário

- Visão completa e organizada da produção da empresa
- Confiança rápida pela presença de selo, capa e bio oficiais
- Descoberta de séries temáticas (Coleções) sem depender do feed
- Controle direto sobre seguir ou deixar de seguir o canal

### Benefícios para o negócio

- Empresas ganham um endereço editorial permanente e compartilhável
- Aumenta a probabilidade de conversão de visitante em inscrito
- Centraliza métricas por canal (seguidores, publicações, engajamento)
- Reforça a separação Pessoas/Marcas exigida pelo modelo da plataforma
- Habilita futuras funcionalidades comerciais (canais patrocinados, planos, verificação paga)

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Acesso**
O usuário chega à página Channel por três caminhos principais:

- Clicando no avatar/nome do canal dentro de um post (componente `app-post-details`, na **Channel row**)
- Por busca direta da empresa
- Por link compartilhado externamente (URL canônica `/:profileName`)

URL padrão:

```
/:profileName
```

Exemplo: `/Digix`

**2. Carregamento**
Um skeleton com avatar, nome e linha de bio é exibido enquanto os dados do canal e seu conteúdo são carregados em paralelo (detalhe + galeria + coleção).

**3. Header do canal**
Assim que os dados chegam, o usuário vê:

- A **capa** do canal no topo
- O **avatar** sobrepondo a capa
- O **nome oficial** com selo de verificado, quando aplicável
- O **handle** (`@profileName`) logo abaixo
- Três métricas em destaque: **Seguidores**, **Publicações** e **Seguindo**
- A **bio/overview** do canal
- O **link externo** (visitWebsite) com ícone

**4. Ações principais**
Ao lado da bio aparecem os controles:

- **Inscrever-se** (botão principal de relacionamento)
- **Mensagem** (ícone de balão)
- **Compartilhar canal**
- **Mais opções** (denúncia, bloqueio, copiar link)

**5. Tabs de conteúdo**
Logo abaixo do header, duas tabs:

- **Galeria** — grid de todas as publicações do canal
- **Coleção** — grid de agrupamentos temáticos publicados pelo canal

A tab Galeria é a inicial.

**6. Galeria**
Cada item é um `app-pin-card-player-short`, idêntico ao do feed: thumbnail, autoplay no hover, métricas mínimas e link para a página `Watch` do conteúdo. O grid é responsivo (6 colunas no desktop, 2 no mobile) com itens em paisagem ocupando o dobro do espaço.

**7. Coleção**
Cada item é um `app-collection-bundle` com capa-mosaico (até três thumbnails), nome da coleção, contagem de itens e selo do canal. Clicar abre a página `Collection` daquele agrupamento.

**8. Estados especiais**
- Sem publicações: empty state com ícone `movie` e mensagem
- Sem coleções: empty state com ícone `collections_bookmark` e mensagem
- Canal não encontrado: rota cai no fluxo de 404 da shell

---

## 5. Principais Funcionalidades

### Header de identidade

| Elemento | Descrição |
|---|---|
| Capa | Imagem larga em topo (200px desktop, 140px mobile) |
| Avatar | Tamanho XL, com borda grossa, sobrepondo a capa |
| Nome oficial | `profileNameOfficial` em destaque tipográfico |
| Selo verificado | Ícone `verified` em vermelho ao lado do nome quando `channel.verified === true` |
| Handle | `@profileName` em texto secundário |
| Bio | Texto em `overview`, com largura máxima de 480px |
| Link externo | Botão com ícone `link` que abre `visitWebsite` em nova aba |

### Métricas de canal

| Métrica | Significado |
|---|---|
| **Seguidores** | `numberOfFollowers` — quantos usuários acompanham o canal |
| **Publicações** | `numberOfPublication` — total de conteúdos publicados |
| **Seguindo** | `numberOfToFollow` — quantos canais este canal segue |

Os números são formatados com sufixo (`K`, `M`) para legibilidade.

### Ações de relacionamento

| Ação | Descrição |
|---|---|
| **Inscrever-se** | Componente `app-button-inscription` — alterna entre "Inscrever-se" e estado inscrito com menu de cancelamento |
| **Mensagem** | Botão circular para abrir conversa direta (em desenvolvimento) |
| **Compartilhar canal** | Compartilha o link `/:profileName` |
| **Mais opções** | Menu contextual com denunciar, bloquear, copiar link |

### Tab Galeria

| Aspecto | Descrição |
|---|---|
| Fonte de dados | `GET /api/channel/:profileName/gallery` (paginado) |
| Componente do item | `app-pin-card-player-short` |
| Layout | Grid 6 colunas no desktop / 2 no mobile, com itens em paisagem ocupando span 3 |
| Comportamento | Cada card leva ao `Watch` daquele conteúdo |
| Estado vazio | `app-empty-state` com ícone `movie` |

### Tab Coleção

| Aspecto | Descrição |
|---|---|
| Fonte de dados | `GET /api/channel/:profileName/collection` (paginado) |
| Componente do item | `app-collection-bundle` |
| Layout | Grid responsivo `auto-fill` com cards mínimos de 220px |
| Comportamento | Cada card leva à página `Collection` (`/:username/collection/:collectionNameKey`) |
| Estado vazio | `app-empty-state` com ícone `collections_bookmark` |

### Estados da página

| Estado | O que aparece |
|---|---|
| **Carregando** | Skeleton de avatar + nome + bio |
| **Canal carregado** | Header completo + tabs ativas |
| **Sem galeria** | Empty state na tab Galeria |
| **Sem coleções** | Empty state na tab Coleção |
| **Canal não encontrado** | Página em branco; rota cai no fallback `/home` da shell |

---

## 6. Experiência do Usuário

### Como melhora a navegação

O Channel transforma a interação com o feed numa jornada com retorno. Antes, ao gostar de um conteúdo da Digix, o usuário não tinha como "voltar à Digix" — só podia esperar mais conteúdos surgirem no feed. Agora o canal é um destino estável.

A ponte é direta: na **Channel row** dentro de cada post (componente `app-post-details`), o avatar e o nome do canal são clicáveis e levam direto para `/:profileName`. Isso acontece de qualquer lugar onde o post apareça.

### Como facilita descoberta e consumo

A separação em **Galeria** e **Coleção** atende dois modos de consumo:

- **Galeria** atende quem quer descobrir — entra para ver "o que há de novo aqui" e navega visualmente
- **Coleção** atende quem quer aprofundar — entra para ver séries temáticas curadas pelo canal

Os dois grids usam componentes já consolidados na plataforma (`pin-card-player-short` e `collection-bundle`), o que mantém consistência visual e zero curva de aprendizado.

### Impacto na retenção e engajamento

- O botão de inscrição em posição estável aumenta a taxa de follow por sessão
- A capa + selo de verificado reduzem dúvida sobre a autenticidade do canal
- O acesso direto à coleção a partir do canal aumenta o tempo médio em conteúdo de um mesmo canal
- A URL canônica permite compartilhamento direto do canal por canais externos (e-mail, redes sociais)
- Métricas em destaque dão prova social imediata e estimulam follow

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A página Channel é o **produto-âncora para a relação entre marca e audiência** dentro da RealWe. Toda métrica de marca empregadora, autoridade institucional e relacionamento de longo prazo precisa de um lugar para acontecer — esse lugar é o canal.

Sem Channel, a plataforma seria um feed de conteúdo isolado. Com Channel, ela vira um ecossistema onde empresas constroem reputação observável.

### Diferencial competitivo

| Plataforma | Como trata o conceito de canal |
|---|---|
| LinkedIn | Páginas de empresa misturadas com perfis pessoais |
| YouTube | Canal completo, mas com foco social genérico |
| Instagram | Perfis comerciais sem distinção de canal editorial |
| **RealWe Channel** | Página dedicada, separada de pessoa física, com galeria + coleções curadas |

### Possibilidades futuras

- **Tab Sobre:** história, time, valores e localização da empresa
- **Tab Vagas:** lista filtrada de posts do tipo `vacancy` do próprio canal
- **Tab Eventos:** datas e agenda de eventos publicados pelo canal
- **Métricas para o dono do canal:** alcance, retenção, conversão por publicação
- **Customização visual:** capa animada, paleta personalizada do canal
- **Multi-administradores:** várias contas humanas operando o mesmo canal
- **Verificação automática:** integração com domínio para conceder selo `verified`
- **Channel patrocinado:** posicionamento destacado na home e busca
- **Assinatura paga:** conteúdos exclusivos para inscritos pagantes

---

## 8. Exemplos de Uso

### Empresa de tecnologia (Digix)
A Digix mantém seu canal `/Digix` como vitrine institucional. Galeria reúne todos os vídeos sobre cultura, vagas, treinamentos e premiações. Coleção agrupa esses vídeos em séries: "Onboarding Habix", "Cyber Security", "Vagas Abertas". Quando alguém descobre um vídeo no feed, clica no canal para conhecer mais — e acaba consumindo a coleção inteira.

### Vitrine de marca empregadora
RH publica regularmente vídeos curtos com depoimentos, bastidores e vagas. O canal acumula uma galeria orgânica que serve de prova social — candidatos visitam a página antes de aplicar e percebem a cultura real da empresa, não só a versão oficial do site institucional.

### Empresa lançando um produto
A página Channel funciona como hub de campanha. Galeria mostra as peças soltas; Coleção organiza a sequência de lançamento (teaser → demo → tutoriais → cases). O link externo (`visitWebsite`) leva direto ao site do produto.

### Verificação institucional
Empresas com selo `verified` ganham distinção visual imediata na página e nos pontos onde seu nome aparece (channel-row de posts, headers de coleção). Isso reduz tentativas de impersonation e aumenta confiança em conteúdos sensíveis (vagas, treinamentos pagos, comunicados oficiais).

---

## 9. Considerações Técnicas

### Onde está implementado

```
src/app/domain/channel/pages/channel/
├── channel.component.ts     ← lógica e estado
├── channel.component.html   ← template
└── channel.component.scss   ← estilos
```

Rota (definida em `app.routes.ts`, usando `ROUTES.PROFILE.ROOT`):

```
:username
```

Exemplo: `/Digix`

> **Nota:** o token de rota chama-se historicamente `PROFILE.ROOT`, mas hoje a rota carrega `ChannelPageComponent`. O componente legado `ProfileComponent` continua no repositório em `src/app/domain/profile/pages/profile/` sem rota associada, reservado para uma futura página de perfil de pessoa física.

### Componentes principais

| Componente | Responsabilidade |
|---|---|
| `ChannelPageComponent` | Página principal; orquestra header, tabs e estados |
| `UserAvatarComponent` | Avatar do canal no header |
| `ButtonInscriptionComponent` | Botão de inscrever-se / cancelar inscrição |
| `ButtonComponent` | Botões circulares de mensagem, compartilhar e mais opções |
| `AppTabsComponent` + `AppTabComponent` + `AppTabPanelComponent` | Estrutura das tabs Galeria/Coleção |
| `PinCardPlayerShortComponent` | Item de cada publicação na Galeria |
| `CollectionBundleComponent` | Item de cada coleção na tab Coleção |
| `EmptyStateComponent` | Estados vazios das tabs |

### Camadas (padrão app-pin)

A funcionalidade segue a arquitetura em camadas do projeto:

```
environment (URLs)
    ↓
DTO (response do backend)
    ↓
Map (DTO → Entity)
    ↓
API (HttpClient + headers + paginação)
    ↓
Service (wrapper de domínio)
    ↓
Component (consumo via signals)
```

| Camada | Arquivo |
|---|---|
| Endpoints | `src/environments/environment.ts` → `API.CHANNEL.{DETAIL, GALLERY, COLLECTION}` |
| Entity | `src/app/shared/interfaces/entity/channel.ts` |
| DTO | `src/app/shared/interfaces/dto/response/channel.ts` |
| Map | `src/app/shared/maps/channel.map.ts` |
| API | `src/app/shared/apis/channel.api.ts` |
| Service | `src/app/shared/services/channel.service.ts` |

### Backend (mock API)

| Arquivo | Responsabilidade |
|---|---|
| `api-server/src/data/channel.js` | `MOCK_CHANNEL` — array de canais |
| `api-server/src/data/gallery.js` | `MOCK_GALLERY` — array de publicações por canal |
| `api-server/src/data/collection-bundles.js` | `MOCK_COLLECTION_BUNDLES` — coleções (compartilhado com a feature Collection) |
| `api-server/src/routes/channel.js` | Rotas REST do canal |

### Endpoints

| Método | Rota | Retorno |
|---|---|---|
| `GET` | `/api/channel/:profileName` | `Channel` |
| `GET` | `/api/channel/:profileName/gallery?page&pageSize` | `List<Post[]>` paginado |
| `GET` | `/api/channel/:profileName/collection?page&pageSize` | `List<CollectionBundle[]>` paginado |

### Modelo de dados consumido

```
Channel (header)
├── id
├── profileName              → handle / slug da URL
├── profileNameOfficial      → nome em destaque
├── profilePicture           → avatar
├── coverPicture             → capa
├── numberOfFollowers        → métrica destacada
├── numberOfPublication      → métrica destacada
├── numberOfToFollow         → métrica destacada
├── verified                 → selo
├── overview                 → bio
├── visitWebsite             → link externo
├── email                    → contato (não exibido por padrão)
├── isReported / isBlocked   → flags de moderação
```

```
Gallery → Post[] (mesmo modelo do feed)
Collection → CollectionBundle[] (mesmo modelo da feature Collection)
```

### Arquitetura de estado

O componente usa **signals do Angular** para gerenciar estado local:

- `channel`, `gallery`, `collection` — dados carregados
- `isLoading` — estado de carregamento do header
- `websiteHref`, `websiteLabel` — `computed` derivados de `channel.visitWebsite`

Os três fetches (detalhe + galeria + coleção) acontecem em paralelo no `ngOnInit` para minimizar tempo até primeira tela útil.

### Navegação a partir de outros componentes

A entrada principal para a página Channel é a **Channel row** do componente `PostDetailsComponent`:

```html
<a [routerLink]="['/', post().channel.profileName]"
   [attr.aria-label]="'Ver canal ' + post().channel.profileName">
  <app-user-avatar ... />
  <span>{{ post().channel.profileName }}</span>
</a>
```

O link envolve avatar e nome, dando alvo grande de clique. O botão `Inscrever-se` ao lado fica fora do link para preservar sua função independente.

### Decisões de layout

- **Header centralizado** com largura máxima de 600px, alinhado ao padrão Pinterest do projeto
- **Avatar com borda branca** sobrepondo a capa para criar profundidade e remeter ao padrão de canais consolidados
- **Cover responsiva** (200px → 140px no mobile) para preservar a proporção sem dominar a tela
- **Grid de Galeria** reutiliza exatamente o grid do feed (home `media-card`) — mesma sensação visual em ambas as superfícies
- **Grid de Coleção** com `auto-fill` permite que canais com poucas coleções não fiquem esparsos
- **Tabs persistentes** acima do conteúdo — a aba ativa fica visível mesmo durante o scroll inicial

### i18n

Chaves usadas (namespace `profile.*` reaproveitado para reduzir duplicação):

- `profile.followers`
- `profile.following`
- `profile.publications`
- `profile.gallery`
- `profile.collection`
- `profile.noGallery`
- `profile.noCollection`

Disponíveis nos três idiomas suportados: `pt`, `en`, `es`.
