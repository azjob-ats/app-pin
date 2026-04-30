# Bottom Sheet de Detalhes do Post — Showcase

---

## 1. Visão Geral

O **Bottom Sheet de Detalhes do Post** é uma camada complementar da página **Showcase** que entrega, sob demanda, todo o contexto social e descritivo de um conteúdo sem sair do ambiente imersivo da vitrine.

A página Showcase é, por desenho, minimalista: o usuário vê o vídeo, o título e dois botões — **Mais opções** (`more_horiz`) e **Saiba Mais**. Toda informação social (likes, comentários, descrição, canal, salvar, compartilhar) fica oculta para preservar o foco no conteúdo e no CTA principal.

Essa funcionalidade introduz uma **terceira via**: ao clicar em **Mais opções**, um painel desliza de baixo para cima exibindo os mesmos blocos de detalhe que existem na página **Watch**, sem nunca tirar o usuário da Showcase.

### Onde se encaixa no produto

```
Descoberta → Showcase (vitrine minimalista) → [opcional] Bottom Sheet (detalhe sob demanda) → Conversão
                                              ↑
                                              acionado pelo botão "Mais opções"
```

A funcionalidade preenche a lacuna entre **apresentação enxuta** (Showcase) e **profundidade social** (Watch), sem exigir uma navegação completa para outra página.

---

## 2. Propósito

### Por que essa funcionalidade existe

A Showcase optou por esconder elementos sociais para maximizar conversão. Mas alguns usuários, em alguns momentos, **precisam** desse contexto para decidir:

- Quem é o canal? É verificado? Tem quantos seguidores?
- Qual a descrição completa? Tem hashtags relevantes?
- Outras pessoas curtiram, comentaram, salvaram?
- Quero compartilhar isso com alguém antes de converter

Forçar o usuário a abandonar a Showcase para responder essas perguntas custa atenção e pode dissolver a intenção de conversão. O Bottom Sheet resolve isso sem sair de casa.

### Qual problema ela resolve

| Problema | Como o Bottom Sheet resolve |
|---|---|
| Usuário precisa de contexto social para decidir, mas a Showcase oculta isso | Detalhe completo aparece sobre a tela, sem perder o vídeo de fundo |
| Sair da Showcase para a Watch quebra o fluxo e perde estado de reprodução | Painel modal mantém a Showcase intacta abaixo |
| Botão "Mais opções" sem ação destruía expectativa | Agora tem comportamento concreto e descobertível |
| Reaproveitar UI da Watch exigiria duplicação | Componente `app-post-details` extrai a estrutura e é reutilizável |
| Mobile não tinha padrão claro de "abrir mais informações" | Bottom Sheet é o padrão nativo de mobile para este caso |

### Qual necessidade do usuário atende

- Acessar contexto adicional **sem perder o vídeo em reprodução**
- Curtir, salvar, compartilhar e comentar **sem trocar de página**
- Conferir credenciais do canal (verificação, seguidores) antes de seguir o CTA
- Ler descrição completa, hashtags e comentários da comunidade
- Voltar ao estado anterior (Showcase pura) com um único toque

---

## 3. Objetivo

### O que se espera alcançar

Em ordem de prioridade:

1. **Reduzir abandono:** evitar que o usuário precise sair da Showcase para acessar contexto social
2. **Preservar conversão:** manter o CTA "Saiba Mais" sempre acessível dentro do próprio painel
3. **Reutilização:** o componente `app-bottom-sheet` é genérico e pode ser usado em qualquer outra tela do produto

### Benefícios para o usuário

- Acesso rápido a likes, comentários, canal, descrição sem trocar de tela
- Ações de engajamento (curtir, salvar, compartilhar, comentar) disponíveis na Showcase
- Padrão visual reconhecível: cabeçalho com botão "Fechar", painel deslizante, área de conteúdo rolável
- Fechamento intuitivo: clique no backdrop, no botão "Fechar" ou em "Saiba Mais"

### Benefícios para o negócio

- Aumento de tempo de sessão por reduzir saídas para a Watch
- Métricas de engajamento social passam a coexistir com métricas de conversão na mesma página
- Reduz custo de manutenção: detalhe único em `app-post-details`, consumido por Watch e Showcase
- Padrão de bottom-sheet reutilizável reduz tempo de implementação de futuras camadas modais

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Estado inicial — Showcase pura**
O usuário está na Showcase assistindo ao vídeo. Vê apenas o título, o botão circular **Mais opções** (`more_horiz`) e o botão **Saiba Mais**.

