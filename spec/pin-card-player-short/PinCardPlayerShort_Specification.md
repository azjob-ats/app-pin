# PinCardPlayerShort — Documentação e Especificação

O componente `PinCardPlayerShort` é uma evolução do `PinCard` tradicional, substituindo a exibição estática de imagens por uma experiência de vídeo interativa e performática. Ele segue a identidade visual da RealWe e foi projetado para ser altamente reutilizável e eficiente.

---

## 📖 Guia do Usuário

Esta seção descreve como os usuários finais interagem com o componente na plataforma.

### 1. Carregamento Inteligente (Lazy Load)
Para otimizar a performance da página, o vídeo não é carregado inicialmente.
- **Estado Inicial**: O usuário vê apenas a **thumbnail** (capa) do vídeo com um overlay sutil.
- **Ativação**: Ao clicar na thumbnail, o elemento de vídeo é inserido no DOM e a reprodução inicia automaticamente.

### 2. Controles de Reprodução
Uma vez carregado, o componente oferece controles intuitivos que se ocultam automaticamente para não obstruir o conteúdo:
- **Play/Pause**: Clique em qualquer lugar no vídeo para alternar entre reprodução e pausa. Um ícone central indica o estado quando pausado.
- **Volume**: No canto superior esquerdo, um botão permite alternar entre mudo e o volume padrão.
- **Navegação**: No canto superior direito, um link direciona o usuário para a página de detalhes do Pin (`/pin/{id}`).

### 3. Barra de Progresso e Tempo
- **Exibição**: O tempo atual e a duração total são exibidos no canto inferior esquerdo.
- **Scrubbing (Busca)**: O usuário pode clicar ou arrastar a barra de progresso para saltar para qualquer ponto do vídeo.
- **Tooltip**: Ao passar o mouse sobre a barra de progresso, um balão flutuante mostra o tempo exato daquela posição.

### 4. Experiência Mobile
- **Toque para Revelar**: Em dispositivos touch, o primeiro toque revela os controles sem pausar o vídeo.
- **Interação**: Toques subsequentes permitem interagir com os botões ou pausar a mídia.

---

## 🛠️ Guia do Desenvolvedor

Esta seção é destinada a desenvolvedores que desejam utilizar ou manter o componente.

### 1. Instalação e Importação
O componente é **Standalone** e deve ser importado nos módulos ou componentes onde será utilizado:

```typescript
import { PinCardPlayerShortComponent } from '@shared/components/pin-card-player-short/pin-card-player-short.component';
```

### 2. Interface de Dados (`Post`)
O componente aceita um input obrigatório `post` do tipo `Post`.

#### Estrutura do Objeto `media`:
```typescript
{
  aspectRatio: string; // Ex: '9:16', '16:9', '4:3'
  long: string;        // URL do vídeo principal
  thumbnail: string;   // URL da imagem de capa
  title: string;       // Título do post
  // ...outros campos de metadados
}
```

### 3. Implementação Técnica
- **State Management**: Utiliza **Angular Signals** (`signal`, `computed`, `input`) para um gerenciamento de estado reativo e eficiente.
- **Change Detection**: Configurado como `ChangeDetectionStrategy.OnPush` para máxima performance.
- **Progress Tracking**: Utiliza `requestAnimationFrame` em vez de eventos frequentes de `timeupdate` do HTML5, garantindo que a barra de progresso se mova de forma fluida a 60fps.
- **Auto-hide**: Os controles desaparecem após 5 segundos de inatividade durante a reprodução.

### 4. Estilização
O componente utiliza CSS Variables e utilitários globais:
- **Aspect Ratio**: Respeita dinamicamente a propriedade `media.aspectRatio` vinda do banco de dados.
- **Design System**: Segue o `utility.scss` para espaçamentos e tipografia, mantendo consistência com o resto da aplicação.

---
