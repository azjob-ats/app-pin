# MINHA EMPRESA — Canal Corporativo Multi-Produto

A área **Minha Empresa** é o backstage do canal da empresa na RealWe. Ela deixa de ser exclusiva do recrutador e passa a ser o ambiente operacional de qualquer time que publica algo no canal: RH (vagas), Comercial (produtos e serviços), Educação (treinamentos e conteúdo), Comunicação (notícias) e Operações (experiências e eventos).

O modelo é simples e se repete em todos os verticais:

> **A empresa publica Produtos. Cada Produto carrega um botão "Saiba Mais". O Saiba Mais abre um drawer com um formulário dinâmico. Cada submissão entra em um Kanban de Triagem do Produto.**

Esse loop é o que conecta descoberta (vídeo curto), profundidade (vídeo longo), conversão (Saiba Mais) e operação (Triagem) — o funil descrito em [doc/Regra de negocio RealWe.md](../../doc/Regra%20de%20negocio%20RealWe.md).

---

## 1. Conceito: Produto como objeto-mãe

**Produto** é o objeto canônico publicado por um canal. Vaga, Serviço, Treinamento, Notícia e Experiência são *tipos* de Produto. Todos compartilham:

- Mesmo ciclo de vida (Backlog → Em campanha → Pausada → Encerrada)
- Mesmo motor de publicação (Kanban de Gerenciamento de Produtos)
- Mesmo motor de conversão (botão Saiba Mais → drawer com formulário dinâmico — ver [spec/learn-more/DYNAMIC_ENGINE.md](../learn-more/DYNAMIC_ENGINE.md))
- Mesmo destino operacional (Kanban de Triagem segmentado por tipo)
- Mesma elegibilidade para Campanha Patrocinada Qualificada (ver [spec/sponsored-campaigns/doc.md](../sponsored-campaigns/doc.md))

O que muda entre tipos de Produto é apenas:

1. O **preset de campos** do formulário de criação (o que o time precisa preencher).
2. O **preset do formulário de Saiba Mais** (o que o público precisa responder).
3. O **pipeline default da Triagem** (as fases pelas quais a submissão caminha).

---

## 2. Catálogo de Tipos de Produto

| Tipo | Time dono | Objetivo do Saiba Mais | Pipeline default da Triagem |
|---|---|---|---|
| **Vaga** | RH / Recrutamento | Candidatura | Recebidas → Adequada → Entrevista → Documentos → Aprovado → Rejeitado |
| **Produto / Serviço** | Comercial | Lead qualificado | Recebido → Qualificado → Reunião → Proposta → Fechado → Perdido |
| **Treinamento / Conteúdo** | Educação | Inscrição em curso, webinar, workshop | Inscrito → Confirmado → Presente → Concluído → Certificado |
| **Notícia / Comunicado** | Comunicação | Opt-in editorial, lista de distribuição | Recebido → Segmentado → Engajado → Assinante |
| **Experiência / Evento** | Operações | Agendamento de visita, demo, encontro | Solicitado → Agendado → Confirmado → Realizado |

Pipelines são **default editáveis** — cada empresa ajusta fases, cores e ordem.

---

## 3. Jornada do Administrador do Canal

A jornada foi pensada para ser simples, eficiente e visual desde o primeiro acesso. O ponto de partida é criar ou se associar a uma Organização, garantindo que todos os Produtos e Triagens estejam vinculados à empresa real.

Capacidades disponíveis após associação:

- Publicação de Produtos (qualquer dos 5 tipos)
- Gerenciamento das Triagens recebidas por Produto
- Visualização de perfis e submissões
- Criação de formulários dinâmicos personalizados (Saiba Mais)
- Acompanhamento de status e fases do funil
- Mensagens para o público que submeteu
- Permissões granulares por time (RH, Comercial, Educação, Comunicação, Operações)
- Página pública do canal com todos os Produtos ativos
- Métricas de funil (retenção de vídeo, CTR Saiba Mais, conversão por Produto)

### Associação à Organização

Ao acessar a plataforma pela primeira vez, o usuário é orientado a criar ou se associar a uma Organização (empresa).

- Se o domínio do e-mail for corporativo (ex.: `@nubank.com.br`), a plataforma valida automaticamente e associa o usuário.
- Se o domínio for público (ex.: Gmail), o usuário envia uma solicitação de associação, aprovada por um administrador.
- Apenas após a associação, o usuário acessa o Painel da Organização.

---

## 4. Organização — Ver e Criar Organizações

Ponto de entrada do backstage corporativo.

```
Menu → Minha Empresa → Ver e Criar Organizações
```

### Layout da tela

**1. Bloco "Nova Organização"** (sempre visível)

Quadro centralizado com borda pontilhada (140px de altura), contendo:

- Ícone de "+"
- Texto: "Nova organização"
- Ação ao clicar: redireciona para a tela de criação.

**2. Bloco "Organizações já existentes"**

Se o usuário já está vinculado a uma ou mais organizações, elas são exibidas à direita do bloco "Nova organização", em cards horizontais.

Cada card contém:

- Retângulo com borda simples (sem preenchimento)
- Topo esquerdo: logo da empresa
- Topo direito: ícone de estrela (favoritar)
- Centro: nome da organização
- Ao lado do nome: ícone de 3 pontos verticais (mais opções) com Dropdown:
  - Deixar de ser membro
  - Excluir organização (se admin)
  - Ver membros

Ação ao clicar no card: redireciona para o **Painel da Organização** (com a tab **Gerenciar Produtos** aberta por padrão).

