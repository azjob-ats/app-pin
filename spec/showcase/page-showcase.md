# Página Showcase — Documentação

---

## 1. Visão Geral

A **página Showcase** é uma vitrine imersiva de conteúdo em vídeo na plataforma RealWe. Ela é acessada quando um usuário clica em um card de conteúdo exibido dentro de uma lista curada de um canal (exibida na home em `<app-effect-list-cards>`).

Diferente da página **Watch**, que é focada em profundidade e comunidade (comentários, canal, métricas completas), a página Showcase é focada em **apresentação direta e conversão**. O ambiente é minimalista: player em destaque, informações essenciais e um único próximo passo — o botão **"Saiba Mais"**.

### Onde se encaixa no produto

A RealWe opera em quatro estágios de engajamento:

```
Descoberta → Profundidade → Conversão → Comunidade
```

A página Showcase é um atalho especializado entre **Descoberta** e **Conversão**. Enquanto a Watch aprofunda o relacionamento, a Showcase enfatiza decisão — é a tela certa para conteúdos de vitrine, pitches institucionais, demonstrações de produto e anúncios de vagas.

---

## 2. Propósito

### Por que essa funcionalidade existe

Nem todo conteúdo precisa dos elementos sociais de uma página Watch. Conteúdos institucionais curados por um canal (ex: a série de vídeos de apresentação da empresa Digix) ganham mais impacto quando consumidos num ambiente limpo, com cor de fundo neutra, foco no vídeo e um único CTA.

A Showcase existe para **apresentar conteúdos selecionados de forma direta**, funcionando como a "capa editorial" de uma coleção temática do canal.

### Qual problema ela resolve

| Problema | Como a Showcase resolve |
|---|---|
| Conteúdo institucional diluído no meio do feed | Tela dedicada e minimalista |
| Excesso de elementos sociais em conteúdo de vitrine | Remove likes, salvamento, compartilhamento, comentários |
| Indecisão entre múltiplos CTAs | Apenas "Saiba Mais" como ação principal |
| Dificuldade de continuar navegando dentro da coleção | Grid estilo Pinterest com os itens da vitrine na lateral |
| Canais sem espaço editorial próprio | Showcase é a vitrine curada do canal |

### Qual necessidade do usuário atende

- Consumir rapidamente o conteúdo principal da vitrine, sem distração
- Avançar para a ação de conversão (saber mais, candidatar-se, comprar) com o mínimo de fricção
- Explorar visualmente outros itens da mesma vitrine sem sair do contexto
- Reconhecer que está dentro de uma coleção curada pelo canal

---

## 3. Objetivo

### O que se espera alcançar

A Showcase tem três objetivos centrais, em ordem de prioridade:

1. **Apresentação:** destacar o vídeo com o máximo de presença visual possível
2. **Conversão:** conduzir o usuário ao clique em "Saiba Mais"
3. **Continuidade na coleção:** manter o usuário explorando outros itens da mesma vitrine

### Benefícios para o usuário

- Experiência limpa, sem ruído social ou excesso de metadados
- Foco total no conteúdo e na ação seguinte
- Navegação fluida entre os itens da vitrine sem perder o contexto
- Autoplay silencioso que inicia o conteúdo sem fricção

### Benefícios para o negócio

- Taxa de conversão mais alta por reduzir atrito entre consumo e decisão
- Superfície editorial dedicada para campanhas e coleções patrocinadas
- Padrão visual forte e replicável para qualquer canal
- Valoriza a curadoria do canal como produto

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Acesso**
O usuário chega à Showcase ao clicar em um card dentro de uma vitrine de canal (componente `<app-effect-list-cards>` exibido na home). A URL segue o padrão:

```
/:username/showcase/:titleLink
```

Exemplo: `/digix/showcase/visao-geral-da-realwe`

**2. Carregamento**
Um skeleton simples é exibido. Em seguida, o player é preenchido e começa a carregar o vídeo.

**3. Reprodução automática**
Assim que o vídeo pode ser reproduzido, o player tenta **autoplay**. Se o navegador bloquear áudio, o player volta automaticamente ao modo **silencioso** e tenta de novo, garantindo que o conteúdo comece a tocar sem clique.

**4. Controles do player**
Sobre o vídeo, o usuário pode:
- Clicar no vídeo para pausar ou retomar
- Arrastar a barra de progresso
- Ver o tempo no tooltip ao passar o mouse sobre a seekbar
- Ajustar volume ou silenciar
- Entrar em tela cheia

**5. Detalhe mínimo do conteúdo**
Abaixo do player, uma faixa com fundo preto exibe apenas:
- O **título** do conteúdo
- Um botão de **três pontos** (menu de opções adicionais)
- O botão **"Saiba Mais"**

Nenhum like, descrição, canal, comentário ou hashtag aparece — por desenho.

