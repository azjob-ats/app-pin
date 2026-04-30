# Página Watch — Documentação

---

## 1. Visão Geral

A **página Watch** é o destino de consumo aprofundado de conteúdo em vídeo da plataforma RealWe. É acessada quando o usuário clica em qualquer post de vídeo longo a partir do feed, perfil de canal ou recomendações.

A Watch foi recentemente **realinhada à identidade visual da Showcase**: em vez do antigo layout estilo YouTube (player dominante + sidebar com lista de cards detalhados + comentários inline), a página agora segue o mesmo sistema de design da Showcase — minimalista no consumo, rico sob demanda.

### Onde se encaixa no produto

A RealWe opera em quatro estágios de engajamento:

```
Descoberta → Profundidade → Conversão → Comunidade
```

A Watch é o estágio de **Profundidade** com porta de entrada para **Conversão** (botão "Saiba Mais") e **Comunidade** (acessível sob demanda via bottom sheet — likes, salvamento, compartilhamento, comentários, inscrição no canal).

### Watch vs. Showcase

| Aspecto | Watch | Showcase |
|---|---|---|
| Origem do conteúdo | Post solto publicado no feed | Item dentro de uma vitrine curada do canal |
| Sidebar | Posts relacionados (algoritmo/feed) | Itens da mesma vitrine do canal |
| Layout | **Idêntico ao Showcase** | Idêntico ao Watch |
| Player | **Idêntico ao Showcase** | Idêntico ao Watch |
| Detalhe social | **Bottom sheet sob demanda** | Bottom sheet sob demanda |
| CTA | "Saiba Mais" (drawer lateral) | "Saiba Mais" (drawer lateral) |

A diferença passou a ser **a fonte de relação**, não a aparência: Watch sugere descoberta orgânica entre posts, Showcase sugere navegação dentro de uma coleção editorial.

---

## 2. Propósito

### Por que essa funcionalidade existe

O feed exibe vídeos curtos que funcionam como trailers — despertam curiosidade, mas não aprofundam. A Watch existe para **dar profundidade ao conteúdo**, criando um ambiente onde o criador constrói autoridade e o usuário toma decisões informadas.

O realinhamento visual com a Showcase resolve um problema adicional: a versão anterior da Watch tinha aparência muito próxima ao YouTube (sidebar tipo "up next", comentários embaixo do vídeo, action bar densa). Isso enfraquecia a identidade da plataforma e criava inconsistência visual com o restante do produto.

### Qual problema ela resolve

| Problema | Como a Watch resolve |
|---|---|
| Conteúdo longo perdido no feed | Tela dedicada, imersiva, sem competição visual |
| Usuário não sabe o que fazer após assistir | CTA "Saiba Mais" sempre visível na barra inferior preta |
| Dificuldade de descobrir mais conteúdos relacionados | Grid masonry estilo Pinterest com posts da plataforma |
| Aparência de YouTube enfraquecia a marca | Layout, tipografia e interações 100% RealWe (idênticos à Showcase) |
| Excesso de elementos sociais ofuscando o vídeo | Likes, comentários, canal, descrição passam ao bottom sheet sob demanda |
| Quebra de fluxo ao acessar contexto social | Bottom sheet preserva o vídeo no fundo; usuário não sai da página |

### Qual necessidade do usuário atende

- Consumir um vídeo longo com profundidade, em ambiente limpo
- Decidir, com mínimo atrito, se quer avançar para a ação de conversão
- Acessar contexto social (canal, comentários, descrição completa) **quando precisar**, sem trocar de tela
- Continuar a navegação descobrindo outros conteúdos sem retornar ao feed

---

## 3. Objetivo

### O que se espera alcançar

Em ordem de prioridade:

1. **Consumo:** garantir que o usuário assista ao vídeo até o final
2. **Conversão:** conduzir o clique em "Saiba Mais"
3. **Profundidade opcional:** disponibilizar contexto social via bottom sheet para quem precisa
4. **Descoberta:** manter o usuário na plataforma através do grid masonry

### Benefícios para o usuário

- Experiência imersiva, sem ruído visual no consumo
- Acesso completo a likes, salvar, compartilhar, comentários, canal — sob demanda
- Padrão visual consistente com Showcase (a plataforma toda "fala a mesma língua")
- Descoberta orgânica de outros conteúdos sem sair da Watch

### Benefícios para o negócio