---

## 5. Nova Organização

A tela **Criar Organização e Página da Empresa** permite cadastrar oficialmente a empresa, criando tanto a estrutura interna (gestão de Produtos e Triagens) quanto a página pública do canal (`empresa.realwe`).

Essa etapa é a base para:

- Centralizar a gestão de Produtos em um único Painel
- Associar membros a uma organização validada
- Garantir autenticidade via verificação do e-mail corporativo
- Criar um subdomínio exclusivo (ex.: `nubank.realwe`)
- Expor marca e cultura na página pública

### Layout

**Header**

- Esquerda: botão com seta ← (voltar para Ver e Criar Organizações)
- Centro: título "Nova Organização"

**Body (formulário)**

- **Empresa** (texto)
- **E-mail Corporativo** (texto, com verificação automática via link)
  - Deve ser o mesmo do usuário logado
  - Após clicar no link recebido, o campo é validado
- **Domínio realwe** (texto, gerado a partir do nome — ex.: `nubank.realwe`)
  - Erro inline se já existir
- **Site da Empresa** (texto — ex.: `https://nubank.com.br`)
- **Redes Sociais** (URL, múltiplas entradas; Enter transforma em badge removível)
- **Banner da Página da Empresa** (upload)
- **Logo da Página da Empresa** (upload)
- **Sobre a Empresa** (textarea)

**Footer**

- Checkbox: "Declaro que sou representante oficial desta organização"
- Botão: **Criar página e organização**

### Regras de validação

- Tudo válido → redireciona para Ver e Criar Organizações
- Erros → mensagem no topo "Verifique os campos abaixo"; campos inválidos com borda vermelha e texto explicativo

---

## 6. Painel da Organização

Ambiente central de operação do canal. Substitui o antigo "Painel Kanban de Vagas" — agora suporta qualquer tipo de Produto e centraliza Triagens.

### Tabs de Gestão

```
[ Gerenciar Produtos ] [ Triagens ] [ Página da Empresa ] [ Pessoas & Permissões ] [ Métricas ]
```

| Tab | Função |
|---|---|
| **Gerenciar Produtos** | Kanban de publicação (Backlog → Em campanha → Pausada → Encerrada). Sub-tabs por tipo de Produto |
| **Triagens** | Kanban de submissões recebidas via Saiba Mais. Filtros por tipo, Produto, responsável, período |
| **Página da Empresa** | Configuração da página pública (`empresa.realwe`) |
| **Pessoas & Permissões** | Membros, Funções, Grupos. Ganha papéis novos: Comercial, Educação, Comunicação, Operações |
| **Métricas** | Funil consolidado: retenção de vídeo, CTR Saiba Mais, taxa de conversão por Produto, comparativo por tipo |

---

## 7. Tab: Gerenciar Produtos

Tela onde os times publicam, pausam e encerram Produtos. O Kanban de publicação é o **mesmo para todos os tipos** — apenas os cards mudam.

### Sub-tabs por tipo

```
[ Vagas ] [ Produtos ] [ Treinamentos ] [ Notícias ] [ Experiências ] [ + Todos ]
```

A sub-tab **Todos** mostra todos os Produtos numa única visão (com badge de tipo em cada card).

### Fases padrão (idênticas para todos os tipos)

1. **Backlog** — onde Produtos novos são criados e aguardam publicação.
2. **Em campanha** — Produtos visíveis no motor de busca, na timeline e na página pública.
3. **Pausada** — Produtos ocultos temporariamente (não excluídos).
4. **Encerrada** — Produtos finalizados, removidos da exibição pública.

O administrador pode adicionar/remover fases personalizadas além das padrão.

### Adicionar nova fase

Botão **"+ Nova fase"** ao final da última coluna. Permite definir nome e cor.

### Layout das fases

- Largura: 278px
- Altura: 100%
- Header da coluna: 280x40px
- Espaçamento entre header e coluna: 8px
- Header exibe: nome da fase + badge com a contagem de Produtos

### Comportamento por fase

**Backlog** — header tem botão "+" (abre modal **Criar Produto**). Ao mover para Em campanha, o Produto fica visível publicamente.

**Em campanha** — Produto ativo, recebendo submissões via Saiba Mais. Aparece em: motor de busca, timeline, página pública (`empresa.realwe`). Cada card mostra contagem de submissões recebidas. Arrastável para Pausada/Encerrada.

**Pausada** — Produto removido temporariamente da exibição pública. Não é encerrado nem excluído. Pode ser reaberto (volta para Em campanha) ou encerrado.

**Encerrada** — Produto desativado totalmente. Sai de busca, timeline e página pública. Submissões já recebidas permanecem acessíveis na Triagem. Possível: ver histórico, clonar, reabrir (volta para Backlog).

### Card do Produto (variação por tipo)

Todos os cards mostram: título + badge do tipo + badge da fase + contagem de submissões + última atualização. Os campos abaixo variam por tipo:

- **Vaga**: cargo, localidade, modalidade, contrato
- **Produto/Serviço**: nome, categoria, faixa de preço
- **Treinamento**: título, data, formato (online/presencial), vagas restantes
- **Notícia**: manchete, autor, data de publicação
- **Experiência**: nome, datas disponíveis, local

---

## 8. Criar Produto

Modal multi-etapas acessado pelo botão "+" na fase **Backlog**. O fluxo é genérico, com **presets por tipo** definidos na Etapa 0.

### Header

