# Confirmação de E-mail Corporativo — Onboarding por domínio

> **Status: proposta / não implementada.** Depende de autenticação real (ainda inexistente). Este documento registra o desenho, as dependências e os edge cases para priorização futura.

> Caminho de entrada complementar ao convite: em vez de o admin convidar pessoa a pessoa, quem tem um e-mail do domínio da empresa (`amanda.silva@nubank.com`) confirma o endereço e entra sozinho — com função mínima e sob aprovação. Dá à organização um onboarding self-service e uma contagem de colaboradores **ativos na plataforma**.

---

## 1. Em uma frase

**Um colaborador informa seu e-mail corporativo, recebe um link de confirmação, e ao confirmar é associado automaticamente à organização daquele domínio — entrando com uma função padrão mínima que o admin aprova/ajusta.**

É o caminho **pull** (a pessoa entra) que complementa o caminho **push** já existente (o admin convida).

---

## 2. O problema que resolve

Hoje a única forma de alguém virar membro de uma organização é o **convite individual** (aba Pessoas → "Convidar membro" → e-mail + função). Isso funciona, mas não escala para empresas grandes onde dezenas/centenas de colaboradores deveriam ter acesso.

| Cenário | Hoje (só convite) | Com confirmação por domínio |
|---|---|---|
| Onboarding de 80 pessoas do time | Admin convida 80 e-mails à mão | Colaboradores confirmam o próprio e-mail e entram |
| Saber quantos colaboradores usam a plataforma | Contagem manual dos convidados | Contagem automática dos confirmados |
| Garantir que quem entra é da empresa | Confiança no e-mail digitado no convite | E-mail do domínio verificado por link |

> **Ressalva honesta:** isto conta **colaboradores ativos na plataforma** (que optaram por entrar), **não** o headcount real do RH. O número responde "quantos da Nubank se cadastraram", não "quantos a Nubank tem".

---

## 3. A solução: associação por domínio verificado

Três peças:

1. **Verificação do e-mail** — a pessoa informa `amanda.silva@nubank.com`, o sistema envia um link/token com expiração; ao clicar, o e-mail é marcado como verificado.

2. **Associação por domínio** — o domínio (`@nubank.com`) é casado com a organização correspondente (a Nubank já tem `corporate_email`/domínio verificado no nível da org). A pessoa vira membro **pendente** dessa organização.

3. **Função mínima + aprovação** — confirmar e-mail **não concede acesso sensível**. A pessoa entra com uma função padrão de menor privilégio (ex.: "Visualizador") e/ou em estado `pending`, e um admin aprova/ajusta a função. Sem isso, qualquer pessoa com e-mail da empresa ganharia acesso automático.

> A verificação responde **"essa pessoa é mesmo da empresa?"**; a aprovação responde **"o que ela pode fazer aqui?"**. Uma autentica, a outra autoriza.

---

## 4. Para quem é

### Usuários

| Persona | O que ganha |
|---|---|
| **Colaborador** | Entra na organização sem depender de convite manual — confirma o e-mail e está dentro (aguardando aprovação). |
| **Admin da Organização** | Para de convidar pessoa a pessoa; revisa uma fila de solicitações por domínio e aprova/atribui função. |
| **RH / Operações** | Visão de quantos colaboradores realmente adotaram a plataforma. |

### Stakeholders

| Stakeholder | O que enxerga |
|---|---|
| **Diretoria de produto** | Onboarding self-service → menos atrito de adoção em empresas grandes. |
| **Compliance / Segurança** | Autenticidade por domínio verificado + autorização explícita (função mínima + aprovação). |

---

## 5. Como funciona em 30 segundos

```
Colaborador informa e-mail corporativo (amanda.silva@nubank.com)
        │
        ▼
Sistema envia e-mail com link de confirmação (token + expiração)
        │
        ▼
Colaborador clica no link → e-mail verificado
        │
        ▼
Domínio @nubank.com → casa com a organização Nubank
   → vira membro PENDENTE, função padrão mínima
        │
        ▼
Admin vê a solicitação na aba Pessoas → aprova e ajusta função/grupo
        │
        ▼
Colaborador ativo; contadores de membros refletem a adoção real
```

---

## 6. Por que muda a experiência

| Antes (só convite) | Depois (+ confirmação por domínio) |
|---|---|
| Admin convida 1 a 1. | Colaboradores entram sozinhos por domínio. |
| Autenticidade = confiar no e-mail digitado. | Autenticidade = e-mail do domínio verificado por link. |
| "Quantos colaboradores?" = contar convites. | Contagem automática de confirmados/ativos. |
| Onboarding em massa é trabalhoso. | Onboarding self-service com aprovação. |

