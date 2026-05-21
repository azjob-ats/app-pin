# Próximos passos opcionais que ficaram fora do plano

- Atualizar `channel.component` (canal público existente) para conviver com a nova `/:slug/publico` da organização — requer decisão de produto sobre IA pública.
- Modo Edit no wizard de Produto (pré-preencher do detalhe).
- Ações em lote na Triagem (atribuir, exportar CSV).
- Métricas por creator (depende de integração com Channel/Posts).
- Upload nativo de imagens (banner/logo/avatar/currículo) — hoje só URL.

> Quer que eu implemente algum desses follow-ups ou prefere validar visualmente o que já temos (`npm run start` + `cd api-server && npm start`)?

---

# 1. Pontos fracos

## Estratégicos

- A ideia de **"creator institucionalizado"** sumiu de Minha Empresa. Não há nenhuma vinculação Produto → Creator → métricas de vídeo. O Produto hoje vive isolado do conteúdo que deveria gerá-lo. Isso esvazia a tese.
- **Página pública desconectada** do `channel.component`. Hoje existem dois mundos paralelos: `/:username` (creator individual) e `/empresa/:slug/publico` (organização). Não há ponte. Stakeholder pergunta "qual a URL pública da Nubank?" e você responde "depende".
- **Sem integração com a Comunidade**. O doc da plataforma cita "Comunidade" como pilar do funil. Nenhuma das 11 partes implementa relação Produto ↔ Comunidade.
- **Fácil ser superado em cada vertical isolado**. Greenhouse vence em Vaga, HubSpot vence em Lead, Hotmart vence em Curso. O diferencial é a soma — mas se a empresa já tem Greenhouse, qual o incentivo de duplicar a vaga aqui?

## UX/UI

- **Mobile-hostile** em pontos críticos. Kanban com colunas de 278px + drag-drop CDK não funciona bem em touch. Tab de Produtos é a tela mais usada e a menos amigável em mobile.
- **Wizard de 6 etapas** para publicar uma Notícia é overkill. Mesma fricção para Vaga (que merece) e Notícia (que poderia ser 2 etapas).
- **Sem dark mode** (apesar do projeto ter `LightDarkToggleComponent`).
- **Sem testes de A11y rodados** (apenas atributos manuais — axe não foi executado).
- **Sem indicador de "fila otimista pendente"** quando múltiplos moves ocorrem — só `isMoving` por item.
- **Detalhe da Submissão** parece Greenhouse genérico — funcional mas não inovador.

## Técnicos

- **Permissões só existem na UI** da matriz, mas não são aplicadas. Não há `canActivate` checando permissão; qualquer membro vê tudo. A matriz é cosmética.
- **Custom phases do Kanban não persistem**. Recarrega → some. Falsa promessa de "pipeline editável por empresa".
- **`product-create-component` está em 109 KB de chunk** — wizard inline em 1 arquivo. Difícil de manter à medida que cresce.
- **Adapter do Saiba Mais flattens multi-step**. O Dynamic Engine suporta steps, mas o adapter junta tudo em um único step. Limita formulários complexos.
- **Backend é mock JavaScript em memória**. Cada restart perde estado. Migração para backend real é trabalho substantivo não escopado.
- **`OrganizationListStore.upsert`** tem lógica de contagem frouxa que pode dessincronizar.
- **Effects que disparam loads** (`PanelProductsComponent`, `PanelTriageComponent`) usam o padrão "se vazio E não loading, carregue" — funciona, mas é frágil. Se o backend retornar lista vazia legítima, vai re-loadar em loop em alguns cenários.

---

# 2. Riscos

| # | Risco | Severidade | Probabilidade |
|---|-------|------------|----------------|
| 1 | **Concorrência vertical**: cada vertical isolado já tem player dominante. A força é a unificação, mas grandes empresas raramente migram stacks consolidadas. | Alta | Alta |
| 2 | **Falta de cold-start de creators**: a tese é "pessoas reais publicando consistentemente". Sem isso, vira "empresa publica vagas em outro lugar". O cenário pior é virar mais um job board. | Alta | Média |
| 3 | **Adoção horizontal lenta**: o valor cresce quando a empresa usa 3+ verticais. Provavelmente cada empresa entra por 1 (geralmente Vaga). Risco de virar "site de vagas com features mortas". | Alta | Alta |
| 4 | **Permissões cosméticas**: hoje a matriz existe na UI mas não bloqueia ações reais. Em produção, um membro com função "Visualizador" consegue criar Produto. Risco de incidente de segurança/compliance. | Alta | Alta (até virar guards) |
| 5 | **Migração mock → backend real**: o `api-server` é Express+JS sem persistência. Mover para backend real envolve schema, auth, eventos, file upload, integrações — escopo grande não dimensionado. | Média | Alta |
| 6 | **Drag-drop CDK em mobile**: usuários abrem em celular, tentam arrastar, falham, fecham. Risco de churn em onboarding. | Média | Alta |
| 7 | **`channel.component` x `empresa.realwe`**: dois canais públicos coexistem sem decisão de IA. Risco de confusão de marca interna e externa. | Média | Certa (existe hoje) |
| 8 | **Saiba Mais como SPOF**: se quebrar (no engine ou no adapter), TODA conversão para. Sem fallback, sem feature flag por tipo. | Média | Baixa |
| 9 | **Página pública SSR/SEO**: hoje a `/empresa/:slug/publico` é SPA. Para vencer "empresa.realwe" como vitrine, precisa de SSR + SEO. Sem isso, Google não indexa o canal. | Alta | Certa |
| 10 | **LGPD/Privacidade**: submissões via Saiba Mais coletam PII (nome, email, currículo). Hoje só há checkbox cosmético de privacidade. Risco regulatório real. | Alta | Alta |

