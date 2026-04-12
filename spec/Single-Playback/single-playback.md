# Single Playback — Reprodução Única

> Funcionalidade que garante que apenas um vídeo seja reproduzido por vez no feed da plataforma RealWe.

---

## 1. Visão Geral

**Single Playback** é o comportamento responsável por controlar a reprodução de vídeos no feed da Home.

Quando o usuário clica em um vídeo para assisti-lo, qualquer outro vídeo que esteja tocando ao mesmo tempo é **automaticamente pausado**. O resultado é uma experiência limpa, focada e sem ruído — apenas um vídeo ocupa a atenção do usuário por vez.

Essa funcionalidade está presente no feed principal da plataforma, onde os vídeos curtos de descoberta são exibidos em grade. É a camada que governa o comportamento de todos os cards de vídeo (`PinCardPlayerShort`) ao mesmo tempo.

---

## 2. Propósito

### O problema que resolve

Sem esse controle, cada card de vídeo age de forma independente. O usuário pode clicar em vários vídeos em sequência e todos continuarão reproduzindo ao mesmo tempo, gerando:

- Áudios sobrepostos e confusos
- Dificuldade para acompanhar o conteúdo
- Sensação de desordem na navegação

### A necessidade que atende

O usuário que navega pelo feed da RealWe está em modo de **descoberta**: ele percorre conteúdos rapidamente, avalia o que chama atenção e decide se quer se aprofundar. Esse processo exige clareza e foco. A reprodução simultânea de vídeos quebra esse fluxo e prejudica a percepção de qualidade da plataforma.

---

## 3. Objetivo

### Para o usuário

- Consumir vídeos de forma clara e sem interferência sonora
- Trocar de vídeo com fluidez, sem precisar pausar manualmente o anterior
- Ter uma experiência próxima à de plataformas consolidadas como TikTok e Instagram Reels

### Para o produto e negócio

- Reduzir fricção na navegação, aumentando o tempo de permanência no feed
- Reforçar a percepção de qualidade e profissionalismo da plataforma
- Criar um ambiente propício para o início do funil de conversão — onde o vídeo curto precisa gerar interesse real no conteúdo longo

---

## 4. Como o Usuário Utiliza

1. O usuário acessa a **Home** da plataforma
2. O feed exibe uma grade de vídeos curtos (shorts) de diferentes canais
3. Ao clicar no thumbnail de um vídeo, ele começa a carregar e reproduzir automaticamente
4. Se o usuário clicar em outro vídeo enquanto o primeiro está tocando:
   - O vídeo anterior para imediatamente
   - O novo vídeo inicia a reprodução
5. O usuário pode pausar o vídeo atual clicando na área de controle
6. Ao terminar o vídeo, o player retorna ao estado de repouso e libera o controle para outros

Nenhuma ação manual de pausa é necessária — a transição entre vídeos é automática.

---

## 5. Principais Funcionalidades

### Ações disponíveis

| Ação | Descrição |
|---|---|
| Iniciar reprodução | Clicar no thumbnail do vídeo inicia o carregamento e play automático |
| Pausar | Clicar na área central do player pausa o vídeo atual |
| Retomar | Clicar novamente retoma de onde parou |
| Silenciar/Ativar som | Botão de volume no canto superior do player |
| Navegar para o conteúdo completo | Seta de navegação abre a página Watch (vídeo longo) |
| Controle de progresso | Barra de progresso clicável com preview de tempo |

### Comportamentos

- **Reprodução exclusiva:** ao iniciar qualquer vídeo, todos os outros são pausados automaticamente
- **Autoplay ao carregar:** assim que o vídeo estiver pronto para reprodução, ele inicia sem interação adicional
- **Controles com auto-hide:** os controles somem após 5 segundos de inatividade durante a reprodução
- **Retomada de posição no scrub:** ao arrastar a barra de progresso, o vídeo retoma a partir da posição escolhida

### Estados do player

| Estado | Descrição |
|---|---|
| Não iniciado | Exibe o thumbnail com botão de play central |
| Carregando | Vídeo sendo carregado após clique no thumbnail |
| Reproduzindo | Vídeo em exibição, controles visíveis inicialmente |
| Pausado | Vídeo parado, controles visíveis, aguardando ação |
| Concluído | Reprodução finalizada, player retorna ao estado de repouso |

---

## 6. Experiência do Usuário

O Single Playback transforma o feed de descoberta em um ambiente **focado e intencional**.

Na RealWe, o vídeo curto é o ponto de entrada do funil: ele desperta curiosidade e convida o usuário para um conteúdo mais profundo. Para que isso funcione, a experiência de navegação precisa ser limpa. Áudios sobrepostos ou vídeos concorrendo pela atenção interrompem esse fluxo.

