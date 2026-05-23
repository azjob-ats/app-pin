## Objetivo do projeto RealWe
A **RealWe** é o **LinkedIn criativo da economia de mídia** — a plataforma onde empresas hospedam *creators institucionalizados*: profissionais reais que produzem conteúdo dentro de canais corporativos sem perder a própria assinatura.

A tese é simples:

> A empresa fornece o palco.</br>
> O creator fornece a assinatura.</br>
> Ambos acumulam reputação juntos.

Isso resolve o problema central de qualquer plataforma de conteúdo profissional — fazer com que pessoas reais publiquem com **consistência ao longo do tempo** — separando, com clareza, o que pertence à empresa (canal, audiência, distribuição) do que pertence ao creator (assinatura, portfólio, reputação transferível).

> Detalhamento completo do conceito em [doc/Creator Institucionalizado.md](doc/Creator%20Institucionalizado.md).

### Dois ativos, dois donos

| Ativo | Dono |
|-------|------|
| Audiência / canal / distribuição | Empresa |
| Reputação / assinatura / portfólio | Creator |

Inspirações desse modelo: diretor dentro da Pixar, fotógrafo dentro da Vogue, chef dentro de restaurante famoso, streamer dentro de organização de e-sports. **O palco é institucional — mas o prestígio individual continua acumulando.**

Toda peça de conteúdo carrega obrigatoriamente os dois nomes, com hierarquia visual deliberada:

```text
Nubank
by Amanda Silva
```

Cada conteúdo se torna **portfólio vivo do creator**, mesmo após ele sair da empresa. O crédito permanece — vira currículo público auditável. Tese central: *“pessoas confiam em pessoas”* só funciona se a pessoa for um ativo durável, não um rosto descartável.

### Concept: O Funil de Conteúdo
A plataforma opera em quatro estágios principais para transformar curiosidade em confiança:
1. **Descoberta:** Vídeos curtos (shorts) que funcionam como "trailers" para despertar interesse.
2. **Profundidade:** Vídeos longos onde o creator aprofunda o tema, ensina e constrói autoridade.
3. **Conversão:** Botão "Saiba Mais" polimórfico que direciona para ações concretas (vagas, vendas, treinamentos, agendamentos, deep links de produto).
4. **Comunidade:** Espaço de interação e relacionamento contínuo com a audiência, em torno do acervo do canal.

### Pilares da Plataforma
- **Creators Institucionalizados:** Profissionais reais com assinatura própria publicando dentro de canais corporativos. Carreira acumulativa, reputação transferível, vídeo institucionalizado vendendo algo.
- **Portfólio Público Auditável:** Cada creator tem currículo vivo com retenção, conversão e histórico cross-empresa — o que LinkedIn não entrega.
- **Conversão Atribuível:** Cada conteúdo conecta diretamente ao destino e expõe métricas de impacto por creator.
- **Autoridade Profissional:** O foco não é venda direta, mas construção de reputação e transparência.
- **Métricas e Qualidade:** Retenção e engajamento validam conteúdos. Campanhas patrocinadas só são permitidas para conteúdos com bom desempenho orgânico (sponsored qualificado).
- **Ecossistema Completo:** Organizado por categorias como Vagas, Produtos, Treinamentos, Experiências e Empresas.

### Aplicabilidade
Este projeto resolve o distanciamento entre marcas e pessoas, substituindo o marketing institucional por **conexões humanas com responsabilidade dupla**. Para o desenvolvimento, os componentes devem focar em:

- **Descoberta visual** (grid de vídeos curtos)
- **Profundidade contextualizada** (vídeo longo + creator + comunidade ativa na mesma tela)
- **Conversão dinâmica** (formulários customizáveis, deep links, agendamentos)
- **Portfólio Público do Creator** como tela-âncora — não acessório, não tela de configuração
- **"Presented by"** como elemento estrutural de UI (empresa + creator visíveis em todo card, vídeo, resultado de busca e campanha patrocinada)

### 🎨 Design System e Inspiração
O layout, a paleta de cores, a tipografia e a experiência de navegação da plataforma foram diretamente inspirados no **Design System do Pinterest** — interface limpa, foco em "cards" visuais, descoberta infinita e estética premium e minimalista que facilita o consumo de conteúdo profissional.

## Fazer login com o GitHub no WSL (Windows Subsystem for Linux)
```sh
#Gere a chave SSH (se ainda não fez)
ssh-keygen -t ed25519 -C "saulomcchelsom@gmail.com"

# 2. Adicione a chave ao GitHub:
# 2.1 Copie a chave
cat ~/.ssh/id_ed25519.pub

#2.3 Vá para:
https://github.com/settings/keys

# 2.4 Clique em "New SSH key"

# 2.5 Cole a chave e dê um nome (ex: WSL-Ubuntu)

# 3 Altere a URL remota do repositório para SSH:
git remote set-url origin git@github.com:azjob-ats/app-pin.git

# 4. Teste com
git pull origin master

# 5. Teste a conexão com o GitHub
ssh -T git@github.com

# 6. Se aparecer algo como:
Hi azjob-ats! You've successfully authenticated, but GitHub does not provide shell access.
```

