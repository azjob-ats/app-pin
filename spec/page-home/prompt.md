🎯 Objetivo

Refatorar a página Home do projeto para alinhar os nomes de componentes, estruturas e responsabilidades com a documentação oficial.

📄 Fonte de verdade

Utilizar como base a documentação:
 /home/azjob/workspace/app-pin/spec/page-home/page-home.md

A documentação define claramente os conceitos de negócio que devem ser refletidos no código.

---

🧩 Tarefa

1. Analisar a implementação atual da Home
2. Mapear os elementos existentes com os conceitos da documentação
3. Refatorar nomes e estrutura para utilizar os seguintes termos oficiais:

- Trending Topic
- Daily Story
- Dynamic Interest Tabs
- Media Card

---

🏗️ Regras de implementação

- Substituir nomes genéricos por nomes semânticos baseados na documentação
- Evitar nomes como:
  - card
  - item
  - box
  - list

- Utilizar nomes técnicos consistentes, como:

  TrendingTopicComponent  
  DailyStoryComponent  
  DynamicInterestTabsComponent  
  MediaCardComponent  

---

🧱 Componentização

Se necessário, criar novos componentes para refletir corretamente a separação de responsabilidades:

Sugestão de estrutura:

- home/
  - components/
    - trending-topic/
    - daily-story/
    - dynamic-interest-tabs/
    - media-card/

Cada componente deve:
- Ter responsabilidade única
- Ser reutilizável
- Seguir boas práticas de Angular (ou framework utilizado)

---

🔗 Integração

- Garantir que os novos componentes estejam corretamente integrados na Home
- Preservar funcionamento atual (não quebrar comportamento)
- Ajustar bindings, inputs e outputs conforme necessário
- IMPORTANTISSIMO NÃO QUEBRAR O VISUAL QUE JA EXISTE

---

🎨 UI / Layout

- Manter o layout atual
- Apenas melhorar organização e semântica
- Respeitar a estrutura visual definida na documentação

---

🧠 Resultado esperado

- Código mais semântico e alinhado ao negócio
- Melhor organização e escalabilidade
- Componentes reutilizáveis e bem definidos
- Padronização de nomenclatura em todo o projeto

---

⚠️ Importante

- Não alterar regras de negócio
- Não remover funcionalidades existentes
- Focar em nomenclatura, organização e arquitetura

---

🚀 Extra (se possível)

- Criar interfaces/modelos para cada conceito:
  - TrendingTopic
  - DailyStory
  - MediaContent

- Sugerir melhorias na arquitetura da Home
