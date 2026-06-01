# Minha Empresa

> Backstage do canal corporativo na RealWe. O ambiente onde a empresa publica Produtos (Vagas, Serviços, Treinamentos, Notícias, Experiências), captura submissões via Saiba Mais e opera a Triagem — tudo no mesmo lugar.

---

## 1. Em uma frase

**A empresa publica Produtos. Cada Produto carrega um botão "Saiba Mais". O Saiba Mais abre um formulário dinâmico. Cada submissão entra em um Kanban de Triagem.**

Esse loop é a única mecânica de conversão da RealWe — independente do que a empresa está oferecendo.

---

## 2. O problema que resolve

Antes de Minha Empresa, "Painel" significava "Painel de Vagas" e o backstage era exclusivo do recrutador. Esse recorte deixou de fora 80% do que uma empresa quer comunicar pela plataforma:

| Cenário típico | Antes | Agora |
|---|---|---|
| RH publica uma vaga | Suportado | Tipo **Vaga** |
| Comercial quer captar lead de um serviço | Não suportado | Tipo **Produto/Serviço** |
| Educação abre inscrições para um workshop | Não suportado | Tipo **Treinamento** |
| Comunicação distribui um release | Não suportado | Tipo **Notícia** |
| Operações agenda visitas guiadas | Não suportado | Tipo **Experiência** |

A consequência: empresas mantinham 5 ferramentas paralelas (ATS, CRM, plataforma de webinar, mailing, calendário) e perdiam o efeito-rede de operar tudo num único canal de autoridade.

---

## 3. A solução: Produto como objeto-mãe

Vaga, Serviço, Treinamento, Notícia e Experiência são **tipos** do mesmo objeto canônico — **Produto**. Todos compartilham:

- Mesmo ciclo de vida (Backlog → Em campanha → Pausada → Encerrada).
- Mesmo motor de conversão (Saiba Mais → drawer com formulário dinâmico).
- Mesmo destino operacional (Kanban de Triagem com pipeline por tipo).
- Mesma elegibilidade para Campanha Patrocinada Qualificada.

O que muda entre tipos é apenas:

1. **Preset do formulário de criação** — o que o time precisa preencher.
2. **Preset do formulário de Saiba Mais** — o que o público precisa responder.
3. **Pipeline default da Triagem** — as fases pelas quais a submissão caminha (editável por empresa).

> Esse desenho é o que permite acrescentar um novo vertical (ex.: "Vaga de Voluntariado") sem reimplementar nada — só registrar um novo tipo de Produto.

---

## 4. Para quem é

### Usuários (quem opera no dia a dia)

| Persona | O que ganha |
|---|---|
| **RH / Recrutador** | Publica vagas, candidatos entram via Saiba Mais, triagem com pipeline próprio (Recebida → Entrevista → Aprovado). |
| **Comercial** | Capta leads qualificados por produto/serviço; cada submissão vira card num funil de vendas. |
| **Educação** | Abre inscrições em cursos/webinars; pipeline acompanha do inscrito ao certificado. |
| **Comunicação** | Distribui releases com opt-in; constrói lista segmentada de assinantes. |
| **Operações / Eventos** | Recebe pedidos de visita/demo com data preferencial; agenda e confirma direto no Kanban. |
| **Admin da Organização** | Gerencia equipe com permissões granulares por tipo de Produto, edita página pública, vê métricas do canal. |

### Stakeholders (quem decide e mede)

| Stakeholder | O que enxerga |
|---|---|
| **Diretoria de produto** | Uma única superfície que substitui 5 ferramentas, com efeito-rede crescente. |
| **Marketing / Branding** | Página pública do canal (`empresa.realwe`) que opera como vitrine multi-vertical da marca. |
| **CFO** | Modelo freemium (publicar é grátis) com receita atribuível em Campanha Patrocinada Qualificada — só paga quem já performa organicamente. |
| **Compliance / Legal** | Autenticidade garantida por verificação de e-mail corporativo; permissões granulares por papel; histórico auditável de submissões e movimentações. |

---

## 5. Como funciona em 30 segundos

```
Empresa cria Organização (validação por e-mail corporativo)
        │
        ▼
Publica Produto via wizard de 6 etapas
   (escolhe tipo → preenche identificação → descrição
    → define o que pedir no Saiba Mais → perguntas de triagem
    → revisa → publica)
        │
        ▼
Move Produto para "Em campanha" no Kanban
        │
        ▼
Página pública (empresa.realwe) lista Produtos por tipo
        │
        ▼
Visitante clica Saiba Mais → drawer com formulário dinâmico → submete
        │
        ▼
Submissão entra automaticamente no Kanban de Triagem
do Produto correspondente, na fase inicial do pipeline daquele tipo
        │
        ▼
Time operacional move o card pelas fases até o desfecho
        │
        ▼
Métricas medem retenção, conversão e elegibilidade para Patrocinada
```

---

## 6. Por que isso muda a experiência