## Commands

```bash
# Development server (http://localhost:4200)
npm run start

# Production build (output: dist/)
ng build

# Run unit tests (Vitest)
ng test
```

## Project Architecture - Angular Frontend

### Visão Geral

Este projeto Angular adota uma arquitetura baseada em:

- **core** </br>
    Recursos centrais da aplicação
 
- **domain** </br>
    Funcionalidades de negócio organizadas por domínio

- **shared** </br>
    Utilitários reutilizáveis e componentes visuais compartilháveis

### Exemplificação

- **Core** </br>
Infraestrutura e módulos de nível de aplicação:
    - **Infra**: Camada responsável pela implementação de integrações externas e bibliotecas, permitindo sua substituição sem afetar o núcleo da aplicação (ex.: criptografia, armazenamento, APIs).

- **Domain** </br>
Contém os módulos de negócio, organizados por funcionalidade. Cada módulo inclui:
    - **Services**: Regras de negócio e orquestração (ex.: validação de imposto).
    - **Pages**: Containers de telas conectadas às rotas.
 
- **Shared** </br>
Compartilhamento de utilitários globais, não ligados a UX ou domínio específico.
    - **Apis**: Camada para chamadas ao backend (APIs REST, GraphQL etc.).
    - **Caches**: Estratégias locais de cache para otimizar performance.
    - **Interfaces**: Contratos TypeScript para modelar dados.
    - **Maps**: Transformações e mapeamentos de dados entre camadas.
    - **Constants**: Constantes genéricas (ex.: formatos padrão).
    - **Enums**: Enumerações para valores fixos.
    - **Guards**: Proteções de rota.
    - **Interceptors**: Interceptadores HTTP para manipulação de requisições e respostas.
    - **Services**: Serviços globais (ex.: gerenciamento de estado, loading spinner).
    - **Utils**: Funções auxiliares (ex.: formatar datas, validar e-mails).
    - **Components**: Componentes “presentacionais” (ex.: botões, cards, modais).
    - **Directives**: Diretivas customizadas (ex.: máscara de input).
    - **Pipes**: Pipes reutilizáveis para transformação de dados em templates.

### Convenções de nomenclatura
- Classes: PascalCase (e.g., AuthService)
- Interfaces: PascalCase (e.g., Authentication)
- Enums: PascalCase (e.g., UserStatus)
- Arquivos/Pastas: kebab-case (e.g., auth.service.ts)

### Angular Best Practices Adopted
- Código sempre em inglês.
- Importações utilizando aliases (ex.: @domain/auth/services/auth.service).
- **Encapsulation**: Always use `ViewEncapsulation.None`
- **Change detection**: Always use `ChangeDetectionStrategy.OnPush`

### Estrutura de pasta
```text
src/
└── app/
    ├── core/
    │   └── infra/
    │       └── crypto/
    ├── domain/
    │   ├── change-language/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── index.routes.ts
    ├── shared/
    │   ├── constants/
    │   ├── apis/
    │   ├── caches/
    │   ├── maps/
    │   ├── mocks/
    │   ├── enums/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── interfaces/
    │   ├── services/
    │   ├── utils/
    │   ├── components/
    │   ├── directives/
    │   └── pipes/
    └── app.config.ts

```

## 📌 Padrão de Nomeação de Branches
  ```text
  master              → Versão estável, pronta para produção.

  develop             → Branch principal de desenvolvimento.

  feature/task-1      → Para novas funcionalidades.

  bugfix/task-2       → Para correções de bugs fora da release.

  refactor/task-3     → Refatoração de código.

  fix/task-4          → Correção de bug.

  hotfix/task-5       → Para correções urgentes em produção.

  chore/task-6        → Alterações menores (configuração, documentação).

  staging             → Versão que será testada antes de ir para produção.

  release/v1-0-2      → Para preparar versões estáveis.

```
```

## **🛠  fluxo de branches do seu projeto **
                      +----------------------+
                      |      master          | <-- Versão estável (produção)
                      +----------------------+
                                ↑
                                |
                      +----------------------+
                      |      staging         | <-- Testes antes da produção
                      +----------------------+
                                ↑
                                |
                      +----------------------+
                      |      release/v1-0-2  | <-- Preparação da versão estável
                      +----------------------+
                                ↑
                                |
                      +----------------------+
                      |      develop         | <-- Desenvolvimento principal
                      +----------------------+
             ┌────────┴───────────┬──────────┬──────────┬──────────┐
             |                    |          |          |          |
 +------------------+   +-----------------+  +----------------+  +------------------+
 | feature/task-1   |   | bugfix/task-2   |  | refactor/task-3 |  | chore/task-6    |
 | Nova funcionalidade |  | Correção de bug  |  | Refatoração      |  | Alterações menores |
 +------------------+   +-----------------+  +----------------+  +------------------+
                                                                |
 +------------------+   +-----------------+
 | fix/task-4      |   | hotfix/task-5   |
 | Correção de bug |   | Correção urgente |
 +------------------+   +-----------------+

```

