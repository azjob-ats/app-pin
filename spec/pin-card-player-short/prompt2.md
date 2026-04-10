🎯 Objetivo

Substituir o uso do componente MediaCard pelo componente Pin-Card-Player-Short na Home, mantendo o mesmo layout, porém agora com suporte a reprodução de vídeo.

---

📄 Contexto

Existe um componente já implementado em:
/home/azjob/workspace/app-pin/src/app/shared/components/pin-card-player-short/pin-card-player-short.component.ts

Componente:
 Pin-Card-Player-Short

Esse componente:
- Possui o mesmo layout visual do MediaCard
- Porém inclui funcionalidade de reprodução de vídeo

Documentação oficial:
 /home/azjob/workspace/app-pin/spec/pin-card-player-short/PinCardPlayerShort_Specification.md

---

📦 Fonte de dados

Os dados atualmente estão em:
 /home/azjob/workspace/app-pin/task/data.ts

Esses dados devem:
1. Ser transformados em mock de API
2. Ser servidos via api-server
3. Estar disponíveis no endpoint:

  GET /post

---

🧩 Tarefas

### 1. Refatoração de dados
- Extrair os dados de `data.ts`
- Criar um mock no `api-server`
- Expor endpoint REST:
  - `/post`
- Garantir que os dados estejam no formato compatível com o componente

---

### 2. Integração com API
- Substituir uso de dados estáticos por chamada HTTP
- Criar service (ex: PostService)
- Consumir `/post`
- Tratar loading e possíveis erros

---

### 3. Substituição de componente

- Localizar onde o `MediaCard` está sendo utilizado
- Substituir por:
  Pin-Card-Player-Short

- Garantir que:
  - Layout permaneça consistente
  - Inputs necessários sejam corretamente passados
  - Funcionalidade de vídeo esteja ativa

---

### 4. Adaptação de dados

- Ajustar estrutura para suportar vídeo:
  - media.contentType = 'video'
  - propriedades necessárias (url, thumbnail, etc.)

- Garantir compatibilidade com:
  Pin-Card-Player-Short_Specification.md

---

### 5. Componentização e boas práticas

- Manter separação de responsabilidades
- Não acoplar lógica de API diretamente no componente
- Utilizar:
  - services
  - interfaces/models

---

### 6. Validação

- Verificar se todos os MediaCards foram substituídos
- Validar:
  - renderização
  - reprodução de vídeo
  - responsividade
  - performance básica

---

⚠️ Regras importantes

- Não quebrar layout existente
- Não remover funcionalidades atuais
- Manter padrão de código do projeto
- Seguir documentação oficial do componente

---

🚀 Resultado esperado

- MediaCard substituído por Pin-Card-Player-Short
- Dados servidos via API (/post)
- Estrutura mais escalável e desacoplada
- Home preparada para conteúdo em vídeo

---