**2. Acionamento**
Clica em **Mais opções**. Um painel desliza de baixo para cima ocupando até 90% da altura da tela, com o vídeo continuando visível atrás (escurecido por um backdrop semi-transparente).

**3. Cabeçalho do painel**
No topo do painel, um botão **"Fechar"** com fundo preto está sempre visível. Ele encerra o painel a qualquer momento.

**4. Conteúdo do painel — `app-post-details`**
Dentro do painel, em ordem vertical:

- **Barra de ações:** botão de curtir (com contagem), Salvar, Compartilhar, Mais opções (⋯), e o CTA **Saiba Mais**
- **Métricas:** total de visualizações e tempo desde a publicação
- **Título:** nome completo do conteúdo
- **Descrição + hashtags:** texto completo do post seguido das tags em destaque
- **Canal:** avatar, nome (com selo de verificado se aplicável), contagem de seguidores e botão de inscrição
- **Comentários:** campo para escrever um novo comentário e a lista de comentários existentes com avatar, autor, tempo, texto, contagem de curtidas e respostas

**5. Conversão dentro do sheet**
Se o usuário clicar em **Saiba Mais** dentro do painel, o bottom sheet fecha e o drawer lateral de **Saiba Mais** abre normalmente — fluxo idêntico ao da Showcase.

**6. Fechamento**
Três caminhos:
- Botão **Fechar** no topo
- Clique fora do painel (área escurecida)
- Conversão via **Saiba Mais** (fecha automaticamente)

**7. Retorno ao estado original**
A Showcase volta exatamente ao estado em que estava — vídeo continua tocando, posição do scroll preservada, sem recarregamento.

---

## 5. Principais Funcionalidades

### Componente reutilizável `app-bottom-sheet`

| Funcionalidade | Descrição |
|---|---|
| Animação de entrada | Desliza de baixo para cima em 320ms (cubic-bezier) |
| Animação de saída | Desliza para baixo em 260ms |
| Backdrop | Camada escura semi-transparente (50%) com fade |
| Altura máxima | 90% da viewport (`max-height: 90vh`) |
| Conteúdo rolável | Área interna com scroll independente |
| Cabeçalho de fechamento | Botão "Fechar" com fundo preto, sempre acessível |
| Slot de header opcional | Via `<ng-template #header>` |
| Slot de footer opcional | Via `<ng-template #footer>` |
| Modo modal | Backdrop bloqueia interação com a página atrás (default) |
| Modo dismissível | Clicar no backdrop fecha o painel (default) |
| Acessibilidade | `role="dialog"`, `aria-modal="true"`, foco visível no botão Fechar |

### Componente de detalhe `app-post-details`

| Bloco | Conteúdo |
|---|---|
| Action bar | Curtir, Salvar, Compartilhar, Mais opções, Saiba Mais |
| Meta | Visualizações + tempo relativo |
| Título | `media.title` em destaque |
| Descrição | `media.description` + hashtags do `media.slang[]` |
| Canal | Avatar, nome, verificação, seguidores, botão de inscrição |
| Comentários | Input para novo comentário + lista renderizada de `post.comment.data[]` |

### Integração com o Showcase

| Gatilho | Comportamento |
|---|---|
| Clique em **Mais opções** | Abre o bottom sheet com o post atual |
| Clique em **Saiba Mais** dentro do sheet | Fecha o sheet e abre o drawer de Saiba Mais |
| Clique no backdrop ou no botão Fechar | Fecha o sheet sem efeitos colaterais |
| Troca de conteúdo na sidebar | Sheet fecha automaticamente ao desmontar o post atual |

---

## 6. Experiência do Usuário

### Como melhora a navegação

A Showcase é otimizada para um único caminho — assistir e converter. O Bottom Sheet adiciona **uma rota lateral opcional** sem competir com a principal. Quem quer mais contexto tem; quem não quer, não vê.

A escolha do padrão "bottom sheet" (em vez de drawer lateral, modal centralizado ou nova página) é estratégica:

