# EffectListCards — Documentação e Especificação

O componente `EffectListCards` é um **deck interativo de cartões** que combina navegação estilo "stack de cartas" com reprodução de vídeo curto diretamente no cartão ativo. Ele é a unidade visual central do bloco **Daily Story** da home e foi projetado para transmitir uma experiência moderna, fluida e visualmente atrativa, alinhada à identidade da plataforma.

---

## 🎯 Propósito e Valor para o Negócio

### Por que existe
A home precisa apresentar **histórias diárias** de creators e marcas de forma imersiva, sem forçar o usuário a sair do feed para consumir o conteúdo. O `EffectListCards`:

- **Aumenta o tempo de permanência** ao permitir preview de vídeo inline (sem navegação extra).
- **Simula uma experiência de deck de cartas**, estimulando exploração por gesto (swipe / drag).
- **Reforça a identidade do canal** (avatar, nome oficial, selo verificado) diretamente no cartão.
- **Entrega múltiplos posts por história** em um único slot visual, economizando espaço da home.

### Papel na plataforma
- Usado dentro do `DailyStoryComponent` (`daily-story.component.html`) como item de uma trilha horizontal.
- Cada instância representa **uma Story (um canal)** com N itens (posts) navegáveis.
- O clique no título do cartão ativo emite o `postId`, permitindo ao container navegar para a página do post.

---

## 📖 Guia do Usuário

Esta seção descreve como os usuários finais interagem com o componente.

### 1. Navegação entre Cartões
O usuário vê um **stack de cartões empilhados** (até 4 visíveis simultaneamente), com apenas a borda direita dos cartões de fundo aparecendo para reforçar a sensação de profundidade.

- **Arrastar (drag / swipe)**: o cartão ativo segue o ponteiro com leve rotação.
- **Soltar além do limite**: o cartão volta para o fundo da pilha e o próximo assume a frente, com transição suave tipo spring.
- **Soltar antes do limite**: o cartão retorna à posição original.
- **Paginação por dots**: abaixo do stack, uma linha de esferas permite pular diretamente para qualquer cartão. O dot ativo é maior e destacado na cor da marca.

### 2. Reprodução de Vídeo (Lazy Load)
Para preservar performance, o vídeo **não** é carregado de imediato.

- **Estado inicial**: o cartão ativo exibe a **thumbnail** com um botão central de play (fundo vermelho).
- **Ativação**: ao tocar no botão, o elemento `<video>` é inserido no DOM e a reprodução inicia automaticamente com áudio.
- **Fallback de autoplay**: caso o navegador bloqueie o autoplay com áudio, o vídeo reinicia no modo mudo para garantir reprodução contínua.

### 3. Controles de Reprodução
Uma vez tocando, o cartão oferece controles sobrepostos que **se ocultam automaticamente após 5 segundos** de inatividade:

- **Play / Pause**: botão central com fundo vermelho, ícone `pause` durante reprodução e `play_arrow` quando pausado. A ação de play/pause acontece **exclusivamente pelo botão** — cliques em outras áreas do overlay apenas revelam os controles, sem alterar o estado de reprodução.
- **Mute / Unmute**: botão no canto superior direito alterna o áudio.
- **Barra de progresso**: faixa inferior mostra o progresso com fill vermelho.
  - **Clicar** em qualquer ponto da barra salta para aquela posição.
  - **Arrastar (scrubbing)** permite busca fina; o vídeo pausa durante o arrasto e retoma ao soltar.
  - **Tooltip** aparece ao passar o mouse, mostrando o tempo exato daquela posição.
- **Tempo**: tempo atual e duração total são exibidos acima da barra.

### 4. Identidade do Canal (Footer)
Abaixo do stack, o componente exibe o **canal dono da Story**:

- **Título do post ativo** (clicável, emite o `postId` para o container).
- **Avatar circular** do canal.
- **Nome oficial** do canal.
- **Selo "verified"** (quando aplicável), em ícone Material Symbols na cor da marca.

### 5. Experiência Mobile
- Gestos de **swipe horizontal** substituem o drag com mouse.
- O scroll vertical da página **não é bloqueado**: o componente detecta a direção predominante do gesto e libera o scroll quando o movimento é vertical.
- O primeiro toque em um cartão pausado após auto-hide **revela os controles** sem pausar o vídeo — toques subsequentes interagem com os botões.

### 6. Single Playback (Reprodução Única)
Apenas **um vídeo toca por vez** em toda a aplicação. Ao iniciar a reprodução em um cartão, qualquer outro vídeo ativo em outro componente é automaticamente pausado, graças à integração com o `VideoSinglePlaybackService`.

---

## 🛠️ Guia do Desenvolvedor

Esta seção é destinada a desenvolvedores que desejam utilizar ou manter o componente.

