# Collection Bundle — Especificação

---

## Propósito

A **Collection Bundle** é a funcionalidade de curadoria de conteúdo da plataforma RealWe.

Ela existe para resolver um problema central da plataforma: o conteúdo publicado por empresas e criadores precisa de organização temática. Sem ela, vídeos e mídias ficam soltos no feed, sem contexto, sem continuidade e sem direção para o usuário.

A Collection Bundle agrupa conteúdos relacionados em uma experiência coesa de consumo — similar a uma playlist ou álbum — permitindo que o usuário avance de forma fluida pelo material de um canal.

---

## Objetivo

Criar uma experiência de consumo contínuo e organizado, onde o usuário:

1. **Descobre** o conteúdo de uma empresa ou criador
2. **Aprofunda** o conhecimento consumindo a coleção na íntegra
3. **Converte** ao clicar em "Saiba Mais" e avançar para uma vaga, compra ou inscrição
4. **Engaja** curtindo, comentando e seguindo o canal

A Collection Bundle é o principal mecanismo de **profundidade de conteúdo** da plataforma — é onde o usuário passa de "descoberta" para "decisão".

---

## Contexto de negócio

A RealWe posiciona empresas como canais de autoridade. Colaboradores publicam conteúdo real sobre o dia a dia: ferramentas, processos, vagas, produtos e cultura.

A Collection Bundle serve a múltiplos casos de uso:

| Caso de uso | Exemplo |
|-------------|---------|
| Treinamento de produto | "Primeiros passos no Habix" |
| Recrutamento | "Vagas abertas — Backend e Python" |
| Cultura organizacional | "Como é trabalhar na Digix" |
| Portfólio de serviços | "Nossos cases de sucesso" |

---

## Guia para o usuário

### O que é uma Collection?

É um conjunto de vídeos e mídias organizados por tema dentro do canal de uma empresa.

Pense como uma **playlist temática**: em vez de conteúdos soltos, você encontra tudo sobre um assunto reunido e em sequência — como uma série, um curso ou um álbum.

---

### Como encontrar uma Collection

Coleções aparecem no feed ou na página de um canal. O card mostra:

- Uma prévia visual com até 3 thumbnails em grid
- O nome do canal responsável
- O tema da coleção

Clique no card para abrir a experiência completa.

---

### Dentro de uma Collection

A página é dividida em duas áreas:

**Área principal (esquerda)**
- O vídeo ou imagem do item atual em destaque
- Controles de navegação: anterior, play/pause, próximo
- Informações do conteúdo: visualizações, título, descrição, hashtags
- Canal com botão "Inscrever-se"
- Seção de comentários

**Barra lateral (direita)**
- Nome da coleção, canal e total de vídeos
- Botões de ação: Salvar, Compartilhar, Saiba Mais
- Barra de progresso geral da coleção
- Lista completa de conteúdos com thumbnail, título, duração e status

---

### Navegação e progresso

- Clique em qualquer item da lista para ir direto a ele
- Use os botões anterior/próximo para navegar em sequência
- Ao terminar um vídeo, o próximo inicia automaticamente após 0,8 segundos
- O progresso de cada item é salvo individualmente
- A barra de progresso geral mostra o percentual total da coleção consumido

---

### Status dos itens

| Ícone | Significado |
|-------|-------------|
| ○ Círculo vazio | Não iniciado |
| ▶ Círculo play | Em reprodução |
| ✓ Check verde | Concluído |

---

### Ações disponíveis

| Ação | Descrição |
|------|-----------|
| **Salvar** | Guarda a coleção para assistir depois |
| **Compartilhar** | Compartilha o link da coleção |
| **Saiba Mais** | Avança para inscrição, compra ou contato com a empresa |
| **Inscrever-se** | Segue o canal para receber novos conteúdos |

---

### Estados especiais

| Situação | O que aparece |
|----------|---------------|
| Carregando | Skeleton animado |
| Coleção não encontrada | Mensagem de erro com sugestão |
| Coleção sem conteúdo | Mensagem informando que em breve haverá vídeos |