- **Em mobile**, é o padrão nativo para "mais informações" em apps populares (YouTube, TikTok, Instagram). O usuário já sabe usar.
- **Em desktop**, o painel ascendente preserva o vídeo no topo, reforçando que a Showcase ainda está ativa.
- **Visualmente**, o gesto "subir do rodapé" sugere algo que **complementa** o que já está na tela — diferente de um drawer lateral, que sugere uma nova seção.

### Como facilita descoberta e consumo

O botão **Mais opções** já existia mas não tinha ação. Agora tem comportamento previsível, o que melhora a confiança do usuário na interface. O ícone `more_horiz` é convenção universal para "mais ações" — descoberta natural.

A separação física entre Showcase (mínima) e Bottom Sheet (rico) cria um modelo mental claro:
- A tela principal é para **consumir**
- O painel é para **interagir**

### Impacto na retenção e engajamento

- Curtir, salvar, comentar e seguir agora cabem na Showcase — sem migrar para a Watch
- Sessões mais longas por canal: o usuário pode explorar a vitrine, abrir detalhes pontuais e voltar
- Conversão preservada: o CTA "Saiba Mais" continua disponível dentro do painel
- Acessibilidade ampliada: usuários que querem mais contexto (ex: validar o canal) não são forçados ao caminho rápido

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A funcionalidade aumenta a **densidade de interação por sessão** sem sacrificar o foco da Showcase. Em outras palavras: a Showcase pode continuar sendo a página mais convertedora do produto, **e** ainda acolher comportamentos sociais quando o usuário pede.

Para canais e marcas, isso significa:

- A Showcase deixa de ser apenas vitrine e vira **superfície completa** de descoberta + decisão
- Comentários e likes feitos pelo bottom sheet alimentam o canal mesmo em campanhas com foco em conversão
- Reduz fricção para campanhas onde o usuário precisa "sentir confiança no canal" antes de converter

### Diferencial competitivo

| Plataforma | Padrão para "mais detalhes" em vitrine |
|---|---|
| YouTube | Tela cheia, sem layout dedicado para vitrine; comentários inline sempre visíveis |
| TikTok | Bottom sheet em mobile, modal lateral em desktop, sem CTA estruturado |
| Instagram Reels | Comentários em bottom sheet, mas sem CTA editorial |
| LinkedIn | Comentários inline; sem conceito de vitrine |
| **RealWe Showcase + Bottom Sheet** | Página dedicada de vitrine com detalhe sob demanda **e** CTA único de conversão |

### Possibilidades futuras

- **Reaproveitar `app-bottom-sheet`** em outras telas (Watch mobile, share rápido, configurações contextuais)
- **Bottom sheet com altura ajustável** (snap points: 50%, 90%, fullscreen) — gesto de arrastar
- **Métricas dedicadas:** taxa de abertura do bottom sheet vs. cliques diretos no Saiba Mais
- **Bottom sheet com tabs** para separar Detalhes / Comentários / Canal
- **Pré-busca de conteúdo** ao hover no botão Mais opções para abrir instantaneamente
- **Persistência de estado:** lembrar que o usuário já interagiu com o painel naquela sessão

---

## 8. Exemplos de Uso

### Usuário em dúvida sobre o canal
Um candidato chega à Showcase de uma vaga. O vídeo é convincente, mas antes de candidatar-se quer entender quem é a empresa. Clica em **Mais opções**, lê a descrição, confere a contagem de seguidores e o selo de verificado, fecha o painel e clica em **Saiba Mais** confiante.

### Engajamento social pontual
Um usuário assiste a uma série de vídeos institucionais. Quer curtir e comentar em um deles sem perder o ritmo da vitrine. Abre o bottom sheet, curte, deixa um comentário breve, fecha e continua para o próximo card da sidebar.

### Compartilhamento sem sair da página
Durante uma navegação rápida, o usuário identifica um vídeo que quer enviar para um colega. Abre o bottom sheet, clica em **Compartilhar**, copia o link e fecha — tudo sem trocar de tela.

### Validação antes da conversão
Em campanhas patrocinadas, o usuário desconfia. O bottom sheet permite que ele veja descrição completa, comentários reais e métricas antes de decidir se clica em **Saiba Mais** — reduz a percepção de "anúncio" e aumenta confiança.

---

## 9. Considerações Técnicas

