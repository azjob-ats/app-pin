# Elegibilidade de Creators — Quem pode vender cada Produto

> A camada que conecta o **Produto da empresa** ao **vídeo do creator**. Define, por Produto, quais creators estão habilitados a produzir o pitch que o vende — e rastreia, na ponta, qual creator originou cada inscrição.

---

## 1. Em uma frase

**Ao publicar um Produto, a empresa escolhe quem pode vendê-lo: qualquer creator do canal, creators específicos ou grupos de creators. O creator, por sua vez, só vê os Produtos liberados para ele na hora de publicar. E cada inscrição recebida volta carimbada com o creator que a gerou.**

Essa é a ponte que faltava entre o que a empresa oferece (Produto) e quem dá rosto e assinatura a isso (Creator) — fechando o loop da tese "a empresa fornece o palco, o creator fornece a assinatura".

---

## 2. O problema que resolve

A plataforma já separa **Produto** (o que a empresa oferece) de **Pitch** (o vídeo do creator que vende), conforme [Resposta — por que separar produto de vídeo](Resposta-por%20que%20separar%20produto%20de%20v%C3%ADdeo.md). Mas faltavam três peças para o modelo operar de verdade:

| Lacuna | Antes | Agora |
|---|---|---|
| **Governança de quem vende** | Qualquer creator poderia, em tese, pitchar qualquer Produto — sem controle da empresa. | A empresa define a regra de elegibilidade por Produto. |
| **Escala de liberação** | Liberar creator a creator não escala (campanhas com dezenas de creators). | Grupos de creators liberam em lote (ex.: o grupo "Webiner Nubank"). |
| **Atribuição visível** | A coluna de atribuição existia no dado, mas não aparecia para o time. | O detalhe do Produto lista os inscritos e permite **filtrar por creator/grupo**. |

Sem isso, a empresa não consegue orquestrar campanhas ("essa vaga é divulgada só pelo time de engenharia"; "esse curso, por qualquer creator") nem medir o retorno por creator de forma operacional.

---

## 3. A solução: regra de elegibilidade + grupos + atribuição

Três conceitos trabalhando juntos:

1. **Regra de elegibilidade do Produto** — todo Produto carrega um modo de elegibilidade:
   - **Qualquer creator** — todos os creators institucionalizados do canal podem vendê-lo.
   - **Creators específicos** — apenas os creators selecionados.
   - **Grupos de creators** — todos os creators dos grupos selecionados.

2. **Grupos de creators** — agrupamentos nomeados de creators da organização (ex.: "Webiner Nubank", "Conteúdo Comercial"). Servem para liberar Produtos em lote e organizar campanhas. São **distintos** dos grupos de staff/permissões (Pessoas & Permissões) — aqui o assunto é quem produz conteúdo, não quem administra o painel.

3. **Atribuição da inscrição** — cada inscrição recebida via Saiba Mais guarda sua **origem**: o creator (e o pitch) que a gerou. Isso transforma número agregado em atribuição — *"o pitch da Amanda gerou 67% das candidaturas desta vaga"*.

> A elegibilidade responde **"quem PODE vender"**; a atribuição responde **"quem DE FATO converteu"**. Uma governa a entrada, a outra mede o resultado.

---

## 4. Para quem é

### Usuários (quem opera no dia a dia)

| Persona | O que ganha |
|---|---|
| **Admin / Gestor do canal** | Define, no wizard de criação, quem pode vender cada Produto; cria e mantém grupos de creators na aba "Creators & Grupos". |
| **Gestor de campanha** | Libera um Produto para um grupo inteiro num clique, em vez de selecionar creator por creator. |
| **RH / Comercial / Educação** | No detalhe do Produto, vê a lista de inscritos e filtra por creator/grupo para entender qual creator está performando. |
| **Creator institucionalizado** | Ao publicar conteúdo (`/create`), vê só os Produtos que está habilitado a vender — sem ruído, sem produto que não lhe pertence. |

### Stakeholders (quem decide e mede)

| Stakeholder | O que enxerga |
|---|---|
| **Diretoria de produto** | A peça que operacionaliza a tese "creator institucionalizado": empresa governa o palco, creator assina o conteúdo, e o sistema liga os dois com regra explícita. |
| **Marketing / Branding** | Capacidade de orquestrar campanhas por elenco de creators (quem fala por qual produto), preservando coerência de marca. |
| **CFO / Growth** | Atribuição por creator é a base de qualquer modelo futuro de incentivo/remuneração de creators e de priorização de Campanha Patrocinada. |
| **Compliance / Legal** | Controle explícito de quem está autorizado a vender cada Produto; histórico de origem das inscrições (atribuição) auditável. |

---

## 5. Como funciona em 30 segundos

```
Empresa cadastra creators do canal e (opcional) os organiza em Grupos
   (aba "Creators & Grupos" no Painel)
        │
        ▼
Ao publicar um Produto (wizard), escolhe a regra de elegibilidade:
   Qualquer creator  |  Creators específicos  |  Grupos de creators
        │
        ▼
Creator abre /create para publicar conteúdo
   → vê apenas os Produtos liberados para ele
   → anexa o Produto que o conteúdo vende
        │
        ▼
Público clica "Saiba Mais" no conteúdo → formulário dinâmico → submete
        │
        ▼
A inscrição entra na Triagem carimbada com a ORIGEM (creator + pitch)
        │
        ▼
No detalhe do Produto, o time vê os inscritos e FILTRA por creator/grupo
```

