# Especificação: Collection Bundle

---

### 1. Propósito

A **Collection Bundle** é a unidade de curadoria e agrupamento de conteúdo (vídeos, imagens, áudios ou apps) dentro da plataforma RealWe. 

Ela resolve o problema de conteúdos soltos e descontextualizados, permitindo que criadores e empresas organizem mídias relacionadas — de um assunto central como um treinamento, um on-boarding, uma linha de produtos ou divulgação de processos seletivos — em **um formato único**. 

Essa funcionalidade existe na plataforma para centralizar o acervo de um canal e criar uma jornada contínua para o usuário, conectando diferentes partes de conteúdo e evitando que ele se disperse durante a navegação.

---

### 2. Objetivo

A Collection Bundle tem os seguintes direcionamentos principais:

* **Objetivo principal da funcionalidade:**
Fornecer uma estrutura capaz de organizar conteúdos de vários escopos mantidos pelo mesmo canal de maneira sequencial (uma "playlist de profundidade").

* **Benefícios para o usuário final:**
  - Consumo ininterrupto e simplificado de um tópico do seu interesse.
  - Elimina a necessidade de busca ativa a cada parte do conteúdo.
  - Facilita referências centralizadas garantindo evolução do consumo e percepção de progressão na plataforma.

* **Impacto na experiência da plataforma (organização, descoberta, consumo):**
  - **Organização:** Fortalece empresas com ferramentas de ensino, portfólio robusto ou trilhas bem encadeadas como canal de conteúdo.
  - **Descoberta:** Melhora a home page (feed principal), pois cartões "Bundle" destacam imediatamente o escopo com designs visualmente potentes agregando mais de 1 thumbnail e informações diretas da identidade do canal.
  - **Consumo:** Promove maior retenção e impulsiona acesso à fase de **Conversão** do RealWe (ex.: Botão de Call To Action de inscrição) após percorrer mais facilmente partes profundas do fluxo.

---

### 3. Visão Geral da Funcionalidade

A Collection Bundle atua de forma visualmente rica para agrupar e exibir conteúdo:

* **Como funciona a Collection Bundle:** Pense nela como um "Álbum" ou "Playlist temática". Ela consolida materiais relacionados dentro da identidade empresarial do canal, integrando players, listas de contéudo a ser seguido e controle de reprodução.
* **Onde ela aparece:** Na página inicial `/home`, feed e perfil do Canal em formato de card-resumo.
* **Relação com outros componentes:** Atua sendo a instância pai de múltiplos componentes `app-pin` (posts unitários). Ao clicar e explorar a Bundle, o usuário não apenas vê conteúdo solto, como aciona a página de coleção, usufruindo a interface estendida (pin-card) que integra os comentários, players customizados e os botões "Saiba Mais" mantendo as mesmas métricas dos componentes tradicionais agregados num novo layout com listagem da `coleção`.

---

### 4. Funcionalidades Implementadas

* **Exibição no feed (/home):** Ponto visual de acesso a curadoria dos conteúdos (exclusivo para Collections) em formato card dinâmico.
* **Componente `app-collection-bundle`:** Cartões compartilhados (`src/app/shared/components/collection-bundle/`). Interativos (mudam de scale/overlay num Focus ou Hover) mostrando um título, informações do autor e variações no thumbnail principal para exibir o volume de itens na lista.
* **Navegação para `/:username/collection/:id`:** Sistema paramétrico customizado indicando na rota a origem real (o canal) em união à visualização isolada de uma Bundle.
* **Página de collection (formato playlist/album):** Tela onde todo o conjunto fica aberto (`src/app/domain/collection/pages/collection/`). Possui barra de controles interativa, e player em tela cheia adaptada ao formato.
* **Player e consumo de mídia:** O `<video>` da coleção suporta avanço/retorno automáticos e pausas reativamente conectadas.
* **Progresso por item:** Metadados refletindo o engajamento unitário. Um item possui status (`ItemPlayState`).
* **Progresso geral (% da collection):** Representação superior global calculada ativamente com barra de avanço (0–100) consoante a todo acervo tocado e terminado da coleção atual.
* **Estados:**
  * **Não iniciado:** Item passivo sem interação. Status `idle`, exibido com o ícone circular vazio.
  * **Em andamento:** Mostra o botão the play sendo ativado (`playing`).
  * **Concluído:** Item 100% lido/assistido muda pra opacidade reduzida e altera interface visual ressaltada (`done` / ícone `check_circle` verde).
* **Continue assistindo:** Resgata a posição na playlist assim que a página é acessada/recarregada.
* **Próximo item sugerido:** Após a reprodução completa de uma mídia (timeupdate detectando os 100%), o próximo elemento carregará e ativará nativamente (suavizado com 800ms de intervalo).
* **Ações:**
  * **Favoritar** e gerenciar os likes que ficam conectados globalmente com a fonte via APIs.
  * **Compartilhar** do app/web ou utilizar atalhos para interagir com criador na tela principal de contexto da coleção.