**6. Conversão**
Ao clicar em **"Saiba Mais"**, um drawer lateral abre à direita com o componente de aprofundamento (`app-learn-more`) associado ao conteúdo.

**7. Exploração da vitrine**
A lateral direita exibe os demais itens da vitrine num **grid tipo Pinterest** (masonry). Os cards mostram apenas a thumbnail — sem título, sem metadados, sem cabeçalho — privilegiando o ritmo visual. Clicar em qualquer card troca o conteúdo principal e reinicia o ciclo.

---

## 5. Principais Funcionalidades

### Player de vídeo

| Funcionalidade | Descrição |
|---|---|
| Autoplay | Tenta iniciar automaticamente; cai para mudo se bloqueado pelo navegador |
| Play / Pause | Clique no vídeo ou botão central |
| Barra de progresso | Arrastar para navegar; tooltip mostra o tempo ao hover |
| Controle de volume | Ícone sempre visível; slider expande ao hover |
| Tela cheia | Ativável a partir do player |
| Overlay de play | Botão central visível quando o vídeo está pausado |
| Poster | Thumbnail exibida antes do vídeo começar |

### Detalhe do post (minimalista)

| Elemento | Descrição |
|---|---|
| Fundo preto | Barra contínua sob o player, visualmente integrada ao vídeo |
| Título | Nome do conteúdo, até 2 linhas com reticências |
| Botão "Mais opções" (⋯) | Circular, fundo branco — acesso a menu complementar |
| Botão "Saiba Mais" | Primário, CTA principal de conversão |

### Vitrine relacionada (sidebar)

| Elemento | Descrição |
|---|---|
| Layout | Grid estilo Pinterest (CSS `columns` + `break-inside: avoid`) |
| Card | Apenas thumbnail; sem título, sem canal, sem métricas |
| Clique | Navega para outro item da vitrine mantendo o layout |
| Scroll | Apenas a sidebar rola no desktop — o player e o detalhe ficam fixos |

### Drawer "Saiba Mais"

| Elemento | Descrição |
|---|---|
| Posição | Direita |
| Conteúdo | `app-learn-more` parametrizado pelo `pinId` do conteúdo |
| Fechamento | Pelo componente filho ou clique fora |

### Estados da página

| Estado | O que aparece |
|---|---|
| **Carregando** | Skeleton compacto com placeholder do player |
| **Erro / não encontrado** | Empty state com mensagem "Post não encontrado" |
| **Sem relacionados** | Empty state na sidebar |
| **Sem vídeo** | Thumbnail estática no lugar do player |

---

## 6. Experiência do Usuário

### Como melhora a navegação

A Showcase inverte a hierarquia visual em relação ao Watch: em vez de dividir a atenção entre vídeo, canal, comentários e CTA, tudo converge para duas regiões:

- **Esquerda (65%, altura fixa):** imersão — vídeo + título + CTA
- **Direita (35%, rolável):** continuidade — mais itens da vitrine

O único scroll vertical da página acontece na sidebar. Isso mantém o vídeo sempre presente mesmo enquanto o usuário explora a coleção.

### Como facilita descoberta e consumo

O grid masonry à direita cria uma sensação de "álbum visual" da vitrine. Como os cards mostram apenas a thumbnail, a decisão de clique é guiada pela imagem — o que acelera a navegação e reduz a carga cognitiva.

O autoplay com fallback para mudo garante que o vídeo comece a tocar mesmo sem interação, reforçando que o conteúdo é a estrela da página.

### Impacto na retenção e engajamento

- O CTA único ("Saiba Mais") concentra conversões numa única ação mensurável
- A troca entre itens da vitrine não exige um retorno ao feed, o que aumenta sessões por canal
- A ausência de elementos sociais reduz distração e aumenta o tempo focado no vídeo
- O layout fixo do player + detalhe permite que campanhas visuais da marca se destaquem

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A Showcase transforma cada canal numa **vitrine editorial permanente**. Canais institucionais, empresas e criadores podem organizar seu catálogo de conteúdos em coleções temáticas e dirigir audiência direto para o item de destaque.

Por ser o formato mais enxuto da plataforma, a Showcase é a página com menor fricção entre impressão e conversão — ideal para campanhas onde o objetivo é um clique específico (candidatura, compra, cadastro).

### Diferencial competitivo

| Plataforma | Como trata vitrine de conteúdo |
|---|---|
| LinkedIn | Posts independentes no feed, sem vitrine dedicada |
| YouTube | Playlists, mas com a mesma UI de consumo social |
| Instagram | Highlights efêmeros em stories, sem estrutura editorial |
| **RealWe Showcase** | Página dedicada, minimalista, com CTA único e grid curado |

### Possibilidades futuras