---

## 6. Por que isso muda a experiência

| Antes | Depois |
|---|---|
| Não havia controle de quem podia vender um Produto. | Regra explícita por Produto (qualquer / creators / grupos). |
| Liberar muitos creators era manual e não escalava. | Grupos liberam dezenas de creators de uma vez. |
| O creator via tudo (ou nada) ao publicar. | O creator vê só os Produtos liberados para ele. |
| Inscrições eram um balde único por Produto. | Inscrições filtráveis por creator/grupo de origem. |
| Retorno por creator era invisível no dia a dia. | Atribuição exposta no detalhe do Produto. |

---

## 7. Diferenciais estratégicos

- **Governança sem fricção.** A empresa decide o elenco de cada Produto na própria criação — uma etapa a mais no wizard, zero ferramenta nova.
- **Escala por grupo.** Campanhas grandes (webinar, mutirão de vagas) liberam um grupo inteiro; trocar o elenco é editar o grupo, não cada Produto.
- **Loop de atribuição fechado.** A origem da inscrição (creator + pitch) viaja com o dado da submissão e aparece para o operador — base para reputação e remuneração de creators.
- **Coerência com a tese.** Reforça a separação Produto ↔ Pitch: o Produto é da empresa, a assinatura é do creator, e a elegibilidade é o contrato entre os dois.

---

## 8. Como medir sucesso

| Métrica | O que indica |
|---|---|
| **% de Produtos com elegibilidade restrita** (creators/grupos) | Maturidade da orquestração de campanhas. |
| **Nº de grupos de creators ativos por organização** | Adoção do modelo de elenco. |
| **Cobertura de atribuição** (inscrições com origem / total) | Saúde do loop de atribuição — quanto do funil é rastreável até um creator. |
| **Conversão por creator/grupo** (inscrições atribuídas / pitches) | Qual creator/elenco converte melhor por Produto. |
| **Produtos liberados por creator** | Carga e foco de cada creator no canal. |

---

## 9. Modelo de dados (resumo)

A funcionalidade adiciona, sobre o modelo de Produto/Pitch já existente:

| Tabela / campo | Papel |
|---|---|
| `products.pitch_eligibility_mode` | Modo da regra: `any` \| `creators` \| `groups`. |
| `product_eligible_creators` | Junção Produto → creators habilitados (modo `creators`). |
| `product_eligible_groups` | Junção Produto → grupos habilitados (modo `groups`). |
| `organization_creators` | Roster de creators institucionalizados da organização. |
| `creator_groups` | Grupos nomeados de creators (ex.: "Webiner Nubank"). |
| `creator_group_members` | Junção grupo ↔ creator. |
| `product_submissions.attributed_pitch_id` | Atribuição: qual pitch (e portanto qual creator) gerou a inscrição. *(já existente no modelo; agora exposto na interface).* |

Detalhe completo do schema em [/sql](../../sql/) (arquivos `products.sql`, `organization_creators.sql`, `creator_groups.sql`, `creator_group_members.sql`, `product_eligible_creators.sql`, `product_eligible_groups.sql`).

---

## 10. Onde isso aparece no produto

| Superfície | O que faz |
|---|---|
| **Painel → aba "Creators & Grupos"** | Lista o roster de creators do canal; cria grupos e adiciona creators a eles. |
| **Wizard de Produto → etapa "Quem pode vender este Produto?"** | Escolhe o modo de elegibilidade e seleciona creators/grupos. |
| **Detalhe do Produto** | Mostra os creators/grupos habilitados, a lista de inscritos e o filtro por creator/grupo. |
| **`/create` (lado do creator)** | Campo "Produto que este conteúdo vende", listando só os Produtos liberados ao creator. |

---

## 11. Status de entrega

Implementada em fases incrementais, todas validadas com smoke tests end-to-end contra o backend mock:

| Fase | Entrega |
|---|---|
| 0 | Fundação — entities, DTOs, maps, mocks (api-server) e schema SQL (elegibilidade, grupos de creators, atribuição). |
| 1 | UI de roster & grupos de creators (aba "Creators & Grupos"). |
| 2 | Etapa de elegibilidade no wizard de criação de Produto. |
| 3 | Detalhe do Produto: creators/grupos habilitados + lista de inscritos + filtro por creator/grupo. |
| 4 | `/create`: lista de Produtos liberados ao creator. |

**Pendências conhecidas** (fora do escopo das fases acima):
- **Identidade real do creator em `/create`.** Hoje usa um creator de demonstração; depende de autenticação/contexto de creator que ainda não existe na plataforma.
- **Persistência da publicação do pitch.** O `publish` de `/create` ainda é mock — não cria o pitch nem grava o vínculo Produto↔Pitch no backend.
- **Edição da elegibilidade após criar o Produto** (hoje definida apenas no wizard de criação).

---

## 12. Onde aprofundar

- **Por que Produto e Vídeo são entidades separadas** (base conceitual): [Resposta — por que separar produto de vídeo](Resposta-por%20que%20separar%20produto%20de%20v%C3%ADdeo.md)
- **Painel Minha Empresa** (contexto do canal corporativo): [README.md](README.md)
- **Especificação operacional do painel**: [doc.md](doc.md)
- **Tese da plataforma**: [../../README.md](../../README.md)
- **Creator institucionalizado**: [../../doc/Creator Institucionalizado.md](../../doc/Creator%20Institucionalizado.md)