#### Explicação do Fluxo de Trabalho
```text
master → Branch principal e estável, usada para produção.

develop → Branch principal de desenvolvimento.

feature/task-1 → Para novas funcionalidades.

bugfix/task-2 → Correção de bugs encontrados antes de um release.

refactor/task-3 → Refatorações sem mudança de funcionalidade.

fix/task-4 → Correções normais de bugs.

hotfix/task-5 → Correções urgentes diretamente em produção.

chore/task-6 → Alterações menores como configurações ou documentação.

staging → Ambiente de homologação/teste antes de ir para master.

release/v1-0-2 → Preparação de uma versão estável antes de ir para staging e master.
```

## 📌 Padrão de Nomeação de commits
#### Exemplo de commit
```bash
git add .
git commit -m "✨ feat(button): add new variant"
```

| Emoji | Type       | Description              |
| ----- | ---------- | ------------------------ |
| ✨    | `feat`     | New functionality        |
| 🐛    | `fix`      | Bug correction           |
| 🚀    | `perf`     | Performance improvements |
| ⏪️    | `revert`   | Revert previous commit   |
| 📦    | `refactor` | Code refactoring         |
| 🔧    | `ci`       | CI/CD                    |
| 🧪    | `test`     | Tests                    |
| 📝    | `docs`     | Documentation            |
| 💄    | `style`    | Code style               |
| 🏗️    | `build`    | Build system             |
| 🚧    | `chore`    | Maintenance              |


#### Commit Format

```
emoji type(scope): description

[optional body]

[optional footer]
```

**Examples:**

```bash
✨ feat(button): add loading state
🐛 fix(input): resolve focus bug
📦 refactor(dialog): improve animation performance
🧪 test(form): add validation tests
📝 docs(readme): update installation guide
```

**Important - Emoji is REQUIRED**:

1. **Emoji at the start** (MANDATORY - commit will be rejected without it)
2. **Type** (feat, fix, etc)
3. **Scope** in parentheses (optional)
4. **Colon and space**
5. **Clear, imperative description**

**Do NOT add `Co-Authored-By` trailers to commits.**

**Examples of valid commits:**

```bash
✅ ✨ feat(button): add variant
✅ 🐛 fix: resolve bug
✅ 📦 refactor(core): improve performance

❌ feat(button): missing emoji - WILL BE REJECTED
❌ feat: missing emoji - WILL BE REJECTED
```

#### Como pensar para criar um commit
---
- Deve ser imperativo
- Fala o que foi feito, e não o que você fez
- Se eu aplicar esse commit, esse commit vai fazer o que?
---

## Como criar um PR
#### Descrição

```sh 
# Descreva de forma sucinta o que este pull request faz. Explique o motivo da mudança e forneça o contexto necessário.
``` 

#### Tipo de Mudança

- [ ] Correção de bug (bug fix)
- [ ] Nova funcionalidade (feature)
- [ ] Refatoração (refactoring)
- [ ] Documentação (documentation)

#### Checklist

- [ ] O código segue os padrões do projeto
- [ ] Testes foram adicionados e/ou atualizados
- [ ] A documentação foi atualizada (se necessário)
- [ ] Todas as verificações de lint passaram
- [ ] A funcionalidade foi testada manualmente
- [ ] A issue relacionada foi marcada como resolvida

#### Como Testar

```sh 
# Descreva os passos necessários para testar a funcionalidade/bug corrigido.
```

1. Vá para a página de login.
2. Clique nos botões de login do Google e Facebook.
3. Complete o processo de autenticação.
4. Verifique se o usuário é redirecionado corretamente após o login.
5. Confira se os dados do usuário são salvos corretamente no banco de dados.

#### Referências

```sh 
# Adicione links para issues relacionadas e outras referências relevantes.
```

