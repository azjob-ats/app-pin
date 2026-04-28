
Quero implementar uma nova feature chamada "winning-slots" no meu projeto.

Contexto atual:
- Tenho uma API mock em:
  /home/azjob/workspace/app-pin/api-server/src/data/posts.js
- Essa API alimenta uma grid na home com cards em proporções 9:16 e 16:9.
- O layout da grid é dinâmico, porém existe um problema:
  quando um card não consegue encaixar na linha, sobra um espaço vazio (um "buraco") no grid.

Problema:
- Esses espaços vazios quebram a experiência visual.
- Hoje não existe tratamento para esses gaps.

Objetivo:
- Criar uma solução elegante para preencher esses espaços com conteúdo alternativo.
- Essa solução será uma nova feature chamada "winning-slots".

Requisitos da solução:
1. Criar uma nova API mock em:
   /home/azjob/workspace/app-pin/api-server/src/data/winning-slots.js

2. Seguir o mesmo padrão estrutural e convenções usadas em posts.js

3. Cada item de "winning-slots" deve ter uma estrutura como:
   {
     id: string,
     media: {
       contentType: 'movie' | 'image' | 'html' | 'component',
       aspectRatio: '9:16' | '16:9',
       ...outros campos
     },
    ...outros campos
   }

4. A feature deve ser pensada como:
   - Pode representar anúncios, conteúdos informativos ou recomendações
   - Deve ser flexível para diferentes tipos de mídia (vídeo, imagem, HTML ou componente Angular)

5. Importante:
   NÃO quero uma abordagem de:
   - Fazer uma requisição extra depois que o layout quebra

   Quero uma abordagem melhor:
   - O feed já deve ser montado considerando possíveis gaps
   - A lógica deve prever encaixe inteligente dos itens (posts + winning-slots)

6. Crie também:
   - Um serviço/função responsável por combinar posts + winning-slots
   - Essa função deve:
     - Receber a lista de posts
     - Detectar gaps de layout (9:16 ou 16:9)
     - Inserir dinamicamente um winning-slot compatível

7. Se necessário:
   - Sugira melhorias na estrutura da grid para suportar esse comportamento
   - Evite soluções acopladas ou difíceis de escalar

Saída esperada:
- Código completo de winning-slots.js
- Função de composição do feed (posts + winning-slots)
- Explicação da lógica de encaixe
- Sugestões de melhoria de arquitetura (se houver)

Priorize:
- Legibilidade
- Escalabilidade
- Baixo acoplamento
- Facilidade de evolução futura (ads, recomendações, etc)




--------------------------------------------------
Quero evoluir a feature "winning-slots" adicionando regras determinísticas de preenchimento de gaps na grid.

Contexto:
- Já existe um fluxo que combina posts + winning-slots
- Os cards possuem dois formatos:
  - '16:9' (horizontal)
  - '9:16' (vertical)
- A grid é organizada em linhas (rows), com encaixe dinâmico

Objetivo:
- Aplicar regras claras para preenchimento de espaços vazios (gaps)
- Garantir consistência visual da grid

IMPORTANTE:
- A lógica deve ser aplicada DURANTE a composição do feed
- NÃO deve ser feita via requisições adicionais após renderização

---

Regras de preenchimento:

Considere sempre a composição da LINHA ATUAL antes de quebrar para a próxima.

H = quantidade de 16:9
V = quantidade de 9:16

1. Se (H = 1, V = 0)
→ adicionar 1x 16:9

2. Se (H = 0, V = 1)
→ adicionar 2x 9:16

3. Se (H = 1, V = 1)
→ adicionar 2x 9:16

4. Se (H = 1, V = 2)
→ adicionar 1x 9:16

5. Se (H = 0, V = 2)
→ adicionar 1x 16:9

6. Se (H = 0, V = 3)
→ adicionar 1x 16:9

7. Se (H = 0, V = 4)
→ adicionar 2x 9:16

Objetivo: completar a linha visualmente

- V ocupa metade de H (ou regra equivalente de grid)
- Detectar espaço restante
- Preencher com o tipo que "fecha" a linha

---

Regras globais:

5. Se existir APENAS UMA linha no grid:
   → NÃO aplicar preenchimento de gaps

6. Se existirem MÚLTIPLAS linhas:
   → NÃO preencher gaps da ÚLTIMA linha

7. O preenchimento deve respeitar:
   - O aspectRatio necessário (9:16 ou 16:9)
   - Inserção na ordem correta da linha
   - Não quebrar a sequência visual

---

Requisitos técnicos:

- Criar uma função, por exemplo:
  composeFeedWithWinningSlots(posts, winningSlots)

