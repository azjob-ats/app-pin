## Objetivo do projeto RealWe
A **RealWe** é uma plataforma onde empresas mostram como realmente trabalham, através de conteúdos criados pelos próprios colaboradores. focada no conceito de que **"pessoas confiam em pessoas"**.

### Concept: O Funil de Conteúdo
A plataforma opera em quatro estágios principais para transformar curiosidade em confiança:
1. **Descoberta:** Vídeos curtos (shorts) que funcionam como "trailers" para despertar interesse.
2. **Profundidade:** Vídeos longos onde o criador (colaborador) aprofunda o tema, ensina e constrói autoridade.
3. **Conversão:** Botão "Saiba Mais" que direciona para ações concretas (vagas, vendas, treinamentos).
4. **Comunidade:** Espaço de interação e relacionamento contínuo com a audiência.

### Pilares da Plataforma
- **Pessoas Reais:** Colaboradores atuam como criadores autorizados, mostrando o dia a dia, ferramentas e desafios reais.
- **Autoridade Profissional:** O foco não é venda direta, mas sim a construção de reputação e transparência.
- **Ecossistema Completo:** Organizado por categorias como Vagas, Produtos, Treinamentos, Experiências e Empresas.
- **Métricas e Qualidade:** Uso de retenção e engajamento para validar conteúdos. Campanhas patrocinadas só são permitidas para conteúdos com bom desempenho orgânico.

### Aplicabilidade
Este projeto busca resolver o distanciamento entre marcas e pessoas, substituindo o marketing institucional por conexões humanas. Para o desenvolvimento, os componentes devem focar em descoberta visual (scroll de vídeos), conversão dinâmica (formulários customizáveis) e gestão de autoridade (perfis integrados e métricas).

### 🎨 Design System e Inspiração
O layout, a paleta de cores, a tipografia e a experiência de navegação da plataforma foram diretamente inspirados no **Design System do Pinterest**. Isso reflete em uma interface limpa, focada em "cards" visuais, descoberta infinita e uma estética premium e minimalista. Todo o layout, a paleta de cores e a tipografia da plataforma RealWe foram inspirados no Design System do Pinterest, priorizando uma estética de "cards" visuais, descoberta infinita e uma interface limpa e minimalista que facilita o consumo de conteúdo profissional.

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