---

### 5. Estrutura Técnica

* **Componentes criados:**
  - `app-collection-bundle` (shared card visual): Responsável unicamente pela visualização miniatura de ponto de entrada.
  - `app-collection`: Renderiza a visualização por inteiro com fluxos do Player, Controles e State de Listas.
* **Estrutura de pastas:** O ecossistema está desmembrado entre os shared (`src/app/shared/components/collection-bundle/`) e módulo page do domain (`src/app/domain/collection/pages/collection/`).
* **Interfaces (models):** Encontra-se `CollectionBundle` (model base), `CollectionItem` que tipifica dados de playlist (`video`, `image`, `audio` ou `app`), `ItemPlayState` e os seus DTOs de resposta de API nas devidas subpastas de `src/app/shared/interfaces/`.
* **Integração com mock API:** As views contam com forte reatividade Angular via *Signals*. Durante on-load, as chamadas com `forkJoin` batem na local API para extrair os detalhes do bundle de canais misturando com infos globais de cada *Post* enriquecidos para o player.

---

### 6. Mock de Dados

O Front End depende estruturalmente da API base de mocks simulada localmente nos repositórios.

* **Explicar o mock criado em:** `/home/azjob/workspace/app-pin/api-server`. 
* **Estrutura dos dados:**
  Os bundles ficam contidos em `api-server/src/data/collection-bundles.js` mapeados para rotas `/api/collections`. Estão baseados em um Array exportado, onde a chave `items` define um modelo de miniaturas. É **obrigatório** que a propriedade `postId` conecte e associe perfeitamente a um ID (`UUID`) do respectivo Post base na listagem autêntica de `MOCK_POSTS` do ambiente.
* **Exemplo resumido:**
  ```json
  {
    "id": "bundle-habix-001",
    "channel": "Digix",
    "username": "digix",
    "description": "Primeiros passos no Habix",
    "items": [
      {
        "type": "video",
        "postId": "c091c66a-0e28-4e7c-a1c9-1b4cef6da742",
        "title": "O que é o Habix?",
        "duration": 142
      }
    ]
  }
  ```

---

### 7. Guia de Uso (para desenvolvedores)

* **Como utilizar o componente `app-collection-bundle`:**
  Utilize `<app-collection-bundle [bundle]="myBundle" />` e passe para ele o objeto tipificado completo da bundle para que as thumbnails, nome da empresa e interatividade renderizem.
* **Como integrar no feed:**
  Aloque os cartões como iterações (usando `@for`) no layout de lists nas páginas principais (ex: `app-home`), fornecendo espaçamentos e lazy loading recomendados do styleguide.
* **Como consumir a página de collection:**
  Configure botões ou links para a rota padrão. Em HTML ficaria como um `<a routerLink="/canal-slug/collection/nome-do-id">`. O Angular se vira para abstrair visualizações de erro ou requisições se for repassado corretamente `/:channel/collection/:id`.
* **Como adicionar novos itens:**
  Quando manuseando Mock, vá em `collection-bundles.js` em `/api-server`, adicione dados no array principal do Bundle, sempre pegando a ID correspondente em **`posts.js (MOCK_POSTS)`**, informando propriedades de `type` e `duration` para não quebrar fluxos de playlist e skeleton na UI.

---

### 8. Estados Especiais

* **Playlist vazia:**
  Renders o card via componente compartilhamento através de um grande box cinza e o ícone `collections_bookmark`. Na visualização completa da rota, retorna estado "Esta coleção ainda não tem conteúdo".
* **Conteúdo indisponível:**
  Controladores ativam layout/página alternativa caso `hasError()` (ex: URL não existe/ID inválido) subindo uma comunicação limpa de *Coleção não encontrada*.
* **Loading (carregamento):**
  Uma barreira via state (`isLoading()`) faz substituição provisória do template durante requisições pendentes. Traz o `.pin-detail-skeleton` pro feed e placeholders no componente.

---

### 9. Próximos Passos (opcional, mas recomendado)

Estes são pontos complementares de evolução técnica e features que garantirão uma versão ainda mais robusta da Collection Bundle no futuro:

* **Persistência de progresso no backend:** Atualizar chamadas `timeupdate` do front repassando progresso a usuários remotos garantindo consumo global por conta de login via Requests PUT/PATCH.
* **Recomendações inteligentes:** Inserir algoritmos baseados nas tags para que a próxima bundle (ou auto-avanço de playlists) sejam sugeridas para manter retenção alta.
* **Comentários / engajamento:** Aumentar o scope de listagem do chat de posts permitindo reply em thread.
* **Ordenação manual (drag and drop):** Introduzir funcionalidade interativa via painel (ex: Portal corporativo de publicação) para reorganização ágil no índice de Collections.