Botão para fechar o modal + texto centralizado:
> "Publique um Produto, é grátis e sempre será"

### Etapa 0 — Tipo de Produto

Seleção do tipo: Vaga | Produto/Serviço | Treinamento | Notícia | Experiência.

A escolha define os campos das próximas etapas e o pipeline default da Triagem.

### Etapa 1 — Identificação

Campos variáveis por tipo:

| Tipo | Campos |
|---|---|
| Vaga | Cargo, Tipo de local (Presencial/Remoto/Híbrido), Localidade, Tipo de vaga (CLT/PJ/Estágio/Tempo integral) |
| Produto/Serviço | Nome, Categoria, Faixa de preço, Modalidade (digital/físico/recorrente) |
| Treinamento | Título, Data/horário, Formato (online/presencial/híbrido), Carga horária, Nível (iniciante/intermediário/avançado) |
| Notícia | Manchete, Categoria editorial, Autor, Data de publicação |
| Experiência | Nome, Datas disponíveis, Local, Capacidade |

### Etapa 2 — Descrição (Accordion com textarea por bloco)

Blocos variáveis por tipo:

- **Vaga**: Atividades, Requisitos, Salário, Benefícios, Campo livre
- **Produto/Serviço**: Descrição, Diferenciais, Casos de uso, Preço/condições, Campo livre
- **Treinamento**: Ementa, Público-alvo, Pré-requisitos, Material incluído, Campo livre
- **Notícia**: Lide, Corpo, Fontes, Tags, Campo livre
- **Experiência**: Roteiro, O que está incluído, O que levar, Política de cancelamento, Campo livre

### Etapa 3 — Coleta de informações (formulário do Saiba Mais)

Multi-select chips definindo o que será pedido no Saiba Mais. Catálogo base reutilizável entre tipos:

Nome, Sobrenome, Telefone, E-mail, LinkedIn, País de origem, Cidade, Currículo, Remuneração, Autorização para trabalhar no Brasil, Verificação de antecedência, Trabalho remoto, Localidade, Empresa, Cargo atual, Porte da empresa, Orçamento estimado, Data preferencial, Segmento de interesse.

Cada chip selecionado vira um campo no formulário dinâmico do Saiba Mais ([spec/learn-more/DYNAMIC_ENGINE.md](../learn-more/DYNAMIC_ENGINE.md)).

### Etapa 4 — Perguntas de triagem (opcional)

Accordion com formulário:

- Pergunta (texto — ex.: "Quantos anos de experiência?")
- Resposta ideal (texto ou numérico — ex.: 5)
- Qualificar como obrigatório (checkbox)
- Botão **Adicionar** (à direita)

Aplicável a qualquer tipo (não só vagas). Em Vendas vira "qualificação BANT"; em Treinamento vira "filtro de pré-requisito"; em Experiência vira "checagem de elegibilidade".

### Etapa 5 — Revisar e concluir

Exibe todas as informações preenchidas em colunas. Botões à direita: **Voltar** | **Publicar gratuitamente**.

### Etapa 6 — Confirmação

Mensagem:
> "Parabéns! Seu Produto foi publicado com sucesso. Você pode visualizar clicando aqui."

Botão **Fechar** (largura 100%).

---

## 9. Detalhe do Produto

Acessado ao clicar em qualquer card do Kanban de Gerenciar Produtos.

### Layout (duas colunas, lado a lado)

- **Coluna esquerda — Detalhe do Produto** (70%)
- **Coluna direita — Controle do Produto** (30%)

### Coluna Detalhe do Produto

**Identificação**

- Título + badge do tipo
- Badges de filtros (dinâmicos por tipo — ex.: Remoto, 2 semanas, Pleno, Brasil, CLT)
- Localidade (cidade/país, alinhado à esquerda)
- "Publicado por [Empresa] em DD/MM/AAAA"
- Visualizações (esquerda) + Submissões (direita)

**Descrição** (blocos preenchidos na Etapa 2)

**Informações solicitadas no Saiba Mais** (lista dos campos do formulário dinâmico)

**Perguntas de triagem** (se houver — pergunta + resposta ideal + obrigatoriedade)

### Coluna Controle do Produto

**Movimentação**
- Título "Mover"
- Botão **Pausar**
- Botão **Encerrar**

**Controle**
- Botão **Editar Produto** → tela de edição
- Botão **Gerenciar Triagem** → abre Kanban de Triagem filtrado pelo Produto

---

## 10. Saiba Mais — Conversão Universal

O botão **Saiba Mais** é o único ponto de conversão da RealWe. Ele aparece em:

- Vídeos curtos (shorts)
- Vídeos longos (profundidade)
- Página pública do Produto
- Cards na timeline
- Resultados de busca

### Fluxo

```
Usuário clica Saiba Mais
        │
        ▼
Drawer abre lateralmente
        │
        ▼
Formulário dinâmico (multi-step) é renderizado a partir
da configuração de coleta definida na Etapa 3 da criação do Produto
        │
        ▼
Usuário preenche e submete
        │
        ▼
Backend cria card na fase inicial do Kanban de Triagem
do Produto correspondente
        │
        ▼
Notificação para os responsáveis pela Triagem do tipo
```

### Componente

Drawer responsivo, sempre alinhado à direita. Renderizado pelo Dynamic Form Engine descrito em [spec/learn-more/DYNAMIC_ENGINE.md](../learn-more/DYNAMIC_ENGINE.md):

