const AUTHORS = [
  { id: 'u1', username: 'fondecranvip', displayName: 'Fond Ecran VIP', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 'u2', username: 'design_lover', displayName: 'Design Lover', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 'u3', username: 'art_studio', displayName: 'Art Studio', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 'u4', username: 'photo_world', displayName: 'Photo World', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 'u5', username: 'creative_hub', displayName: 'Creative Hub', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
];

const COMMENT_TEXTS = [
  'Absolutely stunning! Love the composition.',
  'This is so inspiring! Saved to my board.',
  'The colors here are incredible.',
  'Beautiful work! Where was this taken?',
  'This perfectly captures the mood.',
  'I need to try this style.',
  'Obsessed with this aesthetic!',
  'So talented, keep it up!',
  'This made my day 😍',
  'Goals! Can you share more details?',
];

function generateCommentsForPin(pinId, count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    id: `comment-${pinId}-${i + 1}`,
    text: COMMENT_TEXTS[i % COMMENT_TEXTS.length],
    author: AUTHORS[i % AUTHORS.length],
    pinId,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    likesCount: Math.floor(Math.random() * 50),
    isLiked: Math.random() > 0.7,
  }));
}

module.exports = { generateCommentsForPin };