- **Métricas de vitrine:** taxa de conversão por coleção e por item
- **Ordenação editorial:** canais decidem a ordem dos itens na vitrine
- **Cards com títulos/tempo:** variação visual opcional do grid Pinterest
- **Showcase patrocinada:** vitrines destacadas em áreas premium da home
- **Encadeamento automático:** ao terminar um vídeo, o próximo da vitrine entra sem clique
- **Tema personalizado por canal:** fundo preto é o padrão, canais podem ter skins customizadas
- **Share de vitrine:** link direto para a coleção completa

---

## 8. Exemplos de Uso

### Apresentação institucional
Uma empresa publica uma vitrine com 8 vídeos explicando cultura, produto, time e benefícios. O usuário clica no primeiro card pela home, é levado à Showcase, assiste ao vídeo de abertura e clica em "Saiba Mais" para acessar a página institucional da empresa.

### Vitrine de vagas
Uma área de RH monta uma vitrine com os vídeos de apresentação de cada vaga em aberto. O usuário entra pelo card de uma vaga, assiste e clica em "Saiba Mais" para abrir o formulário de candidatura dentro do drawer lateral.

### Demonstração de produto
Uma marca publica uma série de vídeos curtos demonstrando as funcionalidades de um produto. O usuário navega pelo grid da vitrine, assiste rapidamente a vários itens e converte na funcionalidade que mais chamou atenção.

### Evento corporativo
Durante um evento, o canal oficial exibe uma Showcase com os painéis gravados. Cada card leva a um painel distinto, e "Saiba Mais" leva à página de inscrição na próxima edição.

---

## 9. Considerações Técnicas

### Onde está implementado

```
src/app/domain/showcase/pages/showcase/
├── showcase.component.ts     ← lógica e estado
├── showcase.component.html   ← template
└── showcase.component.scss   ← estilos
```

Rota (definida em `environment.ts → ROUTES.SHOWCASE.ROOT`):

```
:username/showcase/:titleLink
```

### Componentes principais

| Componente | Responsabilidade |
|---|---|
| `ShowcasePageComponent` | Página principal; orquestra estado, player e dados |
| `ButtonComponent` | Botão "Saiba Mais" (primário) e botão "Mais opções" (circular, customizado via `.pp-more-btn`) |
| `DrawerComponent` | Contêiner lateral do "Saiba Mais" |
| `LearnMoreComponent` | Conteúdo interno do drawer |
| `EmptyStateComponent` | Estados de erro e sidebar vazia |

### Integrações

| Integração | Descrição |
|---|---|
| `PostApi.detail(username, titleLink)` | Carrega os dados do conteúdo principal |
| `ShopWindowApi.list(1, 20)` | Carrega as vitrines disponíveis; os itens são achatados e usados como grid lateral |
| `ActivatedRoute` | Lê `:username` e `:titleLink` da URL |
| `Router` | Redireciona para `/` quando parâmetros estão ausentes |
| `Fullscreen API` | Entrada e saída do modo tela cheia |

### Modelo de dados consumido

```
Post (conteúdo principal)
├── media.long          → URL do vídeo principal
├── media.thumbnail     → capa do player
├── media.title         → título exibido na faixa preta
└── media.titleLink     → usado para filtrar o item atual do grid lateral

ShopWindow (vitrine)
├── channel.profileNameOfficial  → username usado na rota dos cards relacionados
└── items[]
    ├── postId
    ├── title
    ├── titleLink
    ├── thumbnailUrl   → única informação exibida no card do grid
    └── short
```

### Arquitetura de estado

O componente usa **signals do Angular** para gerenciar o estado local:

- `post`, `relatedItems` — dados carregados
- `isLoading`, `hasError` — estados de carregamento e erro
- `isPlaying`, `currentTime`, `duration`, `autoplay` — estado do player
- `isMuted`, `volume` — estado de áudio
- `tooltipVisible`, `tooltipX`, `tooltipTime` — tooltip da seekbar
- `isFullscreen` — estado da tela cheia
- `showLearnMoreDrawer` — visibilidade do drawer de conversão

Estados derivados usam `computed()`:

- `videoProgress` — percentual do vídeo
- `volumeIcon`, `volumeSliderBg` — ícone e gradiente do controle de volume
- `filteredRelated` — itens da vitrine excluindo o atual, limitados a 20

### Decisões de layout

- `ViewEncapsulation.None` para permitir que regras como `.pp-more-btn .btn` sobrescrevam o botão sem `::ng-deep`
- `.pp-container { height: 100% }` alinhado ao `flex: 1` do `.page-content` da shell — evita scroll duplo
- `.pp-left { overflow: hidden }` no desktop — player e detalhe ficam fixos
- `.pp-sidebar { overflow-y: auto; height: 100% }` — único scroller da página no desktop
- `.pp-related-grid { columns: 2 }` — masonry CSS nativo (sem biblioteca), com `break-inside: avoid` nos cards
- Em `max-width: 900px` o layout vira coluna única e a sidebar passa a ter scroll natural da página
