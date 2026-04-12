# Página Watch — Documentação

---

## 1. Visão Geral

A **página Watch** é o principal destino de consumo de conteúdo em vídeo longo dentro da plataforma RealWe. Ela é acessada quando um usuário clica em um conteúdo aprofundado publicado por um colaborador ou empresa.

Diferente do feed, onde o usuário descobre conteúdos de forma rápida e superficial, a página Watch é projetada para **imersão**: o usuário assiste a um vídeo completo, lê a descrição, interage com o criador e decide se quer avançar para uma ação concreta — como se candidatar a uma vaga, adquirir um produto ou se inscrever em um treinamento.

### Onde se encaixa no produto

A RealWe opera em quatro estágios de engajamento:

```
Descoberta → Profundidade → Conversão → Comunidade
```

A página Watch é o estágio de **Profundidade**. Ela é o ponto de entrada para o estágio de **Conversão** (via botão "Saiba Mais") e para **Comunidade** (via comentários e inscrição no canal).

---

## 2. Propósito

### Por que essa funcionalidade existe

O feed da plataforma exibe vídeos curtos (shorts) que funcionam como trailers — despertam curiosidade, mas não aprofundam. Quando o usuário quer ir além, ele precisa de um espaço dedicado para consumir o conteúdo completo, sem distrações.

A página Watch existe para **dar profundidade ao conteúdo**, criando um ambiente onde o criador pode construir autoridade e o usuário pode tomar decisões informadas.

### Qual problema ela resolve

| Problema | Como a Watch resolve |
|---|---|
| Conteúdo longo perdido no feed | Tela dedicada, sem competição visual |
| Usuário não sabe o que fazer após assistir | CTA "Saiba Mais" sempre visível |
| Dificuldade de descobrir mais conteúdos do mesmo contexto | Sidebar com conteúdos relacionados |
| Falta de conexão com o criador | Seção de canal com botão de inscrição |
| Sem espaço para diálogo | Seção de comentários integrada |

### Qual necessidade do usuário atende

- Consumir um conteúdo com profundidade, sem interrupções
- Entender quem criou o conteúdo e o contexto da empresa
- Decidir com mais informação antes de avançar para uma ação (vaga, compra, inscrição)
- Descobrir outros conteúdos relacionados ao que está assistindo

---

## 3. Objetivo

### O que se espera alcançar

A página Watch tem três objetivos centrais, em ordem de prioridade:

1. **Consumo:** garantir que o usuário assista ao vídeo até o final
2. **Conversão:** conduzir o usuário ao clique em "Saiba Mais"
3. **Descoberta:** manter o usuário na plataforma através de conteúdos relacionados

### Benefícios para o usuário

- Experiência imersiva e sem ruído para assistir vídeos longos
- Informações completas sobre o conteúdo e o criador numa única tela
- Fácil acesso à ação seguinte (candidatura, compra, inscrição)
- Descoberta orgânica de outros conteúdos relevantes

### Benefícios para o negócio

- Aumenta o tempo de sessão na plataforma
- Gera dados de retenção por vídeo (percentual assistido)
- É o principal ponto de conversão da plataforma
- Fortalece a autoridade dos canais corporativos
- Cria oportunidade para campanhas patrocinadas baseadas em desempenho

---

## 4. Como o Usuário Utiliza

### Passo a passo

**1. Acesso**
O usuário chega à página Watch ao clicar em um card de vídeo longo no feed, na página de explore ou em um perfil de canal. A URL segue o padrão `/watch/:id`.

**2. Carregamento**
Um skeleton animado é exibido enquanto o conteúdo é carregado. Assim que os dados chegam, o player e as informações aparecem simultaneamente.

**3. Assistindo ao vídeo**
O player ocupa toda a área esquerda da tela em proporção 16:9. O usuário pode:
- Clicar na tela ou no botão de play para iniciar
- Arrastar a barra de progresso para navegar no vídeo
- Ajustar o volume ou silenciar com um clique
- Entrar em tela cheia

**4. Interagindo com o conteúdo**
Abaixo do player, o usuário vê as ações disponíveis e as informações do post: likes, visualizações, título, descrição e hashtags.

**5. Conhecendo o canal**
Logo abaixo da descrição, o card do criador exibe o avatar, nome, badge de verificado, número de seguidores e o botão "Inscrever-se".

