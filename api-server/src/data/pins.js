const AUTHORS = [
  { id: 'u1', username: 'fondecranvip', displayName: 'Fond Ecran VIP', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 'u2', username: 'design_lover', displayName: 'Design Lover', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 'u3', username: 'art_studio', displayName: 'Art Studio', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 'u4', username: 'photo_world', displayName: 'Photo World', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 'u5', username: 'creative_hub', displayName: 'Creative Hub', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
];

const PICSUM_SEEDS = [
  { seed: 'nature1', w: 400, h: 600 },
  { seed: 'city2', w: 400, h: 300 },
  { seed: 'art3', w: 400, h: 500 },
  { seed: 'arch4', w: 400, h: 400 },
  { seed: 'food5', w: 400, h: 700 },
  { seed: 'fashion6', w: 400, h: 550 },
  { seed: 'tech7', w: 400, h: 320 },
  { seed: 'travel8', w: 400, h: 620 },
  { seed: 'interior9', w: 400, h: 480 },
  { seed: 'portrait10', w: 400, h: 580 },
  { seed: 'abstract11', w: 400, h: 360 },
  { seed: 'food12', w: 400, h: 450 },
  { seed: 'nature13', w: 400, h: 650 },
  { seed: 'design14', w: 400, h: 400 },
  { seed: 'city15', w: 400, h: 520 },
  { seed: 'art16', w: 400, h: 380 },
  { seed: 'fashion17', w: 400, h: 580 },
  { seed: 'arch18', w: 400, h: 440 },
  { seed: 'travel19', w: 400, h: 340 },
  { seed: 'interior20', w: 400, h: 600 },
];

const TITLES = [
  'Sunset vibes in the mountains',
  'Minimal workspace setup',
  'Floral watercolor art',
  'Modern architecture details',
  'Cozy coffee morning',
  'Street fashion editorial',
  'Futuristic UI design',
  'Hidden gems in Lisbon',
  'Scandinavian interior',
  'Golden hour portrait',
  'Abstract shapes study',
  'Homemade sourdough bread',
  'Forest bathing therapy',
  'Brand identity design',
  'Night city lights',
  'Geometric pattern art',
  'Spring wardrobe must-haves',
  'Concrete jungle beauty',
  'Road trip through Patagonia',
  'Japandi living room',
  'Para você',
  'Hypados',
  'Fitness e Saúde',
  'Educação',
  'Tecnologia',
  'Noticias',
  'Inteligência artificial',
  'Empreendedorismo',
  'Monetizações',
  'Ao vivo',
  'Psicologia',
  'Enviados recentemente',
  'Assistidos',
  'Cursos',
  'Shopping',
  'Como perder peso rápido',
  'empregos ameaçados pela IA',
  'idéia em um negócio online',
  'Planejamento financeiro inteligente',
  '10 Ferramentas de IA para Negócio',
  'vendendo no TIKTOK SHOP',
  'prospectar clientes',
  'Como se Comunicar Melhor',
  'java'
];


const BOARDS = [
  'Travel Inspiration',
  'Design & Art',
  'Home Decor',
  'Fashion & Style',
  'Food & Recipes',
  'Nature & Outdoors',
  'Architecture',
  'Photography',
];

const TAGS_POOL = [
  ['nature', 'mountains', 'sunset', 'landscape'],
  ['design', 'minimal', 'workspace', 'productivity'],
  ['art', 'watercolor', 'floral', 'illustration'],
  ['architecture', 'modern', 'building', 'urban'],
  ['coffee', 'morning', 'cozy', 'lifestyle'],
  ['fashion', 'style', 'editorial', 'clothing'],
  ['ui', 'ux', 'design', 'technology'],
  ['travel', 'lisbon', 'europe', 'city'],
  ['interior', 'scandinavian', 'home', 'decor'],
  ['portrait', 'photography', 'golden', 'hour'],
];

function generatePins(count = 80, startIndex = 0) {
  return Array.from({ length: count }, (_, i) => {
    const idx = (startIndex + i) % PICSUM_SEEDS.length;
    const { seed, w, h } = PICSUM_SEEDS[idx];
    const author = AUTHORS[i % AUTHORS.length];
    const num = startIndex + i + 1;
    return {
      id: `pin-${num}`,
      title: TITLES[i % TITLES.length],
      description: `A beautiful collection of ${TITLES[i % TITLES.length].toLowerCase()}. Perfect for inspiration and creativity.`,
      imageUrl: `https://picsum.photos/seed/${seed}${num}/${w}/${h}`,
      imageWidth: w,
      imageHeight: h,
      link: `https://example.com/pin/${num}`,
      author,
      boardId: `board-${(i % 8) + 1}`,
      boardName: BOARDS[i % BOARDS.length],
      saveCount: Math.floor(Math.random() * 5000) + 100,
      commentCount: Math.floor(Math.random() * 200) + 5,
      isSaved: Math.random() > 0.7,
      tags: TAGS_POOL[i % TAGS_POOL.length],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    };
  });
}

const MOCK_PINS = generatePins(80);

const MOCK_PIN_DETAIL = {
  id: '296604325483937524',
  title: 'Beautiful Mountain Landscape at Sunset',
  description:
    'Stunning panoramic view of mountain peaks bathed in golden sunset light. Perfect for wallpaper or travel inspiration. The colors of the sky blend seamlessly from deep orange to soft purple as the sun dips below the horizon.',
  imageUrl: 'https://picsum.photos/seed/mountain-sunset/800/1200',
  imageWidth: 800,
  imageHeight: 1200,
  link: 'https://example.com/mountain-landscape',
  author: AUTHORS[0],
  boardId: 'board-1',
  boardName: 'Nature & Outdoors',
  saveCount: 12543,
  commentCount: 234,
  isSaved: false,
  tags: ['nature', 'mountains', 'sunset', 'landscape', 'wallpaper'],
  createdAt: '2024-01-15T10:30:00Z',
};

module.exports = { MOCK_PINS, MOCK_PIN_DETAIL, generatePins };
