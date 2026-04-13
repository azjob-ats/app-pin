# Related List — Documentação

---

## 1. Visão Geral

A **Related List** é a seção de conteúdos relacionados exibida na sidebar direita da página Watch. Ela apresenta uma lista de vídeos que compartilham o mesmo universo temático do conteúdo em exibição, permitindo ao usuário continuar consumindo sem retornar ao feed.

### Onde se encaixa no produto

A RealWe opera em quatro estágios de engajamento:

```
Descoberta → Profundidade → Conversão → Comunidade
```

A Related List atua dentro do estágio de **Profundidade** com papel estratégico na **retenção**: ela é o mecanismo que evita o "dead end" após o fim de um vídeo, mantendo o usuário em loop dentro da plataforma sem precisar voltar ao feed.

---

## 2. Propósito

### Por que essa funcionalidade existe

Após assistir a um vídeo, o usuário que não converte imediatamente (não clica em "Saiba Mais") precisa de um caminho natural de continuidade. Sem a Related List, o único destino seria o feed — saindo do contexto e perdendo o momentum temático.

A Related List existe para **manter o usuário no fluxo de profundidade**, sugerindo conteúdos relevantes no momento em que o interesse já foi despertado.

### Qual problema ela resolve

| Problema | Como a Related List resolve |
|---|---|
| Usuário termina o vídeo e não sabe para onde ir | Oferece próximos passos visuais diretamente na sidebar |
| Usuário sai da plataforma após assistir 1 vídeo | Mantém o contexto temático acessível sem fricção |
| Descoberta limitada ao feed principal | Sugere conteúdo no momento de maior atenção do usuário |
| Canal sem visibilidade além do post atual | Expõe outros conteúdos do ecossistema da plataforma |

### Qual necessidade do usuário atende

- Continuar explorando conteúdos relacionados sem sair da tela atual
- Identificar rapidamente o criador e o canal antes de clicar
- Ter uma prévia visual do conteúdo (thumbnail) para decidir com mais contexto
- Ver métricas básicas (views e tempo) para avaliar relevância e popularidade

---

## 3. Objetivo

### O que se espera alcançar

1. **Retenção:** manter o usuário na plataforma após o fim de cada vídeo
2. **Profundidade contextual:** aprofundar o usuário em temas que já despertaram interesse
3. **Descoberta de canais:** expor criadores e empresas que o usuário ainda não segue

### Benefícios para o usuário

- Encontra mais conteúdo relevante sem precisar buscar ativamente
- Reconhece o canal antes de clicar, aumentando a confiança na escolha
- Navega entre vídeos mantendo o contexto temático
- Experiência fluída: clicar em um card abre um novo Watch sem perder o layout

### Benefícios para o negócio

- Aumenta o número de Watch por sessão
- Gera dados de navegação entre conteúdos (grafo de interesse do usuário)
- Reduz a taxa de saída da plataforma após o primeiro vídeo
- Cria oportunidade de distribuição orgânica para canais corporativos
- Base para algoritmo de recomendação personalizada no futuro

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Chegada à página Watch**
Ao abrir qualquer conteúdo longo, a sidebar direita já exibe automaticamente os conteúdos relacionados carregados em paralelo com o vídeo principal.

**2. Leitura do card**
Cada card apresenta:
- Avatar e nome do canal (com badge de verificado quando aplicável)
- Views e tempo relativo de publicação
- Thumbnail do conteúdo
- Título e descrição (com clamp para manter o layout limpo)

**3. Decisão de clicar**
O usuário avalia o canal, o título e a thumbnail antes de decidir. O hover destaca visualmente o card para indicar interatividade.

**4. Navegação**
Ao clicar, o usuário é redirecionado para `/watch/:id` do conteúdo selecionado. A sidebar é atualizada com os relacionados do novo vídeo, mantendo o ciclo de descoberta.

---

## 5. Estrutura Visual do Card

Cada item da Related List segue a estrutura de card com duas seções separadas por um divisor:

```
┌─────────────────────────────────────┐
│ ┌────┐  Nome do canal  ✓            │
│ │logo│  12,4K views • 2 dias atrás  │
│ └────┘                              │
├─────────────────────────────────────┤
│  Título do post          ┌────────┐ │
│  Descrição do conteúdo   │ thumb  │ │
│                          └────────┘ │
└─────────────────────────────────────┘
```

### Elementos do card

| Elemento | Descrição |
|---|---|
| **Avatar do canal** | Foto de perfil do criador, tamanho `sm` |
| **Nome do canal** | Truncado com reticências se ultrapassar a linha |
| **Badge verificado** | Ícone vermelho exibido apenas para canais oficiais |
| **Views** | Contagem formatada: `12,4K`, `1,2M` ou valor direto |
| **Tempo relativo** | Ex: `2 dias atrás`, `3h atrás`, `1 mês atrás` |
| **Divisor** | Linha horizontal separando header e body |
| **Título** | Até 2 linhas com reticências; peso médio |
| **Descrição** | Até 2 linhas com reticências; texto secundário |
| **Thumbnail** | Prévia visual do vídeo, 96×60px, no lado direito do body |