**6. Avançando (conversão)**
O botão **"Saiba Mais"** está sempre visível na barra de ações. Ao clicar, o usuário é direcionado para a ação principal vinculada ao conteúdo (formulário de candidatura, página de produto, inscrição em curso, etc.).

**7. Descobrindo mais conteúdo**
A sidebar direita exibe conteúdos relacionados. O usuário pode clicar em qualquer card para abrir um novo Watch sem sair da experiência.

**8. Comentando**
Na parte inferior da área esquerda, o usuário pode ler os comentários existentes e adicionar o próprio.

---

## 5. Principais Funcionalidades

### Player de vídeo

| Funcionalidade | Descrição |
|---|---|
| Play / Pause | Clique na tela ou no botão central |
| Barra de progresso | Arrastar para navegar; tooltip mostra o tempo ao passar o mouse |
| Controle de volume | Ícone sempre visível; slider expande ao passar o mouse |
| Tela cheia | Botão no canto inferior direito do player |
| Overlay de play | Botão centralizado visível quando o vídeo está pausado |
| Badge de duração | Exibido no canto inferior direito da mídia |
| Poster (capa) | Exibido antes do vídeo começar |

### Ações do conteúdo

| Ação | Descrição |
|---|---|
| **Like** | Curtir o conteúdo com contador em tempo real |
| **Salvar** | Guardar o post para assistir depois |
| **Compartilhar** | Compartilhar o link do conteúdo |
| **Mais opções (...)** | Menu adicional de ações |
| **Saiba Mais** | CTA principal de conversão |

### Canal

| Elemento | Descrição |
|---|---|
| Avatar | Foto de perfil do criador |
| Nome | Nome do canal ou colaborador |
| Badge verificado | Indicador visual de canal oficial |
| Seguidores | Contagem formatada (ex: 12,4K) |
| Inscrever-se | Botão para seguir o canal |

### Comentários

| Elemento | Descrição |
|---|---|
| Campo de novo comentário | Texto livre com envio por Enter ou botão |
| Lista de comentários | Avatar, nome, tempo, texto e likes de cada comentário |
| Respostas | Contador de respostas aninhadas |

### Conteúdos relacionados (sidebar)

| Elemento | Descrição |
|---|---|
| Thumbnail | Prévia visual do conteúdo |
| Título | Até 2 linhas, com reticências se necessário |
| Canal | Nome do criador com badge de verificado |
| Métricas | Views e tempo relativo (ex: "há 2 dias") |

### Estados da página

| Estado | O que aparece |
|---|---|
| **Carregando** | Skeleton animado em todo o layout |
| **Erro / não encontrado** | Mensagem de erro com sugestão de navegação |
| **Sem relacionados** | Mensagem informativa na sidebar |
| **Sem vídeo** | Thumbnail estático no lugar do player |

---

## 6. Experiência do Usuário

### Como melhora a navegação

A página Watch é intencionalmente focada. O layout de duas colunas — conteúdo à esquerda, relacionados à direita — evita que o usuário precise sair da tela para continuar descobrindo. Tudo o que é necessário para decidir está visível sem scroll:

- O vídeo
- O criador
- O CTA de conversão

### Como facilita descoberta e consumo

Os conteúdos relacionados na sidebar mantêm o usuário dentro do contexto temático. Se o usuário estava assistindo um vídeo sobre cultura de empresa, os cards relacionados sugerem outros vídeos do mesmo universo — criando um loop natural de descoberta sem que o usuário retorne ao feed.

### Impacto na retenção e engajamento

- O player customizado mantém o usuário no ambiente da plataforma (sem delegação ao YouTube ou Vimeo)
- A seção de comentários incentiva o retorno ao conteúdo após a publicação de respostas
- O botão "Inscrever-se" transforma visualizações isoladas em relacionamentos contínuos com canais
- A sidebar evita o "dead end" — o usuário sempre tem um próximo passo visual

---

## 7. Valor para o Negócio

### Como contribui para o crescimento da plataforma

A página Watch é onde o investimento das empresas na plataforma se converte em resultado. É o único ponto onde o botão "Saiba Mais" aparece com contexto completo — depois que o usuário já consumiu o conteúdo e desenvolveu interesse.

Isso torna a conversão mais qualificada do que anúncios tradicionais: o usuário que clica em "Saiba Mais" já assistiu ao vídeo, leu a descrição e conhece o criador.

### Diferencial competitivo