- Steps configuráveis
- Validação reativa
- Step de revisão automática (`setRevisionStepper`)
- Checkbox opcional de política de privacidade
- Botão final com texto configurável (ex.: "Candidatar-se", "Falar com vendas", "Inscrever-se", "Receber novidades", "Reservar")

### Princípio

Adicionar um novo tipo de campo no Saiba Mais = criar 1 componente + 1 linha no registry `COMPONENTS`. Nenhuma tela existente precisa mudar.

---

## 11. Tab: Triagens

Ambiente onde os times operam as submissões recebidas via Saiba Mais. Substitui o antigo "Kanban de Candidaturas" (que era exclusivo de vagas) por um **Kanban de Triagem unificado**, filtrável por tipo de Produto.

### Objetivo

Visão clara e centralizada do status de cada submissão, permitindo:

- Avaliação individual do perfil/lead/inscrito
- Movimentação por fases (drag & drop)
- Pipeline personalizado por tipo
- Decisões rápidas (aprovar, qualificar, agendar, rejeitar)

### Filtros (header da tab)

- **Tipo de Produto** (chips multi-select)
- **Produto específico** (dropdown com busca)
- **Responsável** (dropdown — membros do time)
- **Período** (date range)
- **Status** (em aberto / encerradas)
- **Busca livre** (nome, e-mail, telefone)

### Pipelines default por tipo

| Tipo | Fases default |
|---|---|
| Vaga | Recebidas → Adequada → Entrevista → Documentos → Aprovado → Rejeitado |
| Produto/Serviço | Recebido → Qualificado → Reunião → Proposta → Fechado → Perdido |
| Treinamento | Inscrito → Confirmado → Presente → Concluído → Certificado |
| Notícia | Recebido → Segmentado → Engajado → Assinante |
| Experiência | Solicitado → Agendado → Confirmado → Realizado |

Botão **"+ Nova fase"** ao final da última coluna. Cada empresa ajusta fases, ordem e cores.

### Layout das colunas (idêntico ao Gerenciar Produtos)

- Largura: 278px / Altura: 100%
- Header: 280x40px (nome + badge de contagem)
- Espaçamento header/coluna: 8px

### Card da Submissão

Compacto e informativo, com variação leve por tipo:

- Avatar/foto (esquerda)
- Nome completo (lado do avatar)
- Linha contextual (varia por tipo):
  - Vaga: cargo atual + localidade
  - Produto/Serviço: empresa + porte
  - Treinamento: turma + formato
  - Notícia: segmento de interesse
  - Experiência: data solicitada
- Produto de origem (link clicável)
- Data da submissão
- Badge do tipo (canto superior direito)

### Ações em massa

Seleção múltipla via checkbox no card. Ações em lote:

- Mover para fase
- Atribuir responsável
- Marcar como rejeitado
- Exportar CSV

---

## 12. Detalhe da Submissão

Ao clicar num card do Kanban de Triagem, o operador é redirecionado para a tela de detalhe da submissão.

### Objetivo

Exibir de forma clara, organizada e centralizada os dados submetidos, permitindo análise e decisão baseada em evidências diretas.

### Header

- Título principal: "Submissão de [Nome]"
- Subtítulo: nome do Produto + tipo (badge)
- Localização / contexto (varia por tipo)
- Data da submissão
- Link para perfil público (quando aplicável — ex.: vagas): "Ver perfil completo em `nome.realwe`"

### Seção: Informações cadastradas

Todos os dados coletados pelo Saiba Mais, em blocos com título + valor. Os campos variam conforme a configuração da Etapa 3 do Produto:

- Vaga: nome, e-mail, telefone, LinkedIn, currículo, cidade, remuneração esperada, autorização para trabalhar no Brasil, etc.
- Produto/Serviço: nome, empresa, cargo, porte, e-mail, telefone, orçamento estimado, prazo
- Treinamento: nome, e-mail, nível, motivação, disponibilidade
- Notícia: nome, e-mail, segmento de interesse, frequência desejada
- Experiência: nome, e-mail, data preferencial, número de pessoas, observações

### Seção: Perguntas de triagem

Se o Produto tinha perguntas de triagem:

- Cada pergunta criada pelo responsável
- A resposta dada pelo público
- Indicador visual: atende ✅ / não atende ❌
- Marca de obrigatório quando aplicável

### Ações rápidas

- Botão **Reprovar / Rejeitar**
- Botão **Avançar para próxima fase**
- Campo de notas internas (visível apenas ao time)
- Histórico de movimentações (quem moveu, quando, para onde)

---

## 13. Verticais — detalhamento de exemplos

Cada vertical é uma instância do mesmo motor. A seguir, exemplos concretos de uso.

### 13.1. Vaga (RH)

- **Quando usar**: abrir processo seletivo para uma posição.
- **Saiba Mais coleta**: dados do candidato + currículo + perguntas de triagem (experiência, senioridade, disponibilidade).
- **Triagem**: pipeline default de recrutamento.
- **Resultado**: contratação. Candidato aprovado é marcado como contratado e a Vaga pode ser encerrada.
- **URL pública**: `nubank.realwe/produto/vaga-senior-angular-developer`

### 13.2. Produto / Serviço (Comercial)

- **Quando usar**: gerar leads para um produto/serviço da empresa.
- **Saiba Mais coleta**: empresa, porte, dor, contato, orçamento, prazo.
- **Triagem**: pipeline de funil comercial.
- **Resultado**: contrato fechado. Lead virou cliente.
- **Diferencial**: cada Produto pode ter perguntas de qualificação que pontuam o lead automaticamente (BANT, MEDDIC ou customizado).
- **URL pública**: `nubank.realwe/produto/conta-pj-mei`

