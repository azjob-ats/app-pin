# Departamentos — A camada entre Organização e o Painel/Kanban

> O nível organizacional que faltava: antes de gerenciar produtos, o usuário escolhe **de qual departamento** da empresa está cuidando. Cada departamento tem seu próprio painel (produtos, triagens, equipe) e seu próprio Kanban — eliminando o "balde único" em que vagas do RH, releases da Comunicação e serviços do Comercial se misturavam.

---

## 1. Em uma frase

**Selecionar um departamento é o passo intermediário entre escolher a organização e abrir o Kanban: `/empresa` → `/empresa/nubank` (departamentos) → `/empresa/nubank/engenharia/produtos`. O painel inteiro passa a ser escopado por departamento.**

A tela de departamentos é um clone da tela de Organizações — mesma mecânica de listar, favoritar e criar — aplicada um nível abaixo.

---

## 2. O problema que resolve

O painel da organização colocava **todos** os produtos de **todos** os times no mesmo Kanban. Numa empresa grande (Nubank tem RH, Marketing, Engenharia, Produto, Comunicação…), isso gera ruído e impede governança por área.

| Cenário | Antes | Agora |
|---|---|---|
| RH abre uma vaga e Comunicação publica um release | Caem no mesmo Kanban, indistinguíveis quanto à origem | Cada um no Kanban do seu departamento |
| Gestor de Marketing quer ver só o que é de Marketing | Não suportado — via tudo da empresa | Entra em `/empresa/:slug/marketing` e vê só o seu |
| Escalar para dezenas de times | Board cada vez mais ruidoso | Um board enxuto por departamento |

> A observação que originou a feature: **no Kanban não estava claro a qual departamento cada card pertencia** — porque não havia o conceito de departamento, só *fase* (coluna) e *tipo* (filtro).

---

## 3. A solução: departamento como escopo do painel

Entre a Organização (raiz) e o Painel, entra uma camada de **Departamento**. Decisão de escopo: **o painel inteiro** (produtos, triagens, pessoas, métricas, página) passa a viver sob um departamento — não só os produtos.

Três peças trabalhando juntas:

1. **Tela de Departamentos** — clone da tela de Organizações. Lista os departamentos da empresa em cards (ícone + cor + contadores), com favoritar e criar. Fica em `/empresa/:slug` (rota que antes redirecionava direto para o painel).

2. **Tela de Criar Departamento** — clone do criar-organização, adaptada: nome, identificador (slug auto-gerado), seletor de ícone, cor de destaque e descrição.

3. **Painel escopado por departamento** — o painel passa de `/empresa/:slug` para `/empresa/:slug/:deptSlug`. Carrega o contexto do departamento, exibe a identidade dele no cabeçalho (ícone+cor+nome, com a empresa como contexto) e o "voltar" leva à lista de departamentos.

> A elegibilidade de produto responde "quem pode vender"; o departamento responde **"a que área da empresa isto pertence"** — o eixo organizacional que faltava ao lado de *fase* e *tipo*.

---

## 4. Para quem é

### Usuários (quem opera no dia a dia)

| Persona | O que ganha |
|---|---|
| **Admin da Organização** | Cria e organiza os departamentos da empresa; navega entre eles para operar cada área. |
| **Gestor de área (RH, Marketing, Eng.)** | Entra direto no seu departamento e vê só os produtos/triagens da sua área — sem o ruído dos outros times. |
| **Operador de Triagem** | Trabalha um Kanban enxuto, escopado ao departamento, em vez de um board agregado da empresa inteira. |

### Stakeholders (quem decide e mede)

| Stakeholder | O que enxerga |
|---|---|
| **Diretoria de produto** | Estrutura que escala o painel para empresas grandes e multi-time, sem o board virar ruído. |
| **Compliance / Governança** | Recorte organizacional explícito — cada produto pertence a um departamento, base para permissões e auditoria por área. |

---

## 5. Como funciona em 30 segundos

```
Usuário abre /empresa
   → lista de Organizações (existente)
        │  clica numa organização
        ▼
/empresa/nubank
   → lista de DEPARTAMENTOS da organização  ← NOVO
     (cards com ícone+cor, contadores, favoritar, "Novo departamento")
        │  clica num departamento
        ▼
/empresa/nubank/engenharia
   → Painel escopado ao departamento (redireciona p/ produtos)
        │
        ▼
/empresa/nubank/engenharia/produtos
   → Kanban mostrando SÓ os produtos daquele departamento
        │
        ▼
Voltar (seta do cabeçalho) → volta para a lista de departamentos
```

---

## 6. Por que isso muda a experiência

| Antes | Depois |
|---|---|
| `/empresa/:slug` redirecionava direto para o Kanban da empresa. | `/empresa/:slug` lista departamentos; o Kanban fica um nível abaixo, por departamento. |
| Um único Kanban para a empresa inteira. | Um Kanban por departamento. |
| Card no board não indicava a área de origem. | Card vive dentro do contexto explícito de um departamento. |
| Cabeçalho do painel = identidade da organização. | Cabeçalho = identidade do departamento (ícone+cor+nome) + empresa como contexto. |

---

## 7. Diferenciais estratégicos