- **Identidade própria reforçada:** Watch deixa de parecer um clone de YouTube
- **Manutenção reduzida:** mesma stack de componentes (`app-bottom-sheet`, `app-post-details`, masonry grid) usada na Showcase
- **Conversão preservada:** "Saiba Mais" continua proeminente, sem competição com elementos sociais
- **Engajamento opcional:** comentar, curtir, seguir o canal continua possível, mas não polui a tela principal
- **Métricas independentes:** abertura do bottom sheet vira sinal próprio de interesse social

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Acesso**
O usuário chega à Watch ao clicar em um post de vídeo longo no feed, perfil de canal ou recomendações. A URL segue:

```
/:username/watch/:titleLink
```

Exemplo: `/digix/watch/processo-seletivo-2025`

**2. Carregamento**
Skeleton compacto (player + 3 linhas de placeholder) é exibido enquanto os dados chegam.

**3. Reprodução automática**
Assim que o vídeo pode tocar, o player tenta autoplay. Se o navegador bloquear áudio, volta ao modo silencioso e reinicia — o conteúdo começa sem fricção.

**4. Controles do player**
- Clique no vídeo para pausar/retomar
- Arrastar a seekbar (com tooltip de tempo no hover)
- Volume e mute
- Tela cheia

**5. Detalhe mínimo do conteúdo**
Abaixo do player, faixa preta contínua com:
- **Título** do vídeo (até 2 linhas)
- Botão **Mais opções** (`more_horiz`) — abre o bottom sheet
- Botão **Saiba Mais** — abre o drawer lateral de conversão

Nenhum like, descrição, canal ou comentário aparece nesta camada — por desenho.

**6. Profundidade sob demanda**
Ao clicar em **Mais opções**, um painel desliza de baixo para cima exibindo:

- Action bar: like, salvar, compartilhar, mais opções, Saiba Mais
- Métricas: visualizações + tempo desde publicação
- Título completo
- Descrição + hashtags
- Canal: avatar, nome, verificado, seguidores, botão Inscrever-se
- Comentários: input para novo comentário + lista existente

O vídeo continua tocando atrás. O painel é fechável pelo botão **Fechar**, pelo backdrop ou pela conversão.

**7. Conversão**
"Saiba Mais" (na barra inferior ou dentro do bottom sheet) abre um drawer lateral à direita com `app-learn-more`, vinculado ao conteúdo.

**8. Descoberta lateral**
À direita, um **grid masonry estilo Pinterest** mostra outros posts da plataforma, exibindo apenas a thumbnail. Clicar em qualquer card troca o conteúdo principal e reinicia o ciclo, sem recarregar a aplicação.

---

## 5. Principais Funcionalidades

### Player de vídeo

| Funcionalidade | Descrição |
|---|---|
| Autoplay | Tenta iniciar automaticamente; cai para mudo se bloqueado pelo navegador |
| Play / Pause | Clique no vídeo ou no botão central |
| Seekbar | Arrastar para navegar; tooltip com tempo ao hover |
| Volume | Ícone sempre visível; slider expande ao hover |
| Tela cheia | Botão dedicado, com tooltip |
| Overlay de play | Botão central enquanto pausado |
| Poster | Thumbnail estática antes do início |

### Detalhe minimalista (faixa inferior preta)

| Elemento | Descrição |
|---|---|
| Fundo | Preto contínuo, integrado ao player |
| Título | Nome do conteúdo, limitado a 2 linhas |
| Botão "Mais opções" | Circular branco, abre o bottom sheet |
| Botão "Saiba Mais" | CTA primário, abre o drawer lateral |

### Bottom sheet de detalhes (`app-post-details`)

| Bloco | Conteúdo |
|---|---|
| Action bar | Like (com contador), Salvar, Compartilhar, Mais opções, Saiba Mais |
| Meta | Visualizações + tempo relativo (ex: "há 2 dias") |
| Título | `media.title` |
| Descrição | `media.description` + hashtags do `media.slang[]` |
| Canal | Avatar, nome, badge verificado, seguidores, botão Inscrever-se |
| Comentários | Campo para novo comentário + lista de comentários existentes |

### Sidebar — grid masonry

| Elemento | Descrição |
|---|---|
| Layout | CSS `columns` + `break-inside: avoid` (sem biblioteca) |
| Card | Apenas thumbnail; sem título, canal ou métricas |
| Clique | Navega para outro Watch sem recarregar a aplicação |
| Scroll | Apenas a sidebar rola no desktop — player e detalhe ficam fixos |
| Responsivo | 2 colunas no desktop, 3 em tablets, 2 em mobile |

### Drawer "Saiba Mais"

| Elemento | Descrição |
|---|---|
| Posição | Lateral direita |
| Conteúdo | `app-learn-more` parametrizado pelo `pinId` do conteúdo |
| Fechamento | Pelo componente filho ou pelo backdrop |