### 13.3. Treinamento / Conteúdo (Educação)

- **Quando usar**: inscrição em curso, webinar, workshop.
- **Saiba Mais coleta**: nome, e-mail, nível, motivação, disponibilidade.
- **Triagem**: pipeline de inscrição → confirmação → presença → certificado.
- **Resultado**: certificado emitido + alimentação da Comunidade do canal.
- **Diferencial**: integração com calendário e envio automático de lembretes (próxima iteração).
- **URL pública**: `nubank.realwe/produto/workshop-fintech-201`

### 13.4. Notícia / Comunicado (Comunicação)

- **Quando usar**: distribuir comunicado oficial, newsletter ou anúncio institucional com captura de opt-in.
- **Saiba Mais coleta**: e-mail + segmento de interesse + frequência desejada.
- **Triagem**: pipeline editorial — submissão vira inscrição segmentada.
- **Resultado**: lista de distribuição qualificada, segmentada por interesse.
- **Diferencial**: a própria publicação serve como conteúdo de descoberta no canal, com botão Saiba Mais pedindo opt-in para acompanhar mais.
- **URL pública**: `nubank.realwe/produto/release-q1-2026`

### 13.5. Experiência / Evento (Operações)

- **Quando usar**: agendar visita, demo, encontro presencial, tour.
- **Saiba Mais coleta**: nome, contato, data preferencial, número de pessoas, contexto.
- **Triagem**: pipeline de agendamento.
- **Resultado**: experiência realizada + feedback opcional.
- **Diferencial**: capacidade limitada por data — o formulário pode bloquear datas indisponíveis dinamicamente.
- **URL pública**: `nubank.realwe/produto/visita-sede-sp`

---

## 14. Tab: Pessoas & Permissões

A aba **Pessoas & Permissões** gerencia membros, funções e grupos da organização. Mantém toda a estrutura existente e ganha papéis novos refletindo a expansão multi-produto.

Texto à esquerda no topo: "Pessoas & permissões".

### Aba: Pessoas

Gerencia membros da organização — convite, função e status.

**Header**
- Esquerda: campo de busca
- Direita: botão **Convidar membro**

**Lista (tabela)**
- Pessoa | Função atribuída | Status (Ativo/Pendente) | Ações (⋮): Editar função, Reenviar convite, Remover

**Fluxo de convite (modal)**
- E-mail corporativo
- Função a ser atribuída
- Botão **Enviar convite** (à direita)

### Aba: Funções

Cria, edita e atribui papéis com permissões granulares.

**Header**
- Esquerda: campo de busca de função

**Lista (tabela)**
- Função | Descrição | Quantidade de pessoas

**Exemplos de funções (presets que respeitam a nova taxonomia de Produto)**

| Função | Descrição |
|---|---|
| Administrador | todas as permissões ativas |
| Recrutador | gerencia Produtos do tipo Vaga e suas Triagens |
| Comercial | gerencia Produtos do tipo Produto/Serviço e suas Triagens |
| Educação | gerencia Produtos do tipo Treinamento e suas Triagens |
| Comunicação | gerencia Produtos do tipo Notícia e suas Triagens |
| Operações | gerencia Produtos do tipo Experiência e suas Triagens |
| Visualizador | apenas leitura |
| Convidado | acesso limitado a uma fase específica |

**Drawer de permissões** (ao clicar numa função)

**Header**: Função + Descrição

**Body** — matriz expandida:

| Ação | Permissão |
|---|---|
| Criar Produto (Vaga) | ✅/❌ |
| Criar Produto (Serviço) | ✅/❌ |
| Criar Produto (Treinamento) | ✅/❌ |
| Criar Produto (Notícia) | ✅/❌ |
| Criar Produto (Experiência) | ✅/❌ |
| Editar Produto | ✅/❌ |
| Mover Produto entre fases | ✅/❌ |
| Visualizar Triagem (por tipo) | ✅/❌ |
| Mover submissão entre fases | ✅/❌ |
| Encerrar Produto | ✅/❌ |
| Excluir Produto | ✅/❌ |
| Criar/editar fases do Kanban | ✅/❌ |
| Acessar aba Pessoas | ✅/❌ |
| Convidar/gerenciar usuários | ✅/❌ |
| Editar configurações da empresa | ✅/❌ |
| Lançar Campanha Patrocinada | ✅/❌ |
| Ver Métricas | ✅/❌ |

**Footer**: botão **Salvar**

### Aba: Grupos

Organiza usuários em equipes (RH, Comercial, Educação, Comunicação, Operações, Parceiros externos), facilitando atribuição em massa de funções e permissões.

**Header**
- Esquerda: campo de busca
- Direita: botão **Criar grupo**

**Lista (tabela)**
- Grupo | Descrição | Função padrão | Quantidade de pessoas
- Ações: **Editar grupo**, **Adicionar/Remover membros**, **Excluir grupo**

**Fluxo de criar grupo (modal)**
- Grupo
- Descrição
- Função padrão
- Botão **Criar grupo** (à direita)

**Funcionalidades**
- Criar novo grupo (ex.: RH, Comercial, Educação, Comunicação, Operações, Parceiros externos)
- Atribuir membros existentes
- Associar uma função padrão ao grupo (opcional)
- Visualizar membros
- Mover/remover usuários entre grupos

### Regras gerais de negócio

