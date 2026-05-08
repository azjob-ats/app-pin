quero que você me ajuda a planejar, quero o recurso:
- visualizar inscrição (Visualizar inscrições efetuadas pelo usuário, essas inscrições são as ações do botão "saiba mais" e não a inscrição de um canal).

- Portfólio Público do Creator(A página de visualização do currículo do candidato funciona como um portfólio online e currículo digital).

- completar curriculo(Permitir que o candidato complete e edite suas informações de forma visual e interativa, evitando o cansaço de formulários tradicionais. A experiência é inspirada na trilha do Duolingo: simples, gamificada e amigável).
ESTRUTURA VISUAL
Topo da Página
Spinner de Etapas centralizado no topo da tela, indicando:


Etapa atual


Total de etapas completas / pendentes
Trilhas (Seções do Currículo)
Cada trilha representa um grupo de informações. São exibidas em formato de curva (não em linha reta), como no Duolingo.
 Cada trilha contém:
Ícone representativo


Nome da trilha


Círculo com cor temática


Spinner de progresso individual (amarelo ouro ao redor do círculo)


Ação de clique que abre um Bottom Sheet
DOCUMENTAÇÃO DAS TRILHAS
1. Habilidades
Ícone:  (Espada)


Cor do círculo: Verde claro


Bottom Sheet:


Campo de texto com placeholder: "Digite uma habilidade e pressione Enter"


Chips com habilidades adicionadas (ex: React, JavaScript, etc.)


Cada Chip tem botão de remoção
2. Experiência Profissional
Ícone:  (Maleta)


Cor do círculo: Azul escuro


Bottom Sheet:


Campos para:


Cargo


Nome da empresa


Modalidade (tempo integral, estágio etc.)


Datas (entrada e saída)


Localização


Modelo de trabalho (Remoto, Híbrido, Presencial)


Upload de logo da empresa


Cada experiência adicionada aparece em uma lista com botão de edição ou exclusão
3. Formação Acadêmica
Ícone:  (Chapéu de formatura)


Cor do círculo: Roxo


Bottom Sheet:


Campos para:


Nome da instituição


Curso


Data de início e término


Upload de logo da instituição


Lista das formações com opção de editar/remover
4. Idiomas
Ícone:  (Globo)


Cor do círculo: Azul claro


Bottom Sheet:


Campo com sugestões de idiomas (autocomplete)


Ao selecionar, adiciona como Chip


Chips com opção de remoção
5. Certificações, Cursos e Premiações
Ícone: (Medalha)


Cor do círculo: Laranja


Bottom Sheet:


Campos para:


Nome do certificado/curso/premiação


Instituição


Data de início e término


Upload de logo da instituição


6. Sobre
Ícone: (Pessoa falando)


Cor do círculo: Cinza escuro


Bottom Sheet:


Campo de texto com contador de caracteres


Preview em tempo real do texto no currículo
7. Informações de Contato
Ícone:  (Telefone)


Cor do círculo: Rosa


Bottom Sheet:


Campos para:


Email


Telefone


Links de redes sociais (LinkedIn, GitHub, etc.)


Validação de e-mail e campos obrigatórios
8. Pronome e PCD
Ícone:  (Usuário)


Cor do círculo: Marrom claro


Bottom Sheet:


Seleção de pronome


Check para indicar se é PCD (Pessoa com Deficiência)


Campo opcional para observações
Interação
O usuário clica no ícone ou nome da trilha


Um Bottom Sheet com layout específico da trilha é aberto


Preenchimento visual e intuitivo


O progresso da trilha é atualizado com base nas informações salvas


Trilhas completas mudam de cor (ex: verde)

-----------
importante os recurso deve ser acessado atraves do sidebar, com o icone 

-----------

# Organizar tudo na mesma pagina, ou paginas difrente? exemplo pagina de perfil conter esse recursos em abas...

-----------
Revisei README + docs (Creator Institucionalizado, Guia do Usuário, Guia para Criadores) e a estrutura atual de src/app/domain/. Antes de propor um plano de implementação, preciso alinhar a arquitetura de páginas — porque os três recursos que você listou têm audiências diferentes e isso muda tudo.

Diagnóstico rápido
Os três recursos não são "do mesmo tipo":

