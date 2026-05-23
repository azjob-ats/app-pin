 ```
 Tipo de Produto:
 - Vagas

 - Produtos/Serviços

 - Treinamentos/Cursos/workshop/webinar

 - Notícias
 
 - Contéudo/Entretenimento
 
Presivo vender determinado tipo de Produto, porem para vender preciso de um creator, para produzir post de video explicando
sobre o Produto. o produto é acessado pelo botão ´Saiba Mais´. O que faz esse botão? apresenta um formulario. ele pode conter link,
campos, pode ser uma confirmação, redirecionamento, pagamento...

minha duvida é, devo separa a estrututa de Produto e post de video, ou incluir post de video no cadastro de um produto?
```
# Por que separar Produto de Vídeo

> Contexto: ao modelar o domínio de **Produto** (Vaga, Produto/Serviço, Treinamento, Notícia, Conteúdo/Entretenimento) surgiu a dúvida de embutir o post de vídeo do creator dentro do cadastro do produto, ou separar em entidade própria. Decisão registrada aqui.

**Resposta direta: separe.** E na verdade não são 2, são **3 entidades distintas** + o "Saiba Mais" que é uma 4ª.

## Por que separar Produto de Vídeo

Olhando isoladamente parece tentador colocar `video_url` direto em `products`. Mas os dois têm **ciclos de vida, autoria e métricas completamente diferentes**:

| Dimensão | Produto | Vídeo |
|---|---|---|
| **Quem cria** | Empresa (RH, Comercial, Educação…) | Creator (Amanda, Bruno…) |
| **Quando nasce** | Antes do vídeo (rascunho) | Depois — pode demorar dias |
| **Pode existir sozinho?** | Sim (vaga publicada sem vídeo) | Sim (vídeo de portfólio do creator) |
| **Cardinalidade real** | 1 Produto → N Vídeos (várias takes, vários creators) | 1 Vídeo → potencialmente N Produtos (ex: "carreira no Nubank" referencia todas as vagas) |
| **Métricas relevantes** | Conversão, candidatos, ticket | Retenção, watch time, completion |
| **Quem é dono dos dados** | Organização | Creator (autoria perene) |

A tese do RealWe ("creator institucionalizado", from [doc/Creator Institucionalizado.md](../../doc/Creator%20Institucionalizado.md) e [spec/empresa/melhoria.md](melhoria.md)) **exige** essa separação: você precisa rastrear que **a Amanda** fez o vídeo da Vaga X, e que esse vídeo da Amanda gera M% de retenção. Se vídeo for coluna em `products`, você perde:

- O "by [Creator Name]" como entidade primeira-classe
- Métricas de creator agregadas (retenção média da Amanda em vagas vs. cursos)
- Re-uso do mesmo vídeo em produtos correlatos
- Histórico: vídeo antigo (low retention) → vídeo novo da mesma vaga

## Como as 4 entidades se relacionam

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  organizations   │ 1 ──── ∞│    products      │∞ ──── ∞ │     pitches      │
│  (Nubank)        │         │ (Vaga, Curso…)   │ via junção│ (autoria Creator)│
└──────────────────┘         └────┬─────────────┘         └──────────────────┘
                                  │
                                  │ 1
                                  ▼
                          ┌──────────────────┐
                          │ product_cta_forms │  ← o "Saiba Mais"
                          │ (link/form/pgmt)  │
                          └────┬──────────────┘
                               │ 1
                               ▼
                          ┌──────────────────┐
                          │product_submissions│  ← respostas recebidas
                          └──────────────────┘
```

## Sketch das 4 tabelas

```sql
Enum product_phase { draft; published; closed; archived }