Este pull request resolve a issue [#123](https://github.com/seu-repositorio/issues/123).

#### Capturas de Tela

```sh 
# Se aplicável, adicione capturas de tela para demonstrar as mudanças visuais.
```

*Login com Google*:
![Login com Google](https://via.com/300)

*Login com Facebook*:
![Login com Facebook](https://via.com/301)

#### Notas Adicionais

```sh 
# Adicione qualquer outra informação relevante que não se encaixe nas categorias acima.
```

- Certifique-se de configurar as variáveis de ambiente para as credenciais do Google e Facebook antes de testar.
- Esta implementação utiliza `passport-google-oauth20` e `passport-facebook` para a integração OAuth.

## Issue Template (Chore)
# 🚧 [Chore] Short description

## 📌 Summary
Describe the maintenance task.

---

## 🔧 Changes Made
- Dependency updates
- Build configuration
- Tooling adjustments
- CI/CD improvements

---

## 📦 Dependencies Updated (if applicable)
- Package:
- From:
- To:

---

## ⚠️ Breaking Changes
- [ ] Yes
- [ ] No

---

## 🎯 Objective
- Improve project stability
- Maintain dependencies
- Improve developer experience

---

## 🏷️ Additional Context
Any extra notes.

## Issue Template (Style)
# 💄 [Style] Short description

## 📌 Summary
Describe styling or UI-related changes.

---

## 🎨 Changes Made
- UI adjustments
- CSS improvements
- Layout fixes
- Design consistency updates

---

## 📷 Before / After (optional)
Add screenshots if applicable.

---

## 🎯 Objective
- Improve visual consistency
- Enhance UX
- Fix layout issues

---

## ⚠️ Breaking Changes
- [ ] Yes
- [ ] No

---

## 🏷️ Additional Context
Any extra notes.

## Issue Template (Test)
# 🧪 [Test] Short description

## 📌 Summary
Describe what tests were added or updated.

---

## 🎯 Objective
Explain the purpose of these tests.

- Increase coverage
- Prevent regression
- Validate new feature

---

## 🔬 Test Cases
List key test scenarios:

- 
- 
- 

---

## 📊 Coverage Impact
- Previous coverage:
- New coverage:

---

## ⚙️ Test Type
- [ ] Unit
- [ ] Integration
- [ ] E2E

---

## 🏷️ Additional Context
Any relevant details.

## Issue Template (Refactor)
# 📦 [Refactor] Short description

## 📌 Summary
Describe what was refactored.

---

## 🎯 Objective
Explain why this refactor was needed.

- Improve readability
- Reduce complexity
- Improve performance
- Standardize code

---

## 🔧 Changes Made
List the main changes:

- 
- 
- 

---

## ⚠️ Breaking Changes
- [ ] Yes
- [ ] No

If yes, describe:

---

## 🧪 Impact on Tests
- Tests updated?
- Coverage affected?

---

## 📈 Benefits
Describe improvements:

- Maintainability
- Performance
- Scalability

---

## 🏷️ Additional Context
Any extra notes.

## Issue Template (Revert)
# ⏪️ [Revert] Short description of reverted change

## 📌 Summary
Describe what change is being reverted.

---

## 🔙 Reverted Change
Reference the commit, PR, or feature being reverted.

- Commit: 
- PR: 
- Feature: 

---

## ❗ Reason for Revert
Explain why this change needs to be reverted.

- Bug introduced?
- Breaking change?
- Performance issue?

---

## ⚠️ Impact
Describe the impact of reverting this change.

- Affected features
- Side effects

---

## 🔄 Next Steps (optional)
- Re-implement fix?
- Investigate root cause?

---

## 🏷️ Additional Context
Any additional details.

## Issue Template (Feature)
# ✨ [Feature] Short and clear title

## 📌 Summary
Provide a brief summary of the feature.

Explain in one or two sentences what you want to achieve.

---

## 🎯 Problem / Motivation
Describe the problem this feature solves.

- What is missing today?
- Why is this important?
- Who is affected?

---

## 💡 Proposed Solution
Describe your proposed solution in detail.

- How should it work?
- What would the API look like?
- How would users interact with it?

Example:

```ts
// example usage
<component [prop]="value"></component>
```

## Issue Template (fix)
# 🐛 [fix] Short and clear title

## 📌 Description
A clear and concise description of the problem.

Explain what is happening and why it is an issue.

---

## 🔄 Steps to Reproduce
Steps to reproduce the behavior:

1. 
2. 
3. 
4. 

---

## 📷 Expected Behavior
Describe what you expected to happen instead.

---

## ❌ Actual Behavior
Describe what actually happens.

---

## 🖥️ Screenshots (if applicable)
Add screenshots or recordings to help explain your problem.

---

## 🏗️ Environment
Provide details about your environment:

- Library/Package Version:  
- Framework Version (e.g., Angular):  
- Browser & Version:  
- Operating System:  

---

## 📜 Relevant Logs & Errors
Paste any relevant logs, stack traces, or compiler errors.


## Issue Template (Bug)