# CollectionPageComponent — Página do Bundle

---

### 1. Propósito

A página de Collection (`CollectionPageComponent`) atua como o motor imersivo e a interface principal de reprodução da **Collection Bundle**. 

Ela resolve o desafio de agrupamento e serialização de conteúdo, garantindo que usuários possam assistir e acessar uma série de mídias (vídeos, recursos, etc) interligadas dentro de um canal, em uma interface contínua. 

A funcionalidade existe nesta página para materializar a camada de **Profundidade** dentro da plataforma RealWe: seccionando e executando conteúdos um a um e sincronizando os dados associados (descrições, comentários, visualizações) correspondentes ao arquivo de mídia atualmente em exibição.

---

### 2. Objetivo

**Objetivo principal da funcionalidade:**
Prover uma infraestrutura moderna tipo "Playlist" ou "Álbum" para exibir a sequência dos materiais listados nos `CollectionBundle`s sem navegação abrupta ou load de várias páginas.

**Benefícios para o usuário final:**
* Experiência ágil (_lean-back_) que não exige ação manual a cada finalização de vídeo.
* Facilidade para saber claramente onde havia parado e qual o seu progresso na trilha do canal de conteúdo selecionado.

**Impacto na experiência da plataforma (organização, descoberta, consumo):**
* **Navegação (Consumo):** Mantém as ações tradicionais engajadoras intactas (Botões "Like", "Saiba mais", "Salvar e Compartilhar") associadas individualmente para cada mídia no agrupamento, além de fornecer a imersão dentro do conteúdo do criador/empresa sem distrações do feed público.
* **Organização:** Consolida a jornada focada de On-boarding e Vagas criadas pelos canais sem precisar direcionar o usuário para fontes fora da plataforma.

---

### 3. Visão Geral da Funcionalidade

* **Como funciona a Collection Bundle (na view de página):** Todo arquivo depende da leitura do ID localizado na rota. Ela carrega uma chamada combinada (`forkJoin`) buscando os dados gerais do *"Bundle"* fornecidos pela API e os metadados dos `"Posts"` da plataforma para montar o reprodutor. Utilizando Angular de forma reativa com `Signals`, ele escuta métricas de avanço do player nativo e automaticamente transpõe a view para o próximo material sugerido/da sequência quando a contagem termina.
* **Onde ela aparece:** Na rota de profundidade dedicada na plataforma, o formato visualizado é a URL completa, mantendo base no ecossistema e reforçando a marca da empresa.
Exemplo: `/:channel/collection/:id` (como `/digix/collection/bundle-habix-001`).

---

### 4. Funcionalidades Implementadas

* **Carregamento Sincronizado (`forkJoin`):** Resgate de dados do Bundle requisitado junto à varredura das informações estendidas dos Posts globais para preencher comentários e métricas da collection.
* **Smart CurrentPost Resolver (`computed`):** Resolve os dados (Título, texto, criador, listagem de comentários) de acordo com o `Item` ativo da reprodução baseando-se por cruzamento da chave `postId` com o banco de posts ou fallback comparativo via link do `videoUrl`.
* **State Control do Player:**
  - Progressão visual independente calculada de 0% a 100% de reprodução baseando-se no `timeupdate` da tag de vídeo.
  - Sincronização automatizada da interface visual ativando estado `playing`, `done` com verificação estrita via `itemStates`.
* **Auto-Avanço Assistido:** Implementação fluída (`onVideoEnded`), onde ao atingir 100% de consumo na mídia, a tela avança automaticamente iterando sobre os Signals e injetando 800ms de animações suaves para a próxima visualização.
* **Progresso Global (`overallProgress`):** Barra superior de avanço (calculando média unânime percentual de toda a trilha executada pelo leitor na sub-sessão).
* **Formatadores Inteligentes de IU (`Pipes` locais):** Implementação e cálculos diretos para humanização de horas e números (`formatCount`, `timeAgo`, `commentTimeAgo` e de metadados como MM:SS).

---

### 5. Estrutura Técnica

* **Componentes base:** Módulo e lógica hospedados unicamente no `CollectionPageComponent` (`src/app/domain/collection/pages/collection/collection.component.ts`).
* **Estrutura e APIs:** Faz chamadas em repouso às APIs integradas `@shared/apis/collection-bundle.api` e `@shared/apis/post.api`.
* **Motor Angular de Reatividade (Signals):**
  * `bundle()`, `posts()` para storage massivo.
  * `isLoading()`, `isPlaying()`, `hasError()` e o indexador `currentIndex()` encarregado da posição virtual de consumo.
  * Validação reativa pura em métodos computados eficientes (`currentItem`, `currentPost`, `overallProgress`).
* **Injeção via ViewChild:** Manipulação imperativa mínima e direta da tag `<video #videoEl>` para acionar controles baseados no cache do buffer (ex: `play()` ou `pause()`). 

---

### 6. Mock de Dados

O componente nutre-se das massas controladas rodando no servidor base do repositório em `/api-server`.

* **Relacionamento Mock-to-Mock:** A página não funciona se o mapeamento falhar. Os nós de dados requeridos por `api-server/src/data/collection-bundles.js` em seus `items.postId`, **precisam** estampar IDs autênticos da matriz listada no `MOCK_POSTS` em `posts.js` para renderizarem na camada visual com perfeição em substituição dos esqueletos.
* **Cenários testáveis:** A infra providencia IDs isoladas de bundles já funcionais para que o sistema navegue corretamente, simulando canais do Digix e Habix (como `bundle-habix-001`).

---

### 7. Guia de Uso (para desenvolvedores)

* **Uso exclusivo para Routes:** Este é um componente de rota, não uma view instanciável genericamente (_selector_ `app-collection` raramente será chamado em modais fora do ecossistema de Router). Para usá-lo, dependa obrigatoriamente de ter o parâmetro `:id` da sub-rota ativo e declarado pelo app Router.
* **Modificações do Player:** Ao precisar alterar lógicas do carregamento/comportamento automático após rodar um vídeo, manipule o método `onVideoEnded()`. Nele existe o controle do Timeout em tela (atualmente 800ms).
* **Progresso de API / Backend:** A função interna `updateItemProgress()` é o local exato onde você implementará ou injetará chamadas a endpoints da API verdadeira do projeto contendo dados do estado de "Retomada"/Assitidos pelo respectivo ID de login (Session de um usuário assistindo cursos num canal de TI). Modifique aí caso queira salvar o last_viewed time em base assíncrona.
* **Componentes de Engajamento:** Para manipular o formulário de Comentários ou Likes no player, os modais visam ler primordialmente os dados do objeto resolvido pelo smart signal `currentPost()`.