| Plataforma | Como trata conteúdo longo |
|---|---|
| LinkedIn | Feed sem player imersivo; redireciona para links externos |
| YouTube | Player poderoso, mas sem CTA nativo de conversão corporativa |
| Instagram | Foco em vídeos curtos; não tem página de profundidade |
| **RealWe Watch** | Player + contexto + CTA integrado + conteúdos relacionados |

### Possibilidades futuras

- **Métricas de retenção por vídeo:** percentual do vídeo assistido por usuário, ponto de abandono
- **Campanhas patrocinadas:** apenas conteúdos com boa retenção orgânica são elegíveis para impulsionamento
- **Watch History:** histórico de vídeos assistidos para recomendações personalizadas
- **Listas de reprodução automáticas:** encadeamento de Watches relacionados
- **Integração com Learn More:** formulários dinâmicos ativados diretamente pelo botão "Saiba Mais"
- **Co-watch:** assistir sincronizado com outras pessoas em contextos de onboarding e treinamento

---

## 8. Exemplos de Uso

### Recrutamento
Uma empresa de tecnologia publica um vídeo de 8 minutos onde um desenvolvedor sênior explica como é o processo seletivo. O usuário assiste, lê a descrição com os requisitos da vaga e clica em "Saiba Mais" para enviar o currículo.

### Treinamento de produto
Uma empresa de software publica uma série de vídeos sobre como usar sua plataforma. O usuário acessa o Watch de um episódio, assiste, e descobre na sidebar os próximos episódios da série.

### Cultura organizacional
Um colaborador publica um vídeo mostrando o escritório, os rituais de time e os benefícios da empresa. O usuário se inscreve no canal para acompanhar mais conteúdos e eventualmente se candidata.

### Lançamento de produto
Uma marca publica um vídeo de demonstração de um novo produto. O usuário assiste e clica em "Saiba Mais" para ser direcionado à página de compra ou pré-venda.

---

## 9. Considerações Técnicas

### Onde está implementado

```
src/app/domain/watch/pages/watch/
├── watch.component.ts     ← lógica e estado
├── watch.component.html   ← template
└── watch.component.scss   ← estilos
```

Rota: `/watch/:id`

### Componentes principais

| Componente | Responsabilidade |
|---|---|
| `WatchPageComponent` | Página principal; orquestra estado e dados |
| `ButtonLikeComponent` | Like com contador reativo |
| `ButtonComponent` | Salvar, Compartilhar, Saiba Mais, Mais opções |
| `ButtonInscriptionComponent` | Botão Inscrever-se do canal |
| `UserAvatarComponent` | Avatar do canal e dos comentários |
| `CommentInputComponent` | Campo de texto do novo comentário |
| `CommentSubmitComponent` | Botão de envio do comentário |
| `EmptyStateComponent` | Estado de erro e sidebar vazia |
| `SkeletonLoaderComponent` | Skeleton de carregamento |

### Integrações

| Integração | Descrição |
|---|---|
| `PostApi.detail(id)` | Carrega os dados do post atual |
| `PostApi.list()` | Carrega os conteúdos relacionados para a sidebar |
| `ActivatedRoute` | Lê o parâmetro `:id` da URL |
| `Fullscreen API` | Controla a entrada e saída do modo tela cheia |

### Modelo de dados consumido

```
Post
├── media.long          → URL do vídeo principal
├── media.thumbnail     → capa do player
├── media.title         → título exibido
├── media.description   → descrição do conteúdo
├── media.slang[]       → hashtags
├── views               → contador de visualizações
├── likes               → contador de likes
├── isLiked             → estado do like do usuário atual
├── timestamp           → data de publicação
├── channel
│   ├── profileName     → nome do criador
│   ├── profilePicture  → avatar
│   ├── verified        → badge de verificado
│   └── numberOfFollowers
└── comment.data[]      → lista de comentários
    ├── user, avatar, text, time, likes
    └── replies.totalRecords
```

### Arquitetura de estado

O componente usa **signals do Angular** para gerenciar o estado local:

- `post` — dados do post carregado
- `relatedPosts` — lista de conteúdos relacionados
- `isLoading / hasError` — estados de carregamento e erro
- `isPlaying, currentTime, duration` — estado do player de vídeo
- `isMuted, volume` — estado de áudio
- `isFullscreen` — estado da tela cheia

Todos os estados derivados (ex: `videoProgress`, `volumeIcon`, `filteredRelated`) são calculados com `computed()`, garantindo reatividade automática e eficiência de renderização.