### Estados da página

| Estado | O que aparece |
|---|---|
| **Carregando** | Skeleton compacto (player + linhas) |
| **Erro / não encontrado** | Empty state "Post não encontrado" |
| **Sem relacionados** | Empty state na sidebar |
| **Sem vídeo** | Thumbnail estática no lugar do player |

---

## 6. Experiência do Usuário

### Como melhora a navegação

A Watch agora segue a mesma hierarquia visual da Showcase: tudo converge para duas regiões.

- **Esquerda (65%, altura fixa):** imersão — vídeo + título + CTA
- **Direita (35%, rolável):** continuidade — outros posts em grid

O único scroll vertical da página acontece na sidebar. Isso mantém o vídeo sempre presente, mesmo enquanto o usuário explora.

A separação física entre **consumir** (tela principal) e **interagir** (bottom sheet) cria um modelo mental claro: a página é para assistir; o painel é para se envolver socialmente.

### Como facilita descoberta e consumo

O grid masonry à direita opera como um "álbum visual" da plataforma. Como os cards mostram apenas a thumbnail, a decisão de clique é guiada pela imagem — o que acelera a navegação e reduz a carga cognitiva.

O autoplay com fallback para mudo garante que o vídeo comece a tocar mesmo sem interação, reforçando que o conteúdo é a estrela da página.

### Impacto na retenção e engajamento

- O CTA único ("Saiba Mais") concentra conversões numa ação mensurável
- A troca entre posts não exige um retorno ao feed — aumenta sessões por canal
- A ausência de elementos sociais no consumo reduz distração e aumenta o tempo focado no vídeo
- O bottom sheet preserva o engajamento social (curtir, comentar, seguir) sem interromper a reprodução

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A Watch é o ponto onde investimento de empresas se converte em resultado. É o destino com maior tempo médio de sessão e a porta principal de conversão da plataforma.

O realinhamento à Showcase **fortalece a marca**: o usuário percebe que está em uma plataforma com identidade própria — não em mais um agregador de vídeos. Player, faixa inferior preta, grid masonry e bottom sheet são padrões reconhecíveis que diferenciam a RealWe de qualquer concorrente.

### Diferencial competitivo

| Plataforma | Como trata conteúdo longo |
|---|---|
| YouTube | Player dominante + sidebar densa de "up next" + comentários inline |
| LinkedIn | Sem player imersivo; redireciona para links externos |
| Instagram | Reels (curtos) + IGTV minimalista, sem CTA de conversão estruturado |
| TikTok | Foco em vídeos curtos; sem formato de profundidade |
| **RealWe Watch** | Player + faixa minimalista + bottom sheet sob demanda + masonry de descoberta + CTA único |

### Possibilidades futuras

- **Métricas de retenção por vídeo:** percentual assistido, ponto de abandono, taxa de abertura do bottom sheet
- **Watch History:** histórico de vídeos assistidos para recomendações personalizadas
- **Encadeamento automático:** ao terminar um vídeo, o próximo do grid entra sem clique
- **Integração com Learn More dinâmico:** formulários ativados diretamente pelo "Saiba Mais"
- **Tema personalizado por canal:** fundo preto é o padrão, canais podem ter skins customizadas
- **Co-watch:** assistir sincronizado com outras pessoas em onboarding e treinamentos
- **Pré-busca de bottom sheet:** abrir o painel instantaneamente em hover

---

## 8. Exemplos de Uso

### Recrutamento
Uma empresa publica um vídeo de 8 minutos onde um desenvolvedor sênior explica o processo seletivo. O usuário assiste, abre o bottom sheet para ler a descrição completa e os comentários da comunidade, fecha, e clica em "Saiba Mais" para enviar o currículo.

### Treinamento de produto
Uma empresa de software publica uma série sobre como usar sua plataforma. O usuário assiste a um episódio, descobre na sidebar outros vídeos similares e clica nos próximos sem retornar ao feed.

### Cultura organizacional
Um colaborador publica um vídeo mostrando o escritório, rituais de time e benefícios. O usuário abre o bottom sheet, inscreve-se no canal e deixa um comentário — tudo sem sair da página.

### Lançamento de produto
Uma marca publica uma demonstração. O usuário assiste, abre o bottom sheet para validar likes/comentários da comunidade, fecha e clica em "Saiba Mais" para a página de pré-venda.

---

## 9. Considerações Técnicas

### Onde está implementado

```
src/app/domain/watch/pages/watch/
├── watch.component.ts     ← lógica e estado
├── watch.component.html   ← template (alinhado à Showcase)
└── watch.component.scss   ← estilos (idênticos à Showcase)
```