- Apenas usuários com permissão de "gerenciar pessoas" acessam essas abas
- Um usuário pode pertencer a múltiplos grupos
- A função de um usuário pode ser sobrescrita manualmente
- Convites expiram em 7 dias (opcional)
- Logs de ações por usuário podem ser implementados para rastreamento

### Cenário: Ana, nova colaboradora do RH

A Ana entrou no RH e precisa começar a usar a plataforma. O setor já está estruturado com:

- Um Grupo chamado "RH"
- Esse grupo já tem a Função "Recrutador" associada

**Fluxo ideal usando o Grupo:**

1. Administrador acessa: Menu → Minha Empresa → Pessoas & Permissões → Grupos
2. Encontra o grupo "RH" e clica em "Adicionar membro"
3. Informa o e-mail da Ana e confirma

**Resultado**: Ana herda automaticamente a função "Recrutador" do grupo RH, ganha as permissões definidas e já acessa o Kanban de Vagas e suas Triagens.

**Vantagens**: rápido, escalável (se mais pessoas entrarem no RH, basta adicioná-las ao grupo) e centralizado (mudança no grupo se propaga a todos os membros).

---

## 15. Tab: Página da Empresa

Permite que administradores ativem, editem e personalizem a página pública do canal, exibida em `empresa.realwe`.

A página funciona como o currículo institucional do canal — acessível a qualquer visitante, com as informações da empresa e **todos os Produtos ativos**, segmentados por tipo (Vagas, Produtos/Serviços, Treinamentos, Notícias, Experiências).

### Header

Centro: título "Personalização da Página da Empresa"

### Body (formulário)

- **Empresa** (texto)
- **E-mail Corporativo** (texto, com verificação automática via link; deve ser o do usuário logado)
- **Domínio realwe** (texto, gerado a partir do nome — ex.: `nubank.realwe`; erro inline se já existir)
- **Site da Empresa** (texto — ex.: `https://nubank.com.br`)
- **Redes Sociais** (URL, múltiplas entradas; Enter vira badge removível)
- **Banner da Página da Empresa** (upload)
- **Logo da Página da Empresa** (upload)
- **Sobre a Empresa** (textarea)
- **Switch**: Ativar página pública
- Texto-link: "Sua página está visível em `[empresa].realwe`"

### Seções públicas (renderizadas automaticamente)

A página pública exibe automaticamente, por seção:

- Hero (banner + logo + sobre)
- Creators do canal (membros com Função de creator)
- Vagas abertas (Produtos do tipo Vaga em fase Em campanha)
- Produtos/Serviços
- Treinamentos
- Notícias recentes
- Experiências disponíveis
- Métricas públicas (opcional — retenção média, número de creators, conteúdos publicados)

### Footer

Botão: **Atualizar página e organização**

---

## 16. Tab: Métricas

Visão consolidada de funil para o canal — alinha-se ao pilar "Métricas" descrito em [doc/Regra de negocio RealWe.md](../../doc/Regra%20de%20negocio%20RealWe.md).

### Visões

- **Funil consolidado do canal**: descoberta (views) → profundidade (watch time) → conversão (clicks no Saiba Mais) → submissões → fases finais
- **Comparativo por tipo de Produto**: qual tipo converte melhor, qual tem maior custo de aquisição, qual tem ciclo mais longo
- **Performance por Produto**: retenção, abandono, CTR Saiba Mais, taxa de submissão
- **Performance por Creator institucionalizado**: alinha com o conceito de portfólio público auditável
- **Elegibilidade para Campanha Patrocinada Qualificada**: lista de Produtos que cumprem os critérios definidos em [spec/sponsored-campaigns/doc.md](../sponsored-campaigns/doc.md)

### Filtros

- Tipo de Produto
- Produto específico
- Creator
- Período
- Origem (orgânico vs patrocinado)

---

## 17. Glossário rápido

| Termo | Definição |
|---|---|
| **Organização** | Entidade que representa a empresa na RealWe. Toda ação é vinculada a uma organização. |
| **Canal** | A presença pública da organização (`empresa.realwe`). |
| **Produto** | Objeto canônico publicado pelo canal. Pode ser Vaga, Produto/Serviço, Treinamento, Notícia ou Experiência. |
| **Saiba Mais** | Botão universal de conversão. Abre um drawer com formulário dinâmico. |
| **Submissão** | Resultado do envio do formulário do Saiba Mais. Vira um card no Kanban de Triagem. |
| **Triagem** | Kanban operacional onde as Submissões são processadas até o desfecho final. |
| **Creator institucionalizado** | Colaborador da empresa que publica conteúdo no canal mantendo assinatura própria. |
| **Campanha Patrocinada Qualificada** | Impulsionamento pago de Produtos que atendem aos critérios mínimos de qualidade. |


-----------------------------------------------
# Plano de Construção — Minha Empresa

Cada parte é shippable independente, fecha um valor e respeita as dependências listadas. Tempo é estimativa orientativa.

## Princípios de execução

- Reutilizar antes de criar. Drawer (`drawer.component.ts`), Dynamic Form Engine (`dynamic-form/`), Stepper (`stepper/`), Tabs (`tabs/`), Empty State e Upload Area já existem.
- Camadas do projeto (igual a sponsored-campaigns): `environment` → `api-server/data` + `routes` → `DTO` → `Entity` → `Map` → `API` → `Store` + `Facade` → `Página/Componente`.
- Generalização desde o dia 1. Os componentes Kanban, Card-de-Produto, Card-de-Submissão recebem o tipo via input — não criar 5 cópias.
- Mocks no `api-server/` antes do front. Mantém o fluxo end-to-end testável.