---

## 7. Diferenciais estratégicos

- **Complementar, não substituto.** Convite (push) e domínio (pull) coexistem; o admin escolhe o que faz sentido por empresa.
- **Autenticidade barata e forte.** O domínio do e-mail já é a prova de vínculo — sem upload de documento.
- **Autorização desacoplada da autenticação.** Verificar quem é a pessoa nunca dá acesso direto; a função/aprovação é um passo separado.

---

## 8. Como medir sucesso

| Métrica | O que indica |
|---|---|
| **Taxa de confirmação** (confirmados / e-mails informados) | Fricção do fluxo de verificação. |
| **% de onboarding por domínio vs. convite** | Adoção do caminho self-service. |
| **Tempo até aprovação** (confirmação → aprovação do admin) | Saúde da fila de solicitações. |
| **Colaboradores ativos por organização** | Adoção real da plataforma na empresa. |

---

## 9. Modelo de dados (resumo)

A base no nível da **organização já existe** ([organizations.sql](../../sql/organizations.sql)):

| Campo existente | Papel |
|---|---|
| `organizations.corporate_email` | E-mail/domínio declarado na criação. |
| `organizations.corporate_email_verified_at` | Verificação do e-mail no nível da org. |
| `organizations.is_official_representative_confirmed` | Confirmação do representante oficial. |

O que esta feature **acrescentaria** (no nível da pessoa/membro):

| Tabela / campo (proposto) | Papel |
|---|---|
| `users.email_verified_at` (ou equivalente) | Verificação do e-mail do indivíduo. |
| `organization_members.status` | Já existe (`active`/`pending`) — o pull entra como `pending`. |
| `organization_member_invitations` (já existe) | Pode ser estendida/espelhada para registrar solicitações por domínio (token, expiração, origem `domain` vs `invite`). |
| `organizations.allowed_email_domains` (proposto) | Domínios aceitos para auto-associação (ex.: `nubank.com`, `nubank.com.br`). |
| `organizations.auto_join_default_role_id` (proposto) | Função mínima atribuída na entrada por domínio. |

---

## 10. Onde apareceria no produto

| Superfície | O que faz |
|---|---|
| **Fluxo de entrada do colaborador** (fora do painel) | Informar e-mail corporativo → confirmar via link. |
| **Painel → aba Pessoas** | Fila de "solicitações por domínio" a aprovar; status `pending` → `active`. |
| **Painel → Página da Empresa / Configurações** | Configurar domínios aceitos e função padrão de auto-join. |

---

## 11. Dependências e pré-requisitos (por que não é o próximo passo)

1. **Autenticação real — bloqueante.** Hoje não há login/identidade (`CurrentUserService` é um TODO stub). Confirmar e-mail pressupõe identidade, sessão e um usuário ao qual o e-mail pertence.
2. **Serviço de envio de e-mail** — provedor transacional, templates, e-mail de remetente verificado.
3. **Infra de token** — geração, expiração, invalidação e endpoint de verificação.
4. **Guardrails de segurança** — função mínima + aprovação obrigatória; tratamento de terceirizados com e-mail corporativo, aliases e domínios de e-mail descartáveis; subdomínios e múltiplos domínios por empresa.

**Recomendação:** adiar até a autenticação existir. Enquanto isso, o fluxo de **convite + função + grupo** (já implementado) cobre a gestão de pessoas. Quando a auth chegar, implementar como **onboarding por domínio com aprovação**, reaproveitando `corporate_email_verified_at`.

### Plano em fases (quando priorizado)

| Fase | Entrega |
|---|---|
| 0 | Pré-requisito: autenticação + serviço de e-mail + infra de token. |
| 1 | Verificação de e-mail do indivíduo (enviar link, confirmar). |
| 2 | Configuração de domínios aceitos + função padrão na org. |
| 3 | Auto-associação por domínio → membro `pending`. |
| 4 | Fila de aprovação na aba Pessoas (aprovar/ajustar função/grupo). |
| 5 | Métricas de adoção (confirmação, aprovação, ativos). |

---

## 12. Onde aprofundar

- **Pessoas & Permissões** (gestão de membros, funções e grupos — já implementado): [doc.md](doc.md)
- **Painel Minha Empresa** (contexto do canal corporativo): [README.md](README.md)
- **Departamentos** (camada que escopa o painel): [departamentos.md](departamentos.md)
- **Tese da plataforma**: [../../README.md](../../README.md)