### 1. Localização
```
src/app/shared/components/effect-list-cards/
├── effect-list-cards.component.ts
├── effect-list-cards.component.html
├── effect-list-cards.component.scss
└── effect-list-cards.interface.ts
```

### 2. Importação
Componente **standalone** — basta importar no componente consumidor:
```typescript
import { EffectListCardsComponent } from '@shared/components/effect-list-cards/effect-list-cards.component';
```

### 3. API do Componente

#### Inputs
| Nome    | Tipo                   | Obrigatório | Descrição                                            |
| ------- | ---------------------- | ----------- | ---------------------------------------------------- |
| `media` | `EffectListCardMedia`  | Sim         | Objeto com canal e lista de itens (posts) a exibir.  |

#### Outputs
| Nome         | Payload  | Disparado quando                                           |
| ------------ | -------- | ---------------------------------------------------------- |
| `titleClick` | `string` | O usuário clica no título do cartão ativo. Emite o `postId`. |

### 4. Modelo de Dados

```typescript
// effect-list-cards.interface.ts
export interface EffectListCardItem {
  postId: string;
  title: string;
  thumbnailUrl: string;
  short?: string; // URL do vídeo curto (opcional)
}

export interface EffectListCardChannel {
  profilePicture: string;
  profileNameOfficial: string;
  verified: boolean;
}

export interface EffectListCardMedia {
  id: string;
  channel: EffectListCardChannel;
  items: EffectListCardItem[];
}
```

### 5. Exemplo de Uso

```html
<app-effect-list-cards
  [media]="story"
  (titleClick)="onTitleClick($event)"
/>
```

Uso real dentro de `daily-story.component.html`:
```html
@for (story of stories(); track story.id) {
  <app-effect-list-cards [media]="story" (titleClick)="onTitleClick($event)" />
}
```

### 6. Implementação Técnica

- **State management**: totalmente baseado em **Angular Signals** (`signal`, `computed`, `input`, `output`) — sem RxJS no nível do componente.
- **Change detection**: `ChangeDetectionStrategy.OnPush`.
- **Drag engine**:
  - Threshold de 35% da largura do cartão (280px) para confirmar a troca.
  - Limite máximo de arrasto de 85% da largura.
  - Critério alternativo por velocidade (`0.4 px/ms`) para flicks rápidos.
  - Rotação proporcional ao deslocamento durante o drag.
- **Stack visual**: cartões posicionados com offset horizontal incremental de 8px por nível, com scale e rotateY sutis no segundo cartão quando o ativo cruza o threshold.
- **Progress tracking**: utiliza `requestAnimationFrame` para mover a barra a 60fps, em vez do evento `timeupdate` do HTML5.
- **Auto-hide**: controles desaparecem após 5s de inatividade durante reprodução.
- **Single playback**: integrado ao `VideoSinglePlaybackService` (em `@shared/services/`) para garantir que apenas um vídeo toque por vez na aplicação.
- **Lazy video load**: o elemento `<video>` é inserido no DOM somente após o clique no botão de play.
- **Reset automático**: ao trocar de cartão ativo, o estado de vídeo (play, progress, mute, controls) é totalmente resetado.

### 7. Acessibilidade
- Todos os botões declaram `type="button"` e `aria-label` dinâmico (Play/Pause, Mute/Unmute).
- A barra de progresso expõe `role="slider"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- A paginação por dots usa `role="tablist"` com `aria-selected` e `aria-label` em cada dot.
- O selo "verified" possui `aria-label="Verified account"`.
- `focus-visible` com outline visível em todos os controles interativos.

### 8. Estilização
- Largura fixa do cartão: **280px**, altura **380px**, `border-radius: 18px`.
- Cores seguem o design system via CSS variables (`--pin-red`, `--pin-text-primary`, `--radius-circle`, `--radius-pill`, etc.).
- Gradiente sutil de overlay para legibilidade dos controles em qualquer thumbnail.
- Tipografia e espaçamentos consistentes com `utility.scss` global.

### 9. Styleguide
O componente está catalogado no styleguide interno:
- **URL**: `/styleguide/comp-effect-list-cards`
- Permite inspeção visual isolada e validação de comportamento durante o desenvolvimento.

---

## 🚫 Evitar

- Adicionar lógica de negócio dentro do componente — ele é de apresentação pura.
- Bloquear scroll vertical global durante o drag horizontal.
- Reproduzir mais de um vídeo simultaneamente (use sempre o `VideoSinglePlaybackService`).
- Emitir ações de play/pause por clique fora do botão central.
- Carregar todos os vídeos de uma Story antecipadamente — respeitar o lazy load por thumbnail.

---

## 🎯 Resultado Esperado

Um componente visualmente impactante e performático, que entrega navegação fluida estilo "deck de cartas" com preview de vídeo inline, mantendo consistência com o design system e acessibilidade AA.
