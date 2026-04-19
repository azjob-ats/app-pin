const { MOCK_POSTS } = require('./posts');

const DIGIX_CHANNEL = {
  profilePicture:
    'https://res.cloudinary.com/ddvgzvqsm/image/upload/v1775245540/digix_logo_sguqv0.jpg',
  profileNameOfficial: 'Digix',
  verified: true,
};

const SHOWCASE_POST_TITLE_LINKS = [
  'visao-geral-da-realwe',
  'hack-hunters-cyber-investigations',
  'digix-no-tech-summit-2025-inovacao-no-setor-publico',
  'engenheiro-de-software-especialista',
  'habix-revoluciona-gestao-habitacional-em-ms',
  'digix-e-reconhecida-como-great-place-to-work-2025',
  'dia-da-mulher-reflexao-celebracao-e-luta-por-equidade',
  'a-arte-do-feedback-como-crescer-com-criticas-construtivas',
];

function buildItemFromPost(titleLink) {
  const post = MOCK_POSTS.find((p) => p.media?.titleLink === titleLink);
  if (!post) return null;
  return {
    postId: post.id,
    title: post.media.title,
    titleLink: post.media.titleLink,
    thumbnailUrl: post.media.thumbnail,
    short: post.media.short,
  };
}

const MOCK_SHOP_WINDOW = [
  {
    id: '124e9f9f-6310-447f-9ba3-29e90219ff99',
    channel: DIGIX_CHANNEL,
    items: SHOWCASE_POST_TITLE_LINKS.map(buildItemFromPost).filter(Boolean),
  },
];

module.exports = { MOCK_SHOP_WINDOW };
