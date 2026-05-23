// ----------------------------------------------------------------------------
// Media assets (arquivos de mídia exibidos em posts, pitches, daily-story…)
// ----------------------------------------------------------------------------
//
// Tabela genérica para qualquer entidade que precise referenciar um arquivo
// armazenado em CDN/storage. Hoje é consumida por `posts` (feed). No futuro,
// `pitches.storage_url` / `pitches.thumbnail_url` podem migrar para FK aqui
// também — preservando 1 tabela por conceito de "arquivo de mídia".
//
// Mock fonte: api-server/src/data/posts.js → objeto `media`

Enum media_content_type {
  movie     // vídeo
  photo     // imagem estática
  text      // post sem mídia (apenas texto)
  app       // mini-aplicação embedada
}

Enum media_guidance {
  landscape   // horizontal — preferência tela cheia desktop
  portrait    // vertical — formato reels
}

// ----------------------------------------------------------------------------
// Example rows:
//   id=1
//   uuid='42df8491-c499-418c-8b88-9c7bcf85ee86'
//   content_type='movie'
//   title='Visão geral da RealWe'
//   slug='visao-geral-da-realwe'
//   long_url='https://res.cloudinary.com/.../O_que_e_a_RealWe.mp4'
//   short_url='https://res.cloudinary.com/.../O_que_e_a_RealWe.mp4'
//   thumbnail_url='https://res.cloudinary.com/.../Captura_de_tela.png'
//   description='Primeiros passos de como utilizar a plataforma'
//   aspect_ratio='16:9'
//   resolution='1920x1080'
//   guidance='landscape'
//   tags=['RealWe','Trabalhe na Digix','Educação']
//
//   id=2
//   uuid='7361408a-ee83-482c-b798-a3c8861273e4'
//   content_type='movie'
//   title='Engenheiro de Software Especialista'
//   aspect_ratio='9:16'
//   guidance='portrait'
//   tags=['Vagas','Python','Desenvolvimento Backend','Trabalhe na Digix']
//
Table media_assets {
  id bigint [pk, increment]
  uuid uuid [unique, not null]
  content_type media_content_type [not null]
  title varchar [not null]                              // exibido como cabeçalho do card
  slug varchar [not null]                               // `titleLink` no mock — usado na URL pública
  description text                                      // caption longo exibido junto da mídia
  long_url varchar                                      // versão completa (vídeo full / imagem hi-res)
  short_url varchar                                     // versão curta (clipping para feed reels-like)
  thumbnail_url varchar                                 // capa exibida no card / preview
  photo_preview_icon varchar                            // ícone secundário sobreposto à capa (badge)
  aspect_ratio varchar                                  // ex.: '16:9' | '9:16' | '4:3' — string livre para tolerar novos formatos
  resolution varchar                                    // ex.: '1920x1080'
  guidance media_guidance                               // orientação preferida do player
  tags varchar[]                                        // `slang` no mock — tags exibidas e usadas em busca
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz

  indexes {
    slug
    content_type
  }
}
