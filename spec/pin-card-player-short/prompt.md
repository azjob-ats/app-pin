🎯 Objective

Create a reusable video player component based on the existing PinCard component, preserving the visual design and transforming image-based content into a video experience.

--------------------------------------------------

# Component

Create:

PinCardPlayerShort

Location:

/home/azjob/workspace/app-pin/src/app/shared/components/pin-card-player-short

--------------------------------------------------

# Step 1 — Base Component

- Copy the structure from:

@shared/components/pin-card/pin-card.component

- Replace ONLY the image/content area with a video player
- Preserve:
  - layout
  - spacing
  - typography
  - overlays (likes, actions, etc.)
  - visual identity

⚠️ IMPORTANT:
The final UI must look like the original PinCard, only changing media behavior (image → video)

--------------------------------------------------

# Step 2 — Data Integration

Use the following API payload structure:

media:
- long (main video source)
- short (optional alternative)
- thumbnail (preview image)
- aspectRatio (9:16, 16:9, etc.)
- isPlaying
- isMuted
- volume
- progress
´
    let post = [
        {
            media: {
                contentType: 'vacancies',
                aspectRatio:'9:16',//4:3 | 9:16 |  16:9
                resolution:'1920x1080',
                guidance:'portrait',//Horizontal (Landscape) | Vertical (Portrait)
                long: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1767753308/1740402910314_w3k5da.mp4',
                short: 'https://res.cloudinary.com/ddvgzvqsm/video/upload/v1767753308/1740402910314_w3k5da.mp4',
                thumbnail: "https://res.cloudinary.com/ddvgzvqsm/image/upload/v1767753628/1740402886175_fhpcci.jpg",
                description: 'Vaga para Engenheiro de Software Especialista em Python. Requisitos: +5 anos experiência, Django/FastAPI, Docker, AWS, e vivência com metodologias ágeis. Oferecemos: Plano de saúde, VR/VA, horário flexível e ambiente remoto.',
                slang: ['#VagasTI', '#PythonJobs', '#DesenvolvimentoBackend', '#CarreiraEmTech', '#TrabalheNaDigix'],
                id: 'fg558djhjDrgrd6ff558',
                title: 'Engenheiro de Software Especialista',
                photoPreviewIcon: '',
                isPlaying: false,
                isMuted: false,
                volume: 0.5,
                progress: 0
            },
            channel: {
                id: 'fdfdfhthFGDdg65',
                profileName: 'Digix',
                profileNameOfficial: 'Digix',
                profilePicture: 'https://www.azjob.com.br/mock/digix_logo.png',
                coverPicture: 'https://www.azjob.com.br/mock/somosdigix_cover.jpg',
                numberOfFollowers: 15200,
                numberOfPublication: 324,
                numberOfToFollow: 45,
                verified: true,
                email: 'contato@digix.com',
                isReported: false,
                isBlocked: false,
                overview: 'somos dos digix',
                visitWebsite: 'digix.com'
            },
            comment: {
                data:[
                    {
                        id: 1,
                        replied: null,
                        user: '@ana_tech',
                        avatar: 'https://i.pravatar.cc/150?img=1',
                        text: 'Que vídeo inspirador! Trabalhar no setor público realmente tem essa missão de servir à sociedade.',
                        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        likes: 42,
                        replies: {
                            totalRecords: 9
                        }
                    },
                    {
                        id: 2,
                        replied: null,
                        user: '@pedro_dev',
                        avatar: 'https://i.pravatar.cc/150?img=2',
                        text: 'Como desenvolvedor, vejo a importância da tecnologia para melhorar os serviços públicos. Parabéns pelo trabalho!',
                        time: new Date(Date.now() - 5 * 60 * 60 * 1000),
                        likes: 31,
                        replies: {
                            totalRecords: 4
                        }
                    },
                    {
                        id: 3,
                        replied: null,
                        user: '@maria_adm',
                        avatar: 'https://i.pravatar.cc/150?img=5',
                        text: 'Há 15 anos no serviço público e confirmo: servir é realmente a essência. Boa lembrança no vídeo!',
                        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        likes: 89,
                        replies: {
                            totalRecords: 0
                        }
                    },
                    {
                        id: 4,
                        replied: null,
                        user: '@tech_recruiter',
                        avatar: 'https://i.pravatar.cc/150?img=8',
                        text: 'Excelente conteúdo! Vocês estão com vagas abertas para desenvolvedores backend?',
                        time: new Date(Date.now() - 3 * 60 * 60 * 1000),
                        likes: 15,
                        replies: {
                            totalRecords: 1
                        }
                    }
                ],
                page: 1,
                pageSize: 4,
                pages: 2,
                totalRecords: 6
            },
            id: '6fdg5f6dDrguurd6558',
            postType: 'vacancy',
            timestamp: '2025-03-07 21:29:25.187',
            isLiked: true,
            likes: 1247,
            comments: 28,
            shares: 156,
            views: 12589,
            isReported: false,
            isBlocked: false
        },
    ];