---

## Parte 0 — Fundação compartilhada (1-2 dias)

**Objetivo:** preparar terreno antes de qualquer tela. Sem isso nada compila junto.

### Entregáveis:

- `environment.ROUTES.EMPRESA` (ROOT, LIST, NEW, ORG_PANEL, ORG_PRODUCTS, ORG_TRIAGE, ORG_PEOPLE, ORG_PAGE, ORG_METRICS) e `environment.API.EMPRESA` (organizations, products, submissions, members)
- Enums: `ProductType`, `ProductPhase`, `SubmissionPhase`, `MemberRoleType`, `MemberStatus`
- DTOs (request + response): organization, product, submission, member, group
- Entities equivalentes em `shared/interfaces/entity/`
- Maps em `shared/maps/`
- APIs em `shared/apis/` (`organization.api.ts`, `product.api.ts`, `submission.api.ts`, `member.api.ts`)
- Estrutura vazia em `src/app/domain/empresa/{pages,components,services}/`
- Mock data + rotas no `api-server/src/data/empresa.js` + `api-server/src/routes/empresa.js` (com 1 organização exemplo, 5 produtos cobrindo todos os tipos, ~10 submissões espalhadas)

**Dependências:** nenhuma.

### Critério de aceite:
`curl http://localhost:3000/api/v1/empresa/organizations` retorna a organização semeada; `npm run start` compila sem erro.

---

## Parte 1 — Ver e Criar Organizações (entrada) (1 dia)

**Objetivo:** dar o ponto de entrada do menu "Minha Empresa".

### Entregáveis:

- Página `organization-list/` (bloco "Nova Organização" + cards de organizações + dropdown de ações por card)
- Página `organization-create/` (form da seção 5, com upload de banner/logo e validação inline)
- `OrganizationListStore` + `OrganizationListFacade`
- `OrganizationCreateStore` + `OrganizationCreateFacade`
- Item no menu principal: "Minha Empresa"

**Dependências:** Parte 0.

### Critério de aceite:
Usuário cria organização nova, é redirecionado para a lista, vê o card recém-criado, clica e vai para o Painel (que ainda mostra placeholder).

---

## Parte 2 — Shell do Painel da Organização (0.5 dia)

**Objetivo:** layout com as 5 tabs e roteamento aninhado por `:orgSlug`.

### Entregáveis:

- Página `organization-panel/` (layout com header + tabs reutilizando `AppTabsComponent`)
- Sub-rotas: produtos, triagens, pagina, pessoas, metricas (cada uma carrega componente vazio inicialmente)
- `OrganizationContextService` (signal com a org atual, resolvido por URL)

**Dependências:** Parte 1.

### Critério de aceite:
Trocar entre as 5 tabs sem reload; URL reflete a tab.

---

## Parte 3 — Gerenciar Produtos: Kanban genérico (3-4 dias) ← MARCO 1

**Objetivo:** entregar o componente Kanban reutilizável (que servirá também na Triagem) e a tab principal.

### Entregáveis:

- Componente genérico `KanbanBoardComponent` (colunas configuráveis, drag & drop com CDK, slots para card customizado, header configurável da coluna, botão "+ Nova fase")
- Componente `ProductCardComponent` (variação visual por `ProductType`)
- Sub-tabs por tipo + opção "Todos" com badge de tipo
- `ProductListStore` + `ProductListFacade` (carrega por organização, agrupa por fase)
- Ação de mover Produto entre fases (otimista + rollback em erro)
- Ação "+ Nova fase" (modal simples: nome + cor)

**Dependências:** Parte 2.

### Critério de aceite:
Arrastar Produto de Backlog para Em campanha persiste no mock; sub-tab "Vagas" mostra só vagas.

---

## Parte 4 — Criar/Editar Produto (modal multi-step) (3 dias)

**Objetivo:** modal wizard com Etapas 0 → 6.

### Entregáveis:

- Página/Modal `product-create/` reusando `GenericStepperComponent`
- Etapa 0: seleção de tipo (5 cards)
- Etapas 1-2: presets de campos por tipo (configuração declarativa em `product-type-presets.ts`)
- Etapa 3: multi-select chips com catálogo reutilizável de campos do Saiba Mais (que serão entregues ao Dynamic Form Engine)
- Etapa 4: perguntas de triagem (accordion + form repetível)
- Etapa 5: revisão (auto-gerada pelo stepper, padrão já existente)
- Etapa 6: confirmação
- Modo Edit reusa o mesmo wizard, pré-preenchendo o store

**Dependências:** Parte 3.

### Critério de aceite:
Publicar uma Vaga e um Treinamento via wizard; ambos aparecem no Kanban na fase Backlog.

---

## Parte 5 — Detalhe do Produto (1.5 dia)

**Objetivo:** modal/página de leitura + controle.

### Entregáveis:

- Componente `ProductDetailComponent` (layout 70/30)
- Coluna esquerda: identificação, descrição (accordions), informações solicitadas, perguntas de triagem
- Coluna direita: botões Pausar/Encerrar/Editar/Gerenciar Triagem
- Navegação para `triagens?productId=...` ao clicar em "Gerenciar Triagem"

**Dependências:** Parte 4.

### Critério de aceite:
Abrir Produto pelo card mostra todos os campos; "Pausar" move o card para a coluna Pausada.

---