- **Clone, não reinvenção.** A tela de departamentos reaproveita o padrão visual e a stack da tela de organizações — zero curva de aprendizado, baixo custo de manutenção.
- **Escopo organizacional real.** Departamento entra como terceiro eixo ao lado de *fase* (coluna) e *tipo* (filtro), sem inflar o card.
- **Pronto para permissões por área.** Com o painel já escopado por departamento, restringir times a departamentos específicos é o próximo passo natural.

---

## 8. Como medir sucesso

| Métrica | O que indica |
|---|---|
| **Departamentos ativos por organização** | Adoção do recorte organizacional. |
| **Produtos por departamento** | Distribuição de carga entre áreas. |
| **% de produtos com departamento atribuído** | Cobertura do escopo (produtos sem departamento ficam fora dos boards por área). |
| **Navegação org → departamento → kanban** | Saúde do funil de entrada no painel. |

---

## 9. Modelo de dados (resumo)

| Tabela / campo | Papel |
|---|---|
| `organization_departments` | Departamentos da organização. Ganhou **`slug`** (segmento de URL, único por org), **`icon`** e **`color`** (identidade do card). Já tinha `name`, `description`, `default_role_id`. |
| `organization_department_members` | Junção departamento ↔ membro (já existente). |
| `products.department_id` | A que departamento o produto pertence — **já existia** no schema, com índice `(organization_id, department_id)`. |

Schema completo em [/sql](../../sql/) (`organization_departments.sql`, `organization_department_members.sql`, `products.sql`).

> **Lacuna conhecida — `is_favorite`:** o favoritar de departamento (e de organização) é hoje um conceito de mock/frontend; **não existe no schema SQL** para nenhuma das duas tabelas. Deve virar um pivot por usuário no futuro — resolver para organização e departamento juntos.

---

## 10. Onde isso aparece no produto

| Superfície | Rota | O que faz |
|---|---|---|
| **Lista de Departamentos** | `/empresa/:slug` | Cards de departamento (ícone+cor, contadores), favoritar, "Novo departamento". |
| **Criar Departamento** | `/empresa/:slug/novo-departamento` | Nome, slug auto, seletor de ícone, cor e descrição. |
| **Painel** | `/empresa/:slug/:deptSlug` | Painel escopado: cabeçalho com identidade do departamento, "voltar" para a lista de departamentos. |
| **Kanban de Produtos** | `/empresa/:slug/:deptSlug/produtos` | Lista filtrada pelo departamento (`?department=<slug>`). |

### API (backend mock `api-server/`)

| Método | Endpoint |
|---|---|
| GET | `/organizations/:slug/departments` |
| GET | `/organizations/:slug/departments/:deptSlug` |
| POST | `/organizations/:slug/departments` |
| PATCH | `/organizations/:slug/departments/:deptSlug` |
| PATCH | `/organizations/:slug/departments/:deptSlug/favorite` |
| GET | `/organizations/:slug/products?department=<slug>` (filtro adicionado) |

---

## 11. Status de entrega

Implementada em fases incrementais, com type-check + build AOT entre cada e validada contra o backend mock:

| Fase | Entrega |
|---|---|
| 1 | Fundação — `Department` entity, DTOs req/resp, map, `EmpresaDepartmentApi`, stores/facades de lista e criação, `DepartmentContextService`, constantes de rota/endpoint. |
| 2 | Tela de lista de departamentos + `empresa-dept-card` (clone do org-card, com ícone+cor). |
| 3 | Tela de criação de departamento (clone do organization-create). |
| 4 | Virada de rotas: painel re-escopado para `:slug/:deptSlug`, `DepartmentContext` no painel, todos os construtores de URL carregando o `:deptSlug`, filtro de produtos por departamento. |
| 5 | Backend mock — endpoints de departamento + seed (Nubank: Engenharia, Marketing, Produto, Pessoas & Cultura; Magazine Luiza: Tecnologia, Vendas); `products.departmentId` + filtro; schema SQL (`slug`/`icon`/`color`). |

**Pendências conhecidas** (fora do escopo das fases acima):

- **Demais abas do painel ainda carregam dados por organização.** Triagens, Pessoas, Métricas e Página já vivem sob a rota do departamento e têm o `DepartmentContext` disponível, mas o carregamento de dados delas continua org-scoped. Escopá-las por departamento (como foi feito em Produtos) é o próximo passo — depende de suporte equivalente no backend.
- **Migration do backend real.** As colunas `slug`/`icon`/`color` em `organization_departments` existem no schema (DBML) e no mock; o backend de produção precisa da migration correspondente.
- **Ações do menu do card** (Editar / Excluir departamento) são stubs na UI.
- **`is_favorite`** não modelado no schema (lacuna compartilhada com organização — ver §9).
- **Refresh/URL direta** dentro do painel recarregam o contexto por slug normalmente; não há persistência adicional.

---

## 12. Onde aprofundar

- **Painel Minha Empresa** (contexto do canal corporativo): [README.md](README.md)
- **Especificação operacional do painel**: [doc.md](doc.md)
- **Elegibilidade de Creators** (outro eixo de governança do Produto): [elegibilidade-creators.md](elegibilidade-creators.md)
- **Tese da plataforma**: [../../README.md](../../README.md)