| Antes | Depois |
|---|---|
| Recrutador opera num sistema; comercial em outro; educação em outro. | Todos os times operam no mesmo canal, com permissões diferentes. |
| Página da empresa só lista vagas. | Página pública vira vitrine multi-vertical da marca. |
| Conversão = enviar e-mail e torcer. | Conversão = clicar Saiba Mais → form dinâmico → card na Triagem (atribuível por Produto). |
| Decisão de patrocinar = aposta. | Lista automática de Produtos elegíveis com métricas reais — só paga quem já converte. |
| Adicionar um vertical novo = projeto. | Adicionar um vertical novo = registrar um tipo de Produto. |

---

## 7. Diferenciais estratégicos

- **Atribuição ponta a ponta.** Toda submissão é rastreável até o Produto que a gerou — ao contrário de formulários genéricos espalhados pelo site corporativo.
- **Mesma mecânica, escala vertical.** O time não aprende uma ferramenta nova por tipo de Produto — aprende uma e replica.
- **Página pública multi-vertical.** A vitrine `empresa.realwe` agrega Vagas, Produtos, Treinamentos, Notícias e Experiências num único endereço — fortalecendo employer branding **e** funil comercial **e** educacional simultaneamente.
- **Permissões granulares por tipo.** Recrutador só vê vagas; comercial só vê serviços; admin vê tudo. Convites em lote via Grupos (ex.: adicionar 5 pessoas ao grupo "RH" já dá a função "Recrutador" a todas).
- **Receita qualificada.** Campanha Patrocinada só é oferecida a Produtos que já têm performance orgânica mínima — protege a confiança do usuário e alinha incentivos.

---

## 8. Como medir sucesso

Métricas observadas no dashboard interno (tab Métricas) e que devem balizar evolução do produto:

| Métrica | O que indica |
|---|---|
| **Produtos publicados por organização** | Adoção horizontal (quantos verticais a empresa usa). |
| **Taxa de conversão por tipo** | Submissões / Visualizações por Produto. Permite comparar vertical mais eficiente. |
| **Tempo do Backlog até Em campanha** | Velocidade operacional do time. |
| **Tempo médio na Triagem por fase** | Saúde do funil — fases que acumulam revelam gargalo. |
| **Produtos elegíveis para Patrocinada** | Pipeline de receita futura. |
| **Membros ativos por organização** | Maturidade da operação interna. |

---

## 9. Status de entrega

A funcionalidade foi implementada em 11 partes incrementais, todas shippable e validadas com smoke tests end-to-end contra o backend mock:

| # | Entrega | Marco |
|---|---|---|
| 0 | Fundação compartilhada (enums, DTOs, entities, maps, APIs, mock) | |
| 1 | Ver e Criar Organizações | |
| 2 | Shell do Painel com 5 tabs | |
| 3 | Gerenciar Produtos (Kanban genérico) | **Marco 1** — mover Produtos no Kanban |
| 4 | Criar Produto (wizard 6 etapas) | |
| 5 | Detalhe do Produto | |
| 6 | Saiba Mais universal (drawer + form dinâmico) | **Marco 2** — loop público completo |
| 7 | Triagens (Kanban de submissões) | |
| 8 | Detalhe da Submissão | |
| 9 | Pessoas & Permissões | |
| 10 | Página da Empresa (admin + pública) | |
| 11 | Métricas (funil + elegibilidade Patrocinada) | |

---

## 10. Onde aprofundar

- **Especificação operacional completa** (telas, layouts, validações, payloads): [doc.md](doc.md)
- **Departamentos** (camada entre Organização e o Painel/Kanban): [departamentos.md](departamentos.md)
- **Confirmação de e-mail corporativo** (onboarding por domínio — proposta): [confirmacao-email-corporativo.md](confirmacao-email-corporativo.md)
- **Motor de formulário dinâmico** usado pelo Saiba Mais: [../learn-more/DYNAMIC_ENGINE.md](../learn-more/DYNAMIC_ENGINE.md)
- **Modelo de receita** (Campanha Patrocinada Qualificada): [../sponsored-campaigns/doc.md](../sponsored-campaigns/doc.md)
- **Tese da plataforma**: [../../README.md](../../README.md) (raiz do projeto)
- **Conceito de canal corporativo + creator institucionalizado**: [../../doc/Creator Institucionalizado.md](../../doc/Creator%20Institucionalizado.md)

---

## 11. Próximos passos sugeridos

Itens que ficaram fora do escopo do plano inicial e podem ser priorizados conforme demanda:

- **Modo Edit no wizard** de Produto (pré-preenchimento a partir do detalhe).
- **Ações em lote na Triagem** (atribuir, mover, exportar CSV).
- **Métricas por creator** (integração com Channel/Posts para fechar o funil do criador institucionalizado).
- **Upload nativo** de imagens (banner, logo, currículo) — hoje apenas via URL.
- **Custom phases persistentes** no Kanban (hoje custom phases ficam no estado local do navegador).
- **Convivência da página pública nova** (`empresa.realwe`) com o canal de creator individual já existente — decisão de IA pública.