# 3. Sugestões estratégicas (nível produto)

## 3.1 Reposicionar Minha Empresa contra a tese verdadeira

A funcionalidade hoje está vendida como "backstage operacional multi-produto". Isso é correto mas pequeno demais. **Reposicionar como "o currículo institucional vivo da empresa, alimentado por seus creators"**. A diferença prática:

- Cada Produto carrega **"by [Creator Name]" obrigatório** (não opcional).
- **Métricas do creator** (retenção, engajamento, autoridade) aparecem no card do Produto público.
- Recrutador/candidato passa a entender **quem realmente trabalha lá antes de aplicar** — algo que LinkedIn não entrega.

---

## 4.2 Encontrar o vertical-âncora antes de vender multi-vertical

Empresa típica **não entra por "uma plataforma para 5 coisas"**. Entra por **"preciso resolver X"**.

O **vertical-âncora deve ser Vagas** (mercado maduro, dor recorrente, ticket alto). Os outros 4 viram **features de upgrade** (cross-sell natural depois que a empresa já está dentro).

### Implicação prática:

- A homepage de marketing fala de **Vagas com creator institucionalizado**.
- Sub-menus listam os outros.
- Hoje os 5 verticais estão no mesmo plano hierárquico — **diluído**.

# 4. Oportunidades de melhoria

## De baixo custo / alto retorno

- **Aplicar permissões de verdade**: criar guard `empresaPermission(action)` e usar nos buttons/routes. Sem isso, a matriz é mentira de marketing.
- **Mobile-first do Kanban**: alternar para visão "lista por fase com seletor" abaixo de 768px. Mantém drag-drop em desktop.
- **Wizard adaptativo por tipo**: Notícia/Experiência podem ter 2-3 etapas; Vaga/Treinamento mantêm 6. Reduz fricção sem perder potência.
- **Persistir custom phases**: adicionar endpoint no mock + campo `customPhases: Phase[]` na Organization.
- **Quebrar `product-create.component.ts`** em 5 step components — vai escalar muito melhor.
- **Adicionar SEO meta tags** na página pública via Resolver + `SeoService` (já existe no projeto, usado pelo channel).

---

## De médio custo / alto retorno

- **Conectar Produto a vídeo**: cada Produto deveria ter campo `featuredVideoId` (curto + longo) e métricas de retenção influenciando o ranking público e a elegibilidade para Patrocinada. Sem isso, a tese da plataforma morre aqui.
- **Atrelar Produto a Creator**: campo `byCreatorIds: string[]` no Produto. Página pública mostra "Vaga apresentada por [Amanda Silva]". Esse é o **"by-line"** que separa RealWe de qualquer job board.
- **SSR para a página pública**: usar Angular SSR para `/:slug/publico`. Indexação no Google + LinkedIn unfurl + WhatsApp preview.
- **Dashboard de Métricas com gráficos** (não só tabelas): heatmap de conversão por tipo×semana, funil visual. Stakeholder demanda isso.
- **Bulk actions na Triagem**: mover, atribuir, exportar CSV — já está no plano original como "futura iteração", mas é commodity para qualquer ATS.
- **Tabela `employees` separada de `organization_members`** (decisão de modelagem futura): hoje `organization_members` cobre "quem tem acesso ao backstage" (3–20 pessoas). Falta o conceito de **vínculo empregatício** ("quem trabalha na empresa", potencialmente milhares). São conceitos distintos — funcionário comum não precisa ser member; consultor externo é member sem ser funcionário. Quando entrar uma destas features, criar `employees` (org_id, user_id nullable, full_name, corporate_email + verified_at, department_id, job_title, employment_type, hired_at, terminated_at, is_public) como tabela à parte. Casos de uso que destravam a criação:
    - Badge "Verificado: trabalha no Nubank" no perfil público do user (verificação via corporate_email).
    - Vagas internas (visíveis só para funcionários verificados da organização).
    - Diretório/org chart interno e busca por funcionário.
    - Métricas de adoção interna ("X% dos funcionários do Nubank têm perfil na RealWe").
    - Onboarding automático: funcionário importado por CSV do RH → ganha perfil pré-preenchido ao criar conta.
  - Enquanto nenhum desses entrar no roadmap, **não criar a tabela** — `user_experience.company` já cobre o "eu digo que trabalho aqui" não-verificado, e adicionar agora é peso morto.

---

## De alto custo / alto retorno

- **Backend real com Postgres + Auth + Eventos + Storage**. Sem isso, nada é demonstrável para cliente pagante.
- **Marketplace de templates**: empresa A publica "Vaga Engineering Sr." e outras empresas clonam como ponto de partida. Acelera adoção e cria network effect.
- **Comunidade por canal**: chat + threads por Produto/Categoria. Fecha o pilar "Comunidade" do funil da plataforma.

# 5. Síntese
A engenharia está pronta para um produto bom. A estratégia precisa de duas correções para virar um produto diferenciado: (1) materializar a ponte com vídeo + creator que a tese promete, e (2) escolher um vertical-âncora ao invés de vender os 5 igualmente. Sem isso, o destino mais provável é um SaaS operacional sólido — mas substituível.

Com essas correções, é um candidato real a ocupar o espaço entre LinkedIn corporativo (rígido) e site corporativo (estático) — uma fatia de mercado grande, mal servida, e onde o casamento "creator institucionalizado + conversão atribuível + multi-vertical" não tem incumbente óbvio.