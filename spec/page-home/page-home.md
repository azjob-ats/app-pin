# 🏠 Página Home — RealWe

## 🎯 Objetivo

A página Home da RealWe tem como objetivo apresentar conteúdos relevantes, tendências e facilitar a navegação do usuário pela plataforma, oferecendo acesso rápido às principais funcionalidades.

---

## 🧭 Estrutura Geral

A página é composta por três grandes áreas:

* **Sidebar (lateral esquerda)**
* **Topbar (barra superior)**
* **Conteúdo principal (feed dinâmico)**

---

## 📌 Sidebar (Desktop)

Menu lateral fixo responsável pela navegação principal:

* **Logo**

  * Redireciona para a **Home**

* **Ícone de Casa**

  * Redireciona para a **Home**

* **Ícone de Estrela**

  * Redireciona para a página de **Experiência**

* **Ícone “+” (Mais)**

  * Redireciona para a tela de **Criar Pin**

* **Ícone de Sino**

  * Redireciona para a tela de **Notificações**

* **Ícone de Três Pontos**

  * Abre um **Drawer/Menu lateral** com opções adicionais

---

## 🔝 Topbar (Desktop)

Barra superior com ações globais da aplicação:

### 🔍 Campo de Busca

* Ao digitar um termo, o usuário é redirecionado para:

  ```
  /search?q={TERMO_BUSCADO}
  ```

  Exemplo:

  ```
  /search?q=JAVA
  ```

* Na tela de busca (`search`):

  * São exibidos filtros por categoria:

    * Produto
    * Conteúdo
    * Vagas
    * Pessoas
    * Empresa
    * Treinamentos
    * Notícias
  * Exibe resultados relacionados ao termo pesquisado

---

### 🌙 Alternância de Tema

* Alterna entre:

  * Modo claro
  * Modo escuro

---

### 🌎 Idioma

* Permite alterar o idioma da plataforma

---

### 🔐 Autenticação

* **Botão Entrar**

  * Redireciona para login

* **Botão Cadastrar**

  * Redireciona para criação de conta

---

## 🧩 Conteúdo Principal

A Home é dividida em três seções principais:

---

### 1. 🔥 Trending Topics

**Definição:**
Tópicos mais buscados ou com crescimento repentino de interesse em um curto período.
Quando um termo é pesquisado massivamente por todos (ou pela grande maioria) dos usuários de uma plataforma em um determinado período,plataforma. Refere-se a palavras ou hashtags que tiveram um pico súbito de volume de busca em um curto intervalo de tempo.
 

**Características:**

* Baseado em volume de buscas dos usuários
* Atualização dinâmica
* Representa tendências do momento

**Exemplos:**

* Como perder peso rápido
* Empregos ameaçados pela IA
* Ideia de negócio online

---

### 2. 📸 Daily Story

**Definição:**
Conteúdos (imagem ou vídeo) publicados que ficam disponíveis por **24 horas**.
Define um conjunto de conteúdos (fotos ou vídeos) que ficam disponíveis por exatamente 24 horas e depois expiram. Refere-se a um compilado de tudo o que uma conta publicou naquele dia específico.
 

**Características:**

* Expiram automaticamente após 24h
* Representam o conteúdo diário de um usuário ou canal
* Formato semelhante a “stories”

---

### 3. 🧠 Dynamic Interest Tabs

**Definição:**
Abas dinâmicas baseadas em interesses e tendências do momento.
os nomes das abas mudam conforme as tendências (trending topics) do dia, e "Interesse" porque elas segmentam o conteúdo por nichos como Fitness ou Empreendedorismo.. Refere-se à capacidade do sistema de pegar um volume massivo de dados e "filtrar" em colunas ou abas específicas baseadas em tags ou processamento de linguagem natural (NLP).
 
**Características:**

* Os nomes das abas mudam conforme:

  * Trending Topics
  * Comportamento dos usuários
  * Processamento de linguagem natural (NLP)

* Segmentação por nicho:

  * Fitness
  * Tecnologia
  * Empreendedorismo
  * Educação
  * etc.

---

### 3.2 📦 Formato dos Conteúdos(MediaCard)

Os conteúdos dentro das abas seguem um padrão visual:

* **Imagem de capa**

  * Pode ser:

    * Quadrada
    * Retangular
  * Bordas arredondadas: `10px`

* **Título**

  * Exibido abaixo da imagem

* **Canal**

  * Ícone do canal
  * Nome do canal

---

## 🧠 Observações Técnicas

* Conteúdo altamente dinâmico e orientado a dados
* Uso de algoritmos para:

  * Trending detection
  * Segmentação por interesse
  * Relevância de conteúdo
* Estrutura preparada para escalabilidade e personalização

---

## 🚀 Possíveis Evoluções

* Personalização por usuário (feed inteligente)
* Recomendação baseada em comportamento
* Integração com IA para curadoria de conteúdo
* Ranking de relevância por engajamento