Table products {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  organization_id bigint [ref: > organizations.id, not null]
  department_id bigint [ref: > organization_departments.id]    // RH, Comercial, Universidade…
  type product_type [not null]                                  // job, service, training, news, experience
  title varchar [not null]
  description text
  cover_image_url varchar
  phase product_phase [not null, default: 'draft']              // sua coluna de Kanban
  custom_phase_id bigint                                        // FK para custom_phases (ou jsonb na org)
  starts_at timestamptz                                         // publicação programada
  ends_at timestamptz                                           // expiração (vaga fecha em…)
  created_by_user_id bigint [ref: > users.id, not null]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  // type-specific data fica em jsonb pra não explodir colunas
  type_metadata jsonb                                           // {salary_range, location, work_mode} para job; {price, duration} para training; etc
}
```

```sql
// PITCHES — o vídeo do creator vendendo/explicando um produto.
// Nome escolhido porque carrega a intenção comercial (pitch de vaga, pitch
// de curso, pitch de serviço) e diferencia de conteúdo orgânico do creator.
Table pitches {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  creator_user_id bigint [ref: > users.id, not null]            // o creator que fez
  title varchar [not null]
  description text
  storage_url varchar [not null]                                // ou FK para media_assets quando você criar
  thumbnail_url varchar
  duration_seconds integer
  format varchar                                                // 'short', 'long' — curto (Reels-like) vs longo
  status varchar [not null, default: 'processing']              // processing, ready, failed
  published_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz
}
```

```sql
// JUNÇÃO — é aqui que mora o "by [Creator Name]" e o ranking
Table product_pitches {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, not null]
  pitch_id bigint [ref: > pitches.id, not null]
  is_primary boolean [not null, default: false]                 // o "featured" do produto
  display_order integer [not null, default: 0]
  attribution_label varchar                                     // sobrescreve o nome (opcional)
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (product_id, pitch_id) [unique]
    (product_id, is_primary)                                    // partial: where is_primary = true
  }
}
```

```sql
// O "SAIBA MAIS" — polimórfico via type + jsonb
Enum product_cta_type {
  external_link        // só redireciona
  form                 // coleta dados (nome, email, currículo…)
  confirmation         // 1-click "tenho interesse"
  payment              // checkout
  redirect_internal    // outra tela do RealWe
}

Table product_cta_forms {
  id bigint [pk, increment]
  product_id bigint [ref: > products.id, unique, not null]      // 1:1 com produto (se quiser 1:N, remover unique)
  type product_cta_type [not null]
  label varchar [not null, default: 'Saiba Mais']               // texto do botão
  config jsonb [not null]                                       // dependente do type — esquema abaixo
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

// Exemplos de config por type:
//   external_link    → {"url":"https://nubank.com.br/carreiras/x", "open_in":"new_tab"}
//   form             → {"fields":[
//                          {"key":"full_name","label":"Nome","type":"text","required":true},
//                          {"key":"cv","label":"Currículo","type":"file","accept":[".pdf"]}
//                        ],"submit_label":"Enviar candidatura","privacy_required":true}
//   confirmation     → {"confirmation_message":"Recebido! Em breve entramos em contato."}
//   payment          → {"provider":"stripe","price_cents":29900,"currency":"BRL","success_url":"/obrigado"}
//   redirect_internal→ {"path":"/curso/:slug/inscricao"}
```

```sql
Table product_submissions {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  product_id bigint [ref: > products.id, not null]
  cta_form_id bigint [ref: > product_cta_forms.id, not null]
  submitter_user_id bigint [ref: > users.id]                    // NULL = anônimo (visitante)
  submitter_email varchar                                       // capturado se anônimo
  payload jsonb [not null]                                      // os campos preenchidos
  triage_phase varchar [not null, default: 'inbox']             // Kanban de Triagem
  attributed_pitch_id bigint [ref: > pitches.id]                // qual pitch gerou essa conversão (atribuição)
  source_url varchar                                            // referrer
  ip_hash varchar                                               // LGPD: hash, não IP cru
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}
```

## Pontos importantes para você decidir

**1. Por que `product_pitches` é tabela separada (junção) e não FK direta em `products`?**
Porque você quer:
- Vários pitches por produto (Amanda fez o curto, Bruno fez o longo)
- Marcar qual é o "primary" (aparece no card)
- Re-uso futuro (mesmo pitch institucional referenciado em 5 vagas)

Se você decidir que é estritamente 1:1, simplifica para `products.pitch_id`. Mas pela tese do projeto, eu manteria a junção.

**2. Por que `product_cta_forms` é 1:1 mas tabela separada?**
- O `config jsonb` polimórfico é pesado — sai do `products` para não poluir
- Permite versionamento futuro (histórico de mudanças de formulário sem perder submissões antigas)
- Se você quiser A/B test (2 CTAs no mesmo produto), basta tirar o `unique`

**3. `attributed_pitch_id` em `submissions` — por que isso é gold?**
Porque é o que **fecha o loop da tese**: você consegue dizer *"o pitch da Amanda gerou 67% das candidaturas dessa vaga"*. Sem essa coluna, você só tem números agregados. Com ela, você tem **atribuição** — é o que justifica pagar/destacar creators.

**4. O `type_metadata jsonb` em `products` te assusta?**
Você pode trocar por tabelas filhas (`product_job_details`, `product_training_details` etc.) se quiser tipagem forte. Trade-off: jsonb = flexível mas sem constraint; tabela filha = rigorosa mas explode JOINs. Para 5 types relativamente estáveis, eu começaria com jsonb e migraria por tipo se algum amadurecer muito.

---

**TL;DR:** separe em `products`, `pitches`, `product_pitches` (junção) e `product_cta_forms`. O pitch **não é atributo do produto**, é uma entidade própria com autoria, métricas e ciclo de vida independentes — e isso é exatamente o que sua tese de "creator institucionalizado" precisa para ser modelável.