Recurso	Audiência	Visibilidade	Padrão de UX
Visualizar inscrição (cliques no "Saiba Mais")	só o próprio usuário	privado, com auth guard	lista/histórico, dentro do shell
Portfólio Público do Creator	qualquer pessoa (recrutador, mercado, ex-empresa)	público, indexável, URL @username	tela-âncora institucional, "currículo defensável"
Completar currículo (estilo Duolingo)	só o próprio usuário	privado	fluxo focado, sem distrações, gamificado
Pontos importantes que vêm da doc:

O Portfólio Público é tela-âncora, não configuração — README explicita: "não acessório, não tela de configuração" e "vem antes do feed na priorização". Isso é forte: não deveria viver como aba de perfil — é o produto, não um cantinho dele.
O fluxo Duolingo-like só funciona com tela cheia, sem chrome, navegação progressiva. Se vive em aba, perde o efeito.
"Inscrições efetuadas" é histórico privado — encaixa numa área tipo "Minhas atividades".
Recomendação: arquitetura híbrida (3 superfícies, não 1 página com abas)

PÚBLICO
└── /@:username                         → Portfólio Público (tela-âncora)
       ├── visão geral (hero + stats)
       ├── conteúdos publicados
       ├── empresas pelas quais passou
       └── métricas auditáveis (retenção, conversão)

PRIVADO (dentro do shell, área "Minha conta")
└── /me                                 → Hub do usuário, com abas:
       ├── /me/inscriptions             → aba "Minhas inscrições" (Saiba Mais)
       ├── /me/resume                   → aba "Meu currículo" (preview + editar)
       └── /me/stats                    → (se for creator) métricas privadas

PRIVADO FULLSCREEN (fora do shell)
└── /resume/complete                    → Fluxo Duolingo (sem header/footer)
       └── trilha de cards, 1 passo por tela, progresso, micro-recompensas
Por que não tudo em abas de uma página só:

Mistura público/privado na mesma rota gera complexidade de guard e SEO ruim para o portfólio.
Aba "completar currículo" embutida quebra o foco que o estilo Duolingo precisa.
O Portfólio Público merece URL canônica compartilhável (realwe.com/@joao) — não /me?tab=portfolio.
O que fica acoplado: /me/resume (aba privada) tem botões "Visualizar como público" (→ /@username) e "Completar mais" (→ /resume/complete). Os três recursos conversam via navegação, não via DOM compartilhado.

Antes de eu detalhar rotas, módulos e contratos, preciso de duas decisões suas:

AskUserQuestion
OUT
User has answered your questions: "Qual arquitetura de páginas você prefere para esses 3 recursos?"="3 páginas totalmente separadas", "O 'currículo' a ser preenchido é do Creator Institucionalizado (com métricas de conteúdo) ou do candidato comum (formação/experiência)?"="Creator Institucionalizado". You can now continue with the user's answers in mind.
Combinado: 3 páginas totalmente separadas + currículo focado em Creator Institucionalizado. Aqui vai o plano detalhado.

Arquitetura de rotas

PÚBLICA (sem auth, indexável, dentro do shell)
└── /@:handle                          → Portfólio Público do Creator

PRIVADA (auth guard, dentro do shell)
└── /inscriptions                      → Minhas inscrições (cliques no "Saiba Mais")

PRIVADA FULLSCREEN (auth guard, FORA do shell — sem header/sidebar)
└── /creator/onboarding                → Trilha Duolingo (completar currículo)
└── /creator/onboarding/:step          → step atual da trilha (deep link)
Página 1 — Portfólio Público /@:handle
Propósito (doc): "currículo defensável com métricas auditáveis que o mercado reconhece". É a tela-âncora.

Seções (top → bottom, 1 página long-scroll):

Hero institucional — foto, nome, headline ("Designer at Nubank · ex-Itaú"), CTA "Seguir" / "Convidar"
Métricas auditáveis — retenção média, taxa de conversão, total de conteúdos, ranking na vertical
Empresas pelas quais passou — timeline horizontal (Nubank 2024-presente · Itaú 2022-2024)
Conteúdos âncora — grid dos 6-12 destaques escolhidos pelo creator
Acervo completo — grid paginado com filtro por empresa
Estilo / verticais — chips das categorias dominantes
Comunidade — contagem de seguidores, link "tirar dúvida"
Domain novo: domain/creator-portfolio/
Resolver: carrega creator pelo handle antes da página renderizar (evita FOUC).
404: handle inexistente → tela "Creator não encontrado" com link pro /search.