- Essa função deve:
  1. Montar o grid linha a linha
  2. Detectar padrões incompletos em cada linha
  3. Aplicar as regras acima
  4. Inserir winning-slots compatíveis

- Separar responsabilidades:
  - Função para detectar padrão da linha
  - Função para decidir preenchimento
  - Função para inserir itens

- Winning-slots devem ser consumidos de forma sequencial ou pseudo-randômica

---

Saída esperada:

- Implementação completa da função de composição
- Código limpo e modular
- Comentários explicando cada regra aplicada
- Exemplo de entrada (posts)
- Exemplo de saída (feed final com winning-slots)

---

Critérios de qualidade:

- Código legível e escalável
- Fácil de adicionar novas regras no futuro
- Baixo acoplamento
- Nenhuma lógica duplicada


´
Arquitetura — separação de responsabilidades
src/app/shared/services/feed-composer.service.ts

Função	Responsabilidade
composeFeedWithWinningSlots()	orquestrador público — recebe posts + slots, devolve feed final
packRows()	distribui posts em linhas conforme capacidade da grid
detectRowPattern()	conta { h, v } da linha
decideRowFill()	consulta a tabela FILL_RULES (lookup puro)
assembleFeed()	aplica regras globais (linha única / última linha) e insere slots
SlotCursor	round-robin de slots por aspectRatio (consumo sequencial)
areFillRulesApplicable()	guard — só ativa o fill quando o grid é 6 col (H=3, V=1)
A tabela FILL_RULES é a única fonte da verdade — adicionar uma nova regra é adicionar uma linha no array, sem alterar lógica.

Fluxo do algoritmo
Pack: posts são agrupados em linhas greedy respeitando capacity da grid.
Per-row decision: para cada linha intermediária, conta (H, V) e busca o fill na tabela.
Insert: slots são consumidos em round-robin do pool por aspectRatio e inseridos no fim da linha.
Global guards:
se rows.length === 1 → emite tudo sem fill;
se a linha é a última de múltiplas → emite sem fill;
se a grid não é 6-col (mobile) → fill desabilitado, posts emitidos como vieram.
Exemplos
Entrada A — Multi-linha com gap (ex. 5 posts)

posts = [V, H, V, V, H]    // V = 9:16, H = 16:9 (3 cols)
Pack (capacity 6):

V(1) + H(3) + V(1) = 5 → próximo H(3) overflow → fecha linha 1: [V, H, V] (h=1, v=2)
linha 2: [H] (última)
Linha 1 pattern (h=1, v=2) → Regra 4 → adicionar 1×9:16.
Linha 2 é a última → não preenche.


saída = [V, H, V, V_slot, H]
       └────row 1 (1H+3V)────┘└row 2─┘
Entrada B — Linha única

posts = [V, H]    // (h=1, v=1) — single row → não preenche
saída = [V, H]
Entrada C — 8 posts, 2 linhas

posts = [V, V, V, H, V, H, V, V]
Pack:

V V V H = 6 → linha 1 cheia naturalmente [V, V, V, H] (h=1, v=3, completa)
V H V V = 6 → linha 2 cheia [V, H, V, V] (h=1, v=3, completa)
Ambas estão completas → nenhum fill aplicado, saída idêntica à entrada.

Entrada D — 7 posts, gera (h=1, v=1) intermediária

posts = [V, H, H, V, V, V, H]
Pack:

V(1) + H(3) = 4 → próximo H(3) overflow → fecha linha 1: [V, H] (h=1, v=1)
H(3) + V(1) + V(1) + V(1) = 6 → fecha linha 2: [H, V, V, V] (h=1, v=3) — completa
linha 3: [H] (última)
Linha 1 pattern (h=1, v=1) → Regra 3 → adicionar 2×9:16.
Linha 2 completa → sem fill.
Linha 3 é a última → sem fill.


saída = [V, H, V_slot, V_slot, H, V, V, V, H]
       └────row 1 (1H+3V)────┘└──row 2────┘└row 3┘
Como evoluir
Nova regra: adicione um item em FILL_RULES. Ex.: (H=2, V=0) → algum fill.
Outro grid (4 cols, 8 cols): extraia FILL_RULES para um parâmetro de ComposeFeedOptions e passe rule sets distintos por breakpoint.
Estratégia de pick diferente (random, weighted, A/B): troque o SlotCursor por uma implementação alternativa que respeite a interface takeByAspect.
Métricas: assembleFeed é o ponto natural para emitir telemetria de impressão de slot — basta um callback opcional no ComposeFeedOptions.
´