´

--------------------------------------------------

# Step 3 — Initial Behavior

- Video MUST start in:
  - paused state
  - volume ON (not muted)

- Initially render ONLY the thumbnail

--------------------------------------------------

# Step 4 — Lazy Load Video

When user clicks the thumbnail:

1. Replace thumbnail with video element
2. Load video using:
   media.long
3. Start playback automatically

--------------------------------------------------

# Step 5 — Player Controls

## Top Left — Volume

- Volume icon with 2 states:
  🔇 Muted  
  🔊 High  

- Click toggles mute/unmute
- Reflect current state visually

--------------------------------------------------

## Top Right — Navigation

- Arrow icon →
- On click:
  redirect to:

/pin/{post.id}

--------------------------------------------------

## Center — Play / Pause

- Clicking video toggles:
  play / pause

- Show overlay icon when paused
- Add smooth transition animation

--------------------------------------------------

## Bottom — Progress Bar

### Visual

- Horizontal bar at bottom
- Show:
  - current progress (filled)
  - remaining (empty)

--------------------------------------------------

### Interactions

#### Hover

- Show tooltip with time:
  Example: 0:29

- Tooltip follows cursor

--------------------------------------------------

#### Click

- Seek video to clicked position

--------------------------------------------------

#### Drag (Scrubbing)

- Allow dragging progress

- While dragging:
  - update time in real-time
  - optionally pause video

- On release:
  - resume playback (if previously playing)

--------------------------------------------------

# Step 6 — Time Display (Optional but Recommended)

- Show:

currentTime / duration

Example:
0:29 / 2:15

--------------------------------------------------

# Step 7 — Aspect Ratio Handling

Respect:

media.aspectRatio

Examples:

9:16 → vertical (shorts/reels)
16:9 → horizontal
4:3 → standard

Use responsive container (no distortion)

--------------------------------------------------

# Step 8 — Styling Rules

- Use ONLY:
  styles.scss
  utility.scss

- Do NOT create new arbitrary styles unless necessary
- Maintain design system consistency

--------------------------------------------------

# Step 9 — Componentization

Break into subcomponents if needed:

- video-player
- video-controls
- progress-bar
- volume-control

Ensure reusability

--------------------------------------------------

# Step 10 — Performance

- Lazy load video (only after click)
- Avoid unnecessary re-renders
- Optimize for smooth playback

--------------------------------------------------

# Step 11 — Accessibility

- aria-label for controls
- keyboard support (optional but recommended)

--------------------------------------------------


# Step 12 — Update Styleguide (MANDATORY)

Update:

/home/azjob/workspace/app-pin/src/app/domain/styleguide

Add the new component:

Pin Card Player Short

--------------------------------------------------
# Final Expected Result

- A video-based PinCard component
- Same visual identity as original PinCard
- Smooth and interactive video experience
- Fully reusable component
- Clean and maintainable architecture