Página 2 — Minhas inscrições /inscriptions
Propósito: histórico de conversões do usuário-consumidor (cliques em "Saiba Mais").

Layout:

Header com filtros: tipo (vaga, treinamento, produto, experiência, contato) · status (enviada · em análise · aprovada · recusada · expirada) · período
Lista de cards com:
Thumbnail do conteúdo origem + "Presented by Empresa · by Creator"
Tipo da inscrição + título da ação ("Inscrição em Vaga: Frontend Sr")
Data do clique, status atual, próximo passo (se houver)
Ações: ver detalhe · cancelar · re-acessar destino
Empty state forte: "Você ainda não se inscreveu em nada — explore o feed"
Domain novo: domain/inscriptions/
Auth guard: redireciona para login com returnUrl=/inscriptions.

Página 3 — Completar Currículo (trilha Duolingo) /creator/onboarding
Propósito: UX gamificada para preencher o currículo do Creator Institucionalizado, sem fadiga de formulário.

Princípios:

Fullscreen sem chrome (rota fora do shell, igual /auth)
1 pergunta por tela, animação de transição
Barra de progresso + XP/streak visível no topo
Skip permitido, mas com penalidade visual ("nó cinza" na trilha)
Auto-save a cada step (recuperável se sair)
Trilha (módulos ordenados, cada um = uma "ilha"):

#	Módulo	O que coleta
1	Identidade	foto, nome de autor, headline, bio curta, áudio opcional de apresentação
2	Empresa atual	seleção de empresa, cargo, data início (autocomplete via API de empresas)
3	Trajetória	empresas anteriores (timeline editável, drag-drop)
4	Verticais	até 3 categorias de expertise (UX, Engenharia, Produto…)
5	Estilo autoral	escolha de tom (didático, técnico, bastidor), formato preferido (short, long, ambos)
6	Conteúdos âncora	seleciona até 12 conteúdos do acervo para destacar no portfólio
7	Comunidade	handles externos opcionais (LinkedIn, GitHub, Behance)
8	Preview público	preview do portfólio renderizado, botão "Publicar"
Domain novo: domain/creator-onboarding/
Estado: signal store com o "currículo em construção" (CreatorResumeDraftStore), persistido no backend a cada step.

Conexões entre as 3 páginas

Portfólio Público (/@:handle)
   └── botão "Editar meu portfólio" (se for o dono) → /creator/onboarding/:lastStep

Inscrições (/inscriptions)
   └── card "Quer ser visto também? Complete seu portfólio" → /creator/onboarding

Trilha Duolingo (/creator/onboarding)
   └── step 8 "Preview público" → /@:handle (read-only, com botão voltar)
Camadas (seguindo a arquitetura do projeto)
Para cada um dos 3 domains, criar conforme padrão app-pin:


shared/apis/
  ├── creator-portfolio.api.ts          → GET /creators/:handle
  ├── inscriptions.api.ts               → GET /me/inscriptions, PATCH cancel
  └── creator-resume.api.ts             → GET/PATCH /me/creator-resume

shared/interfaces/dtos/                 → contratos brutos do backend
shared/interfaces/entities/             → modelos de domínio
shared/maps/                            → DTO ↔ Entity

domain/creator-portfolio/pages/creator-portfolio/
domain/inscriptions/pages/inscriptions/
domain/creator-onboarding/
   ├── pages/onboarding-shell/          → host fullscreen + barra de progresso
   ├── pages/steps/identity/
   ├── pages/steps/current-company/
   ├── pages/steps/journey/
   ├── pages/steps/verticals/
   ├── pages/steps/style/
   ├── pages/steps/anchor-content/
   ├── pages/steps/community/
   ├── pages/steps/preview/
   ├── services/creator-resume-draft.store.ts
   └── index.routes.ts