Componentes compartilhados consumidos:

```
src/app/shared/components/
├── bottom-sheet/      ← painel modal deslizante
├── post-details/      ← bloco completo de detalhe (action bar + meta + canal + comentários)
├── drawer/            ← drawer lateral usado pelo "Saiba Mais"
├── learn-more/        ← conteúdo do drawer de conversão
├── button/            ← botão primário/secundário/circular
└── empty-state/       ← estados vazios e de erro
```

Rota:

```
:username/watch/:titleLink
```

### Componentes principais

| Componente | Responsabilidade |
|---|---|
| `WatchPageComponent` | Página principal; orquestra estado, player, bottom sheet e drawer |
| `BottomSheetComponent` | Painel sob demanda com `app-post-details` projetado |
| `PostDetailsComponent` | Conteúdo de detalhe reutilizado por Watch e Showcase |
| `DrawerComponent` | Contêiner lateral do "Saiba Mais" |
| `LearnMoreComponent` | Conteúdo interno do drawer |
| `ButtonComponent` | "Saiba Mais" (primário) e "Mais opções" (circular) |
| `EmptyStateComponent` | Erros e sidebar vazia |

### Integrações

| Integração | Descrição |
|---|---|
| `PostApi.detail(username, titleLink)` | Carrega o post atual |
| `PostApi.list(1, 20)` | Carrega os posts relacionados para o grid lateral |
| `ActivatedRoute` | Lê `:username` e `:titleLink` da URL |
| `Router` | Redireciona para `/` quando parâmetros estão ausentes |
| `Fullscreen API` | Entrada e saída do modo tela cheia |

### Modelo de dados consumido

```
Post (conteúdo principal e itens relacionados)
├── id
├── media.long          → URL do vídeo principal
├── media.thumbnail     → capa do player (e do card no grid)
├── media.title         → título
├── media.titleLink     → slug usado na rota
├── media.description   → descrição (visível no bottom sheet)
├── media.slang[]       → hashtags (visíveis no bottom sheet)
├── views               → contador de visualizações
├── likes               → contador de likes
├── isLiked             → estado do like atual
├── timestamp           → data de publicação
├── channel
│   ├── profileName     → nome do canal (e roteamento)
│   ├── profilePicture  → avatar
│   ├── verified        → badge
│   └── numberOfFollowers
└── comment.data[]      → lista de comentários (renderizada no bottom sheet)
```

### Arquitetura de estado

O componente usa **signals do Angular**:

- `post`, `relatedPosts` — dados carregados
- `isLoading`, `hasError` — estados de carregamento/erro
- `isPlaying`, `currentTime`, `duration`, `autoplay` — estado do player
- `isMuted`, `volume` — estado de áudio
- `tooltipVisible`, `tooltipX`, `tooltipTime` — tooltip da seekbar
- `isFullscreen` — estado da tela cheia
- `showLearnMoreDrawer` — visibilidade do drawer de conversão
- `showDetailsSheet` — visibilidade do bottom sheet de detalhes

Estados derivados (`computed`):

- `videoProgress` — percentual do vídeo
- `volumeIcon`, `volumeSliderBg` — ícone e gradiente do controle de volume
- `filteredRelated` — posts excluindo o atual, limitados a 20

### Decisões de layout

- `ViewEncapsulation.None` — permite que regras como `.pp-more-btn .btn` ajustem o botão sem `::ng-deep`
- `.pp-container { height: 100% }` — alinhado ao `flex: 1` do shell, evitando scroll duplo
- `.pp-left { overflow: hidden }` no desktop — player e detalhe ficam fixos
- `.pp-sidebar { overflow-y: auto; height: 100% }` — único scroller da página no desktop
- `.pp-related-grid { columns: 2 }` — masonry CSS nativo, com `break-inside: avoid` nos cards
- Em `max-width: 900px` o layout vira coluna única e a sidebar passa a ter scroll natural da página

### Reutilização entre Watch e Showcase

| Componente / Estilo | Watch | Showcase |
|---|---|---|
| `app-bottom-sheet` | ✓ | ✓ |
| `app-post-details` | ✓ | ✓ |
| `.pp-player`, `.pp-media-wrap`, `.pp-controls` | ✓ | ✓ |
| `.pp-related-grid` (masonry) | ✓ | ✓ |
| `.pp-post-details` (faixa preta) | ✓ | ✓ |
| Faixa inferior com title + more + saiba mais | ✓ | ✓ |
| Lógica do player (autoplay, fullscreen, seekbar) | duplicada | duplicada |

A duplicação da lógica de player é candidato a futura extração para um `app-pin-player-long` em `/shared/components`.
