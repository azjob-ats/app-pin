# Refatoração da Página de Canal / Perfil

## Objetivo

Quero atualizar a estrutura atual da página de perfil para separar claramente o conceito de:

- **Usuário (Profile/User)**
- **Canal (Channel)**

Atualmente a tela utiliza dados de usuário (`users.js`) para representar um canal, porém isso não faz mais sentido na arquitetura atual da aplicação.

O objetivo é criar uma estrutura própria para canais.

---

# Arquivos Envolvidos

## Frontend

```txt
/home/azjob/workspace/app-pin/src/app/domain/profile/pages/profile/profile.component.ts
/home/azjob/workspace/app-pin/src/environments/environment.ts

Backend / Mock API
DETAIL: '/api/users/:id'

Alteração das Tabs
Estrutura Atual
<app-tab id="created">{{ 'profile.created' | translate }}</app-tab>
<app-tab id="saved">{{ 'profile.saved' | translate }}</app-tab>
<app-tab id="boards">{{ 'profile.boards' | translate }}</app-tab>


Nova Estrutura
<app-tab id="gallery">{{ 'profile.gallery' | translate }}</app-tab>
<app-tab id="collection">{{ 'profile.collection' | translate }}</app-tab>

Regras das Tabs
Gallery
A aba gallery representa:
Todas as mídias/publicações criadas pelo canal.

Fonte dos dados
Criar uma nova mock API:
/home/azjob/workspace/app-pin/api-server/src/data/gallery.js

Observação
A API ainda não existe e deve ser criada.


Collection
A aba collection representa:
Agrupamentos organizados de conteúdos/mídias.

Fonte dos dados
Utilizar a mock API já existente:
/home/azjob/workspace/app-pin/api-server/src/data/collection-bundles.js



Separação entre User e Channel
Problema Atual
Hoje a página está utilizando dados daqui:
/home/azjob/workspace/app-pin/api-server/src/data/users.js
Porém esses dados representam usuários e não canais.

Nova Estrutura de Canal

Criar um recurso específico para canais.

Necessário
Mock de canais
Service
Endpoint
Model/interface
Integração com frontend


Estrutura Esperada do Channel
Usar como referência:
´
channel: {
  id: '124e9f9f-6310-447f-9ba3-29e90219ff99',
  profileName: 'Digix',
  profileNameOfficial: 'Digix',
  profilePicture: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245540/digix_logo_sguqv0.jpg',
  coverPicture: 'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245557/somosdigix_cover_innpe4.jpg',
  numberOfFollowers: 15200,
  numberOfPublication: 324,
  numberOfToFollow: 45,
  verified: true,
  email: 'contato@digix.com',
  isReported: false,
  isBlocked: false,
  overview: 'somos dos digix',
  visitWebsite: 'digix.com'
}
´
Referência existente:
/home/azjob/workspace/app-pin/api-server/src/data/posts.js


Avaliação Arquitetural

Avaliar se a página atual profile realmente deve continuar representando canais.

Caso faça sentido arquiteturalmente:

Criar uma nova página dedicada para Channel

Exemplo:

/domain/channel/pages/channel
Separando completamente:

User Profile
Channel Page


Navegação para Página do Canal

A navegação deve acontecer a partir do componente:
/home/azjob/workspace/app-pin/src/app/shared/components/post-details/post-details.component.ts

´
<!-- Channel row -->
<div class="pp-channel-row flex align-center gap-3 py-3 mb-4">
  <app-user-avatar
    [imageUrl]="post().channel.profilePicture"
    [alt]="post().channel.profileName"
    size="md" />

  <div class="flex-1 flex flex-col">
    <span class="pp-channel-name fw-bold text-base text-1xl-title flex align-center gap-1">
      {{ post().channel.profileName }}

      @if (post().channel.verified) {
        <span
          class="material-symbols-rounded pp-verified"
          aria-label="Canal verificado">
          verified
        </span>
      }
    </span>

    @if (post().channel.numberOfFollowers) {
      <span class="text-1 text-7-title">
        {{ formatCount(post().channel.numberOfFollowers) }} seguidores
      </span>
    }
  </div>

  <app-button-inscription [subscribed]="false" />
</div>
´