Ordem sugerida de implementação
Contratos (DTOs + Entities + Maps + APIs vazios com mock) — destrava paralelização
Portfólio Público primeiro (read-only, sem dependência de currículo preenchido — usa mocks)
Inscrições (independente das outras, ciclo curto)
Trilha Duolingo por último, módulo a módulo (cada step é um PR pequeno)
Conectar os links cruzados entre as 3 páginas
Pontos abertos para você decidir antes de eu detalhar mais
Handle do creator: /@joao (estilo Twitter/Instagram) ou /c/joao ou /creator/joao? O @ é mais elegante mas exige cuidado com encoding.
Step 6 (Conteúdos âncora): o creator já terá conteúdos publicados nesse momento? Ou o onboarding pode rodar antes do primeiro vídeo (e esse step fica opcional)?
Inscrições do tipo "compra" e "produto": entram na mesma lista das inscrições de vaga, ou a aba/página separa "candidaturas" de "compras"?
Quer que eu avance detalhando algum desses 3 pontos, ou prefere que eu já comece os contratos (DTOs/Entities/APIs) com mocks para destravar?

-------------------

Resumo do que foi implementado
Camada de dados (segue arquitetura layered do projeto)
environment.ts — endpoints CREATOR_PORTFOLIO, INSCRIPTIONS, CREATOR_RESUME + rotas CREATOR_PORTFOLIO, INSCRIPTIONS, CREATOR_ONBOARDING.

Contratos (DTO → Entity → Map → API):

Portfólio Público: creator-portfolio.ts entity · DTO · map · api
Inscrições: inscription.ts entity · enums · DTO · map · api
Currículo do Creator: creator-resume.ts entity · enums · DTO request · DTO response · map · api
Páginas (3 superfícies separadas, conforme decisão)
1. Portfólio Público → :username/portfolio — pública, dentro do shell. Hero institucional, métricas auditáveis (4 cards), trajetória cross-empresa, conteúdos âncora, verticais, comunidade. Usa forkJoin para carregar tudo em paralelo.

2. Minhas Inscrições → /inscriptions — privada, dentro do shell. Filtros por tipo + status, badges coloridos por status, ação "Cancelar" condicional, empty state com CTA para o onboarding.

3. Trilha Duolingo → /creator/onboarding — fullscreen (fora do shell). Composta de:

shell com topbar (progresso + streak) e trilha lateral com nós circulares estilo Duolingo (is-completed, is-current, is-skipped, is-pending)
store reativa (signals + observable) com saveStep/publish e auto-save por etapa
step-frame compartilhado com botões Voltar / Pular / Continuar
8 steps: identity, current-company, journey, verticals, style, anchor-content, community, preview (com card de pré-visualização do portfólio público + botão Publicar)
Roteamento
app.routes.ts — /creator/onboarding registrada antes do shell (fullscreen) · /inscriptions dentro do shell · :username/portfolio registrada antes de :username (Channel) para não ser engolida.

Próximos passos sugeridos
Backend: implementar os 11 endpoints declarados em environment.API.CREATOR_PORTFOLIO, INSCRIPTIONS, CREATOR_RESUME.
Auth guard: as rotas /inscriptions e /creator/onboarding ainda não bloqueiam acesso anônimo — falta um canActivate (não há um guard padrão neste projeto ainda, pode ser criado em shared/guards/).
Step 6 (Conteúdos âncora): hoje mostra empty state. Quando houver listagem de pins do creator, plugar um grid selecionável.
Mocks: criar *.mock.ts em shared/apis/ (padrão learn-more.mock.ts) para destravar testes manuais antes do backend.


---------------------
http://localhost:4200/creator/amanda — portfólio completo (publicado, com hero + 4 KPIs + 2 experiências + 3 highlights + skills + idiomas + certs + 12.4k seguidores + socials)
http://localhost:4200/creator/lucas — outro creator (PCD, sem cover/educations, mostra estados parciais)
http://localhost:4200/creator/newcomer — isPublished: false → notice "ainda finalizando"
http://localhost:4200/creator/currentuser — você é o dono → mostra botão "Editar portfólio"
http://localhost:4200/creator/qualquercoisa — 404 com tela "Creator não encontrado" + CTA /search

http://localhost:4200/creator/currentuser
http://localhost:4200/creator/amanda
http://localhost:4200/creator/lucas
http://localhost:4200/inscriptions
http://localhost:4200/resume/complete