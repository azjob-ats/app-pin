

🎯 Objetivo

Desenvolver um componente interativo chamado EffectDragCards, utilizando o efeito "cards" do Swiper.js (Effect Cards)

O componente deve transmitir uma experiência moderna, fluida e visualmente atrativa, semelhante a um stack de cartões navegáveis.

Não instalar swiper, apenas tenha como exemplo no swiper(quero uma copia deste modelo de card 'Effect Cards )


# Especificação
- limitar o drag a 50% da largura do card (140px)

- adiciona o efeito, que, quando o arrastar chegar ao limite o que esta a atras vem para frente, e quando o usuario soltar o efeito não deve ser que o card sumiu ou caiu, deve ser o efeito de voltar para a pilha


quando arrastar e chegar ao limite, quero que a proxima imagem que esta a atras vem para frente, suave mente, se eu soltar ele vai para o final da pilha, se eu voltar para o meio, ela voltar esta na frente

- Usuário arrasta → card ativo segue o ponteiro com rotação leve

- Solta além do threshold → card sofre o efeito de voltar para a pilha 

- aparece no fundo da pilha com a transição spring

- Os cards atrás já estavam avançando sutilmente durante o drag, então a transição final parece contínua


- Criar um efeito de cards empilhados (stacked cards) onde:
  Os cards são posicionados em camadas (z-index crescente)
  Cada card subsequente (no fundo) possui um offset horizontal incremental
  O deslocamento segue uma progressão linear de 8px por nível:
    - Card 0: translateX(0px)
    - Card 1: translateX(8px)
    - Card 2: translateX(16px)
    - Card 3: translateX(24px)
  O objetivo é criar um efeito visual onde apenas a borda direita dos cards inferiores fica visível, simulando uma pilha
  Todos os cards devem estar alinhados verticalmente (top: 0)
  Opcional: aplicar leve scale ou sombra para reforçar profundidade
   criando as pontas visíveis no lado direito do topo da pilha. Durante o drag, esse offset diminui progressivamente conforme o card avança na pilha.

 Agora abaixo do stack de cards há uma pagination com esferas (dots). A esfera ativa fica maior e com cor de destaque. Clicar em qualquer dot navega diretamente para aquele card.

# Component

Create:

EffectDragCards

Location:

/home/azjob/workspace/app-pin/src/app/shared/components/effect-drag-cards

---

🧩 Referência de UI

Basear o comportamento no demo oficial do Swiper:
https://swiperjs.com/demos → "Effect Cards"

Adaptar o efeito para um contexto de produto profissional (não genérico/social).


---

📦 Modelo de Dados

interface EffectListCardMedia {
    id: '124e9f9f-6310-447f-9ba3-29e90219ff99',
    coverUrl: string,
    items: [
      {
        thumbnailUrl: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245377/Captura_de_tela_2026-04-03_164241_wraelh.png',
      },
      {
        thumbnailUrl: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245204/Captura_de_tela_2026-04-03_163946_tauf7k.png',

      },
      {
        thumbnailUrl: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1767753628/1741383679533_gjteyc.jpg',
      },
    ]
}

---

🎨 Layout / UI
- Cards empilhados com efeito 3D (Effect Cards)
- Bordas arredondadas (border-radius: 16px+)
- Sombra suave + profundidade

---

🃏 Card (Slide)

Cada card deve conter:

- Background:
  - imagem

---

⚡ Comportamento

- Swipe horizontal (touch)
- Drag com mouse (desktop)
- Stack animado (um card por vez em destaque)
- Próximo card parcialmente visível atrás
- Transição suave (spring-like)

---

🚫 Evitar

- Layout genérico de carousel simples
- Cards sem profundidade
- Falta de feedback visual
- Não instalar swiper

---

🎯 Resultado esperado

Um componente visualmente impactante que funcione, com navegação fluida estilo "deck de cartas"


# Update Styleguide (MANDATORY)

Update: /home/azjob/workspace/app-pin/src/app/domain/styleguide

Add the new component: EffectDragCards

url: /styleguide/comp-effect-drag-cards