### Estados do card

| Estado | Comportamento |
|---|---|
| **Padrão** | Card com fundo transparente |
| **Hover** | Fundo secundário destacado, borda mais visível |
| **Focus (teclado)** | Outline vermelho de 2px para acessibilidade |
| **Sem thumbnail** | Ícone `play_circle` centralizado no lugar da imagem |

---

## 6. Experiência do Usuário

### Como melhora a navegação

A sidebar ocupa toda a altura da tela, renderizando múltiplos cards visíveis simultaneamente. O usuário pode fazer um scan rápido dos canais e títulos sem precisar rolar — a decisão é visual e instantânea.

### Como facilita a descoberta

Diferente do feed, que mistura todo tipo de conteúdo, a Related List apresenta conteúdos já filtrados pelo contexto do vídeo em exibição. Isso cria um **fluxo temático**: quem está assistindo sobre processo seletivo encontra outros vídeos do mesmo universo, aprofundando o interesse antes de converter.

### Como mantém o engajamento

Ao clicar em um card relacionado, a navegação acontece sem perda de contexto: o novo Watch carrega com sua própria Related List, criando um loop natural de descoberta que mantém o usuário dentro da plataforma.

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A Related List é o principal mecanismo de **distribuição orgânica interna**. Quando um canal publica conteúdo de qualidade, ele passa a aparecer nos relacionados de outros vídeos do mesmo tema — gerando visualizações sem custo de aquisição.

Isso cria um incentivo natural para que empresas e criadores invistam em conteúdo de profundidade: quanto mais relevante o vídeo, mais aparecer nos relacionados de terceiros.

### Possibilidades futuras

- **Algoritmo de relevância personalizado:** ordenar os cards com base no histórico de Watch do usuário, preferências de área e interações anteriores
- **Related por canal:** opção de filtrar a sidebar para exibir apenas outros vídeos do mesmo criador
- **Related patrocinado:** slot dedicado para conteúdo impulsionado dentro da sidebar, marcado como "Patrocinado", disponível apenas para canais que atendem ao score mínimo de qualidade
- **Série de conteúdos:** agrupar vídeos de uma mesma empresa em sequência lógica (episódios), exibindo o próximo episódio como primeiro card
- **Preview ao hover:** reprodução silenciosa de 3–5 segundos do vídeo ao passar o mouse sobre o card

---

## 8. Exemplos de Uso

### Recrutamento
Um usuário assiste a um vídeo sobre cultura de uma empresa de tecnologia. Na sidebar, a Related List exibe outros vídeos de empresas do mesmo setor — rotina de times, processos seletivos, benefícios. O usuário passa por três Watch consecutivos e, no terceiro, clica em "Saiba Mais" para se candidatar.

### Treinamento
Um profissional assiste ao primeiro episódio de uma série sobre metodologias ágeis. Os cards relacionados exibem os próximos episódios da série, tornando a continuidade intuitiva. Ao final da série, o botão "Saiba Mais" convida para a trilha de certificação.

### Descoberta de canais
Um usuário que nunca ouviu falar de uma empresa encontra o card dela na Related List enquanto assiste a um vídeo de um concorrente. O card exibe o avatar, o nome e uma thumbnail atrativa — o usuário clica, assiste e se inscreve no canal.

---

## 9. Considerações Técnicas

### Onde está implementado

A Related List está embutida na página Watch:

```
src/app/domain/watch/pages/watch/
├── watch.component.ts     ← lógica: filteredRelated(), formatCount(), timeAgo()
├── watch.component.html   ← template: seção .pp-sidebar
└── watch.component.scss   ← estilos: .pp-related-*
```

### Como os dados chegam

Os conteúdos relacionados são carregados em paralelo com o post principal usando `forkJoin`:

```ts
forkJoin({
  post: this.postApi.detail(id),
  related: this.postApi.list(1, 20),
})
```

O `filteredRelated` é um `computed()` que remove o post atual da lista e limita a 20 itens:

```ts
readonly filteredRelated = computed(() => {
  const current = this.post();
  return this.relatedPosts().filter((p) => p.id !== current?.id).slice(0, 20);
});
```

### Dados consumidos por card

```
Post (related)
├── id                        → routerLink para /watch/:id
├── channel.profilePicture    → avatar do canal
├── channel.profileName       → nome exibido no header
├── channel.verified          → exibe badge de verificado
├── views                     → formatado por formatCount()
├── timestamp                 → formatado por timeAgo()
├── media.title               → título no body
├── media.description         → descrição no body
└── media.thumbnail           → imagem no lado direito do body
```

### Componentes utilizados

| Componente | Responsabilidade no card |
|---|---|
| `UserAvatarComponent` | Renderiza o avatar do canal com tamanho `sm` |
| `RouterLink` | Navegação para `/watch/:id` ao clicar no card |
| `EmptyStateComponent` | Estado exibido quando não há relacionados |
