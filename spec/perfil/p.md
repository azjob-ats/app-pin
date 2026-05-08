Você é um arquiteto de software sênior especialista em Angular, UX de produtos digitais e plataformas de creator economy.

Quero que você me ajude a planejar e estruturar a implementação de 3 recursos principais dentro da minha aplicação.

## CONTEXTO DO PRODUTO
A aplicação é uma plataforma focada em creators institucionalizados, onde conteúdo gera oportunidades reais (emprego, networking, conversão).

A arquitetura atual segue padrão modular:
- domain/
- shared/apis
- shared/interfaces (DTOs, Entities)
- shared/maps

O frontend é Angular.

---

## RECURSOS A SEREM PROJETADOS

### 1. Visualizar Inscrições
- Lista de ações feitas pelo usuário ao clicar em "Saiba Mais"
- NÃO é inscrição em canal
- Deve conter:
  - Tipo (vaga, produto, contato, etc.)
  - Status (enviado, aprovado, recusado, etc.)
  - Origem (creator + empresa)
  - Data
- UX esperada: histórico + filtros + ações

---

### 2. Portfólio Público do Creator
- Página pública (estilo /@username)
- Funciona como:
  - Currículo digital
  - Portfólio profissional
  - Página institucional

Deve conter:
- Hero (nome, headline, foto)
- Métricas auditáveis
- Trajetória profissional
- Conteúdos destaque
- Comunidade

IMPORTANTE:
Essa é a TELA PRINCIPAL do produto (não é aba de perfil).

---

### 3. Completar Currículo (Experiência Duolingo)
Fluxo FULLSCREEN, gamificado.

Objetivo:
Evitar formulários tradicionais e criar uma experiência fluida.

### Estrutura Visual:
- Spinner de progresso no topo
- Trilhas em curva (estilo Duolingo)
- Cada trilha representa uma seção

### Trilhas:
1. Habilidades (chips)
2. Experiência profissional
3. Formação acadêmica
4. Idiomas
5. Certificações
6. Sobre
7. Contato
8. Pronome e PCD

### Interação:
- Clique → abre Bottom Sheet
- Preenchimento simples e visual
- Atualiza progresso automaticamente
- Trilhas completas mudam de cor

---

## REGRAS IMPORTANTES

- Os 3 recursos devem ser SEPARADOS (não uma única página com abas)
- O fluxo de currículo deve ser FULLSCREEN (sem sidebar/header)
- Os outros ficam dentro do shell com sidebar
- A navegação conecta os 3 fluxos

---

## O QUE EU QUERO QUE VOCÊ FAÇA

Quero uma resposta estruturada com:

### 1. Arquitetura de Rotas
- URLs ideais
- Público vs privado
- Relação entre as páginas

### 2. Estrutura de Pastas (Angular)
Seguindo o padrão:
- domain/
- pages/
- services/
- store (signals ou similar)

---

### 3. Modelagem de Dados
Para cada recurso:
- DTOs
- Entities
- Enums necessários
- Relacionamentos

---

### 4. UX / UI Breakdown
Para cada página:
- Seções principais
- Componentes necessários
- Estados (loading, empty, erro)

---

### 5. Fluxos de Navegação
Exemplo:
- do portfólio → editar
- das inscrições → onboarding
- do onboarding → preview público

---

### 6. Estratégia de Implementação
Ordem ideal:
- o que fazer primeiro
- o que pode ser mockado
- dependências entre features

---

### 7. Riscos de Produto / UX
- pontos que podem quebrar engajamento
- problemas de arquitetura
- trade-offs

---

## IMPORTANTE

- Não quero resposta genérica
- Quero algo PRONTO para desenvolvimento
- Use linguagem prática e objetiva
- Pense como se fosse liderar a implementação