## Parte 6 — Saiba Mais universal (drawer + form dinâmico) (2 dias) ← MARCO 2

**Objetivo:** ligar o botão Saiba Mais (em qualquer Produto) ao Dynamic Form Engine existente e à criação de Submissões.

### Entregáveis:

- Serviço global `LearnMoreLauncherService` (abre o drawer com productId)
- Adapter `ProductLearnMoreAdapter` que converte a configuração de coleta da Etapa 3 do Produto em `LearnMoreConfig` (formato esperado pelo Dynamic Form Engine — ver `spec/learn-more/DYNAMIC_ENGINE.md`)
- Endpoint mock `POST /api/v1/empresa/products/:id/submissions` que cria a submissão na fase inicial do pipeline do tipo do Produto
- Botão Saiba Mais nos lugares de conversão (página pública do canal, card do Produto na Página da Empresa, vídeo longo)

**Dependências:** Parte 4 (precisa de Produto criado com config de coleta).

### Critério de aceite:
Clicar Saiba Mais em qualquer Produto abre o drawer com formulário coerente ao tipo; após submit, surge card na Triagem.

---

## Parte 7 — Triagens: Kanban de submissão (2 dias)

**Objetivo:** tab Triagens reusando o Kanban da Parte 3 + filtros.

### Entregáveis:

- Página `submission-board/` consumindo `KanbanBoardComponent`
- Componente `SubmissionCardComponent` (variação leve por tipo)
- Header com filtros: tipo (chips), Produto (dropdown busca), responsável, período (date range), status, busca livre
- `SubmissionListStore` + `SubmissionListFacade` (com derivações por filtro)
- Pipelines default por tipo (definidos em `submission-pipelines.ts` — editáveis no futuro)
- Ações em lote (mover, atribuir, rejeitar, exportar CSV)

**Dependências:** Parte 3, Parte 6.

### Critério de aceite:
Filtrar por tipo "Vaga" mostra só candidaturas; arrastar card entre fases persiste.

---

## Parte 8 — Detalhe da Submissão (1 dia)

**Objetivo:** tela de análise individual.

### Entregáveis:

- Página `submission-detail/` (header + blocos de informações cadastradas + perguntas de triagem com ✅/❌)
- Painel de ações rápidas (Reprovar, Avançar fase)
- Campo de notas internas (signal + persist mock)
- Histórico de movimentações (lista cronológica)

**Dependências:** Parte 7.

### Critério de aceite:
Ver detalhes, adicionar nota interna, avançar de fase pelo painel direito (reflete no Kanban).

---

## Parte 9 — Pessoas & Permissões (2.5 dias)

**Objetivo:** tab com 3 sub-tabs (Pessoas, Funções, Grupos).

### Entregáveis:

- Sub-tab Pessoas: tabela + modal de convite
- Sub-tab Funções: tabela + drawer com matriz expandida de permissões (incluindo permissões por tipo de Produto)
- Sub-tab Grupos: tabela + fluxo "Criar grupo" + ações de adicionar/remover membros
- Stores e facades correspondentes
- Endpoint mock para convites (`POST /members/invite`) e funções (`PUT /roles/:id`)

**Dependências:** Parte 2.

### Critério de aceite:
Convidar pessoa, criar grupo "RH", atribuir função "Recrutador" ao grupo, adicionar membro — membro herda a função.

---

## Parte 10 — Página da Empresa (configuração + visão pública) (1.5 dia)

**Objetivo:** configuração interna + atualização do channel público para listar todos os tipos de Produto.

### Entregáveis:

- Tab Página da Empresa (formulário de configuração + switch público)
- Atualização do `channel.component` para renderizar seções por tipo de Produto (não só Vagas)
- Endpoints: `GET/PUT /empresa/organizations/:slug/page`

**Dependências:** Parte 3 (precisa de Produtos publicáveis).

### Critério de aceite:
Ativar página → `empresa.realwe` lista Vagas + Produtos + Treinamentos + Notícias + Experiências em seções separadas.

---

## Parte 11 — Métricas (1.5 dia)

**Objetivo:** funil consolidado da organização.

### Entregáveis:

- Tab Métricas com 5 painéis: funil consolidado, comparativo por tipo, performance por Produto, performance por creator, elegibilidade para Patrocinada
- Reusar serviço de métricas existente (`api-server/src/data/metrics.js`) estendido para escopo organização
- Link de "Lançar Campanha Patrocinada" para Produtos elegíveis (deep link em `sponsored-campaigns/new?productId=...`)

**Dependências:** Parte 7 (para ter dados reais de submissão).

### Critério de aceite:
Dashboard mostra taxa de conversão por tipo; clicar em "Patrocinar" leva ao wizard de Patrocinada pré-preenchido.

---

## Linha do tempo sugerida (~3 semanas calendário)

| Semana | Partes |
|--------|--------|
| Semana 1 | Parte 0 → Parte 1 → Parte 2 → Parte 3 (início) |
| Semana 2 | Parte 3 (fim) → Parte 4 → Parte 5 → Parte 6 |
| Semana 3 | Parte 7 → Parte 8 → Parte 9 → Parte 10 → Parte 11 |

## Marcos de validação com usuário real

- **Marco 1** (fim da Parte 3): "consigo publicar e mover Produtos no Kanban"
- **Marco 2** (fim da Parte 6): "loop completo funciona — public clica Saiba Mais → empresa vê card na Triagem"
- **Marco 3** (fim da Parte 9): "time multi-papel opera o canal com permissões corretas"