### Onde está implementado

```
src/app/shared/components/bottom-sheet/
├── bottom-sheet.component.ts     ← componente reutilizável
├── bottom-sheet.component.html   ← template com slots de header/footer
└── bottom-sheet.component.scss   ← estilos do painel + handle/fechar

src/app/domain/showcase/components/post-details/
├── post-details.component.ts     ← detalhe do post (cópia da Watch)
├── post-details.component.html   ← template
└── post-details.component.scss   ← estilos

src/app/domain/showcase/pages/showcase/
└── showcase.component.{ts,html}  ← integração: signal showDetailsSheet + projeção
```

### Componentes principais

| Componente | Responsabilidade |
|---|---|
| `BottomSheetComponent` | Painel modal genérico que desliza de baixo para cima |
| `PostDetailsComponent` | Conteúdo de detalhe do post: ações, meta, título, descrição, canal, comentários |
| `ShowcasePageComponent` | Orquestra abertura/fechamento via signal `showDetailsSheet` |

### API do `app-bottom-sheet`

| Entrada | Tipo | Default | Função |
|---|---|---|---|
| `visible` | `model<boolean>` | `false` | Visibilidade two-way |
| `modal` | `input<boolean>` | `true` | Backdrop bloqueia clique atrás |
| `dismissible` | `input<boolean>` | `true` | Backdrop fecha ao clicar |
| `showHandle` | `input<boolean>` | `true` | Exibe cabeçalho com botão Fechar |
| `styleClass` | `input<string>` | `''` | Classe CSS adicional no painel |

| Slot | Uso |
|---|---|
| `<ng-template #header>` | Cabeçalho fixo (acima do conteúdo) |
| `<ng-template #footer>` | Rodapé fixo (abaixo do conteúdo) |
| `<ng-content>` | Corpo principal rolável |

### API do `app-post-details`

| Entrada / Saída | Tipo | Função |
|---|---|---|
| `post` | `input.required<Post>` | Conteúdo a ser detalhado |
| `learnMoreClicked` | `output<void>` | Evento emitido ao clicar em Saiba Mais |

### Integração no `ShowcasePageComponent`

```ts
readonly showDetailsSheet = signal(false);
```

```html
<app-button icon="more_horiz" (clicked)="showDetailsSheet.set(true)" />

<app-bottom-sheet [(visible)]="showDetailsSheet" styleClass="showcase-details-sheet">
  @if (showDetailsSheet() && post()) {
    <app-post-details
      [post]="post()!"
      (learnMoreClicked)="showDetailsSheet.set(false); showLearnMoreDrawer.set(true)" />
  }
</app-bottom-sheet>
```

### Decisões de design

- **Animação independente** do `app-drawer`: bottom sheet usa `translateY` puro para reforçar a direção vertical
- **z-index 999** alinhado ao drawer, garantindo que ambos coexistam corretamente quando o "Saiba Mais" abre a partir do sheet
- **`max-height: 90vh`** em vez de altura fixa — preserva uma faixa do vídeo visível no topo
- **Botão "Fechar" no topo** (em vez do handle "puxador") foi a opção adotada após iteração: reforça affordance e funciona melhor em desktop, onde gestos de arrasto não existem
- **`PostDetailsComponent` no domínio Showcase** (não em shared) porque é uma extração específica do detalhe usado pela vitrine; se a Watch passar a usar o mesmo componente no futuro, é candidato a migração para shared
- **Reset implícito do estado:** ao fechar o sheet, o conteúdo é desmontado via `@if`, evitando vazamento de estado entre posts diferentes

### Acessibilidade

- `role="dialog"` e `aria-modal="true"` no painel
- Foco visível no botão Fechar (`outline` em `:focus-visible`)
- Backdrop é `role="presentation"` e respeita `dismissible`
- Conteúdo interno mantém a estrutura semântica do `app-post-details` (h1, h3, listas)

### Performance

- O painel não é renderizado quando `visible() === false` (`@if` no template)
- O `app-post-details` só é instanciado quando o sheet está aberto E há `post()` (`@if (showDetailsSheet() && post())`)
- Animações são feitas via `@angular/animations` com `cubic-bezier`, executadas em compositor (GPU)
- `ChangeDetectionStrategy.OnPush` em todos os componentes envolvidos