Com essa funcionalidade:

- O usuário percorre o feed com leveza, sem acumular "ruído" de vídeos esquecidos
- A transição entre conteúdos é fluida — clicar já é suficiente para trocar de vídeo
- A atenção é naturalmente direcionada para o conteúdo que está sendo assistido

Isso melhora diretamente a **taxa de retenção no feed** e a probabilidade de o usuário dar o próximo passo: assistir ao vídeo completo.

---

## 7. Valor para o Negócio

### Contribuição para o crescimento

O feed de vídeos curtos é a **vitrine da plataforma**. É ali que um candidato descobre uma empresa, que um comprador encontra um produto, que um profissional conhece um treinamento. A qualidade dessa experiência determina se o usuário avança no funil ou abandona a plataforma.

Uma reprodução caótica prejudica a percepção do conteúdo e da plataforma. O Single Playback protege a qualidade do feed.

### Diferencial competitivo

Plataformas de referência como TikTok, Instagram Reels e YouTube Shorts já operam com reprodução exclusiva. Os usuários chegam à RealWe com essa expectativa consolidada. Oferecer comportamento diferente gera estranhamento e perda de confiança.

### Possibilidades futuras

- **Autoplay por viewport:** reproduzir automaticamente o vídeo que entrar na área visível do navegador (comportamento padrão em feeds verticais)
- **Métricas de atenção por vídeo:** com controle centralizado, torna-se possível rastrear com precisão qual vídeo foi assistido, por quanto tempo e quando foi trocado
- **Integração com campanhas patrocinadas:** priorizar a reprodução de conteúdos impulsionados com base em visibilidade real, não apenas impressão

---

## 8. Exemplos de Uso

### Candidato explorando vagas

João acessa o feed e vê cards de diferentes empresas. Clica em um vídeo de uma startup de tecnologia, assiste por alguns segundos, se interessa, clica em outro da mesma área para comparar. O vídeo anterior para automaticamente. João navega por cinco empresas diferentes em menos de dois minutos, sem confusão de áudio.

### Profissional buscando treinamento

Maria está avaliando cursos na plataforma. Clica em um vídeo de introdução de um treinamento, gosta do conteúdo, pausa e navega para outro. O Single Playback garante que ela só ouça um conteúdo por vez, tornando a avaliação mais precisa.

### Visitante em primeira visita

Lucas entra na RealWe sem objetivo definido. Começa a clicar em vídeos por curiosidade. A experiência fluida e sem ruído o mantém engajado por mais tempo, aumentando a chance de ele encontrar algo que realmente o interesse e dar o próximo passo.

---

## 9. Considerações Técnicas

### Onde está implementado

A funcionalidade vive inteiramente na camada `shared` da aplicação, sem acoplamento com domínios específicos. Isso significa que pode ser reutilizada em qualquer feed ou contexto da plataforma que use o componente de player.

### Componentes principais

| Arquivo | Responsabilidade |
|---|---|
| `src/app/shared/services/video-single-playback.service.ts` | Serviço singleton que mantém o ID do vídeo ativo via `signal`. Expõe `setActive(id)` e `clearActive(id)` |
| `src/app/shared/components/pin-card-player-short/pin-card-player-short.component.ts` | Componente de card de vídeo. Registra-se no serviço ao iniciar reprodução e escuta mudanças via `effect()` para pausar quando outro vídeo assume |
| `src/app/domain/home/components/media-card/media-card.component.html` | Template do feed. Renderiza a lista de cards — não precisa saber nada sobre o controle de reprodução |

### Como funciona internamente

```
Usuário clica no vídeo A
  → PinCardPlayerShortComponent chama playback.setActive('A')
  → Signal activeId muda para 'A'
  → effect() em todos os outros cards detecta a mudança
  → Cards com id diferente de 'A' chamam pauseVideo() internamente
  → Apenas o vídeo A continua reproduzindo
```

O controle é baseado em **Angular Signals** e `effect()`, sem necessidade de EventEmitter, Subject RxJS ou comunicação via inputs/outputs entre componentes. A coordenação acontece pelo serviço global, mantendo cada card isolado e reutilizável.

### Integrações

- **Feed da Home:** `MediaCardComponent` renderiza os cards sem precisar orquestrar reprodução
- **Player de vídeo nativo:** o serviço não controla o elemento `<video>` diretamente — cada card mantém seu próprio `videoRef` e executa `.pause()` localmente quando notificado
- **Rota Watch:** ao navegar para a página de vídeo completo, o `ngOnDestroy` do card libera o ID ativo, limpando o estado do serviço automaticamente
