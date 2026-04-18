# Title Link — Documentação

---

## 1. Visão Geral

O **Title Link** é o identificador público e legível usado nas URLs de conteúdo da plataforma RealWe. Em vez de expor um identificador técnico (UUID) na barra de endereços, o sistema passa a usar um slug derivado do título do post combinado com o nome do canal.

### Antes e depois

| Antes | Depois |
|---|---|
| `/watch/2e30a509-8e69-43ff-b783-ee7c53f79e9a` | `/digix/watch/como-entrar-em-contato-conosco` |

### Onde se encaixa no produto

O Title Link é uma **camada de navegação e identidade** que atravessa todas as superfícies da plataforma que linkam para a página Watch: feed, página inicial, busca, conteúdos relacionados, shares externos e SEO.

---

## 2. Propósito

### Por que essa funcionalidade existe

URLs são a porta de entrada da plataforma para o mundo externo. Uma URL com UUID é ilegível, não comunica nada sobre o conteúdo e prejudica compartilhamento, SEO e memorização. O Title Link transforma cada URL em um **descritor do conteúdo** que ela aponta.

### Qual problema resolve

| Problema | Como o Title Link resolve |
|---|---|
| URL incompreensível ao compartilhar | Slug legível comunica o tema do conteúdo |
| Baixa indexação e ranqueamento em buscadores | Palavras-chave do título passam a compor a URL |
| Quebra de identidade visual ao divulgar links | URL mantém coerência com o canal e o tema |
| Impossibilidade de identificar origem antes do clique | Nome do canal antecede o slug, reforçando a marca |
| Dificuldade de analytics qualitativa por URL | Logs e dashboards passam a ler significado, não hashes |

### Qual necessidade atende

- **Usuário final:** clareza e confiança ao receber ou abrir links
- **Criador/Canal:** reforço de marca em cada compartilhamento
- **Buscadores:** URLs semânticas que melhoram descoberta orgânica
- **Equipe interna:** rastreabilidade legível em analytics e suporte

---

## 3. Objetivo

### O que se espera alcançar

1. **Legibilidade:** toda URL pública deve comunicar o que o usuário encontrará
2. **Atribuição:** a URL deve deixar claro de qual canal o conteúdo é
3. **SEO:** URLs otimizadas para indexação em buscadores externos
4. **Consistência:** padrão único de URL em todo o projeto

### Benefícios para o usuário

- Sabe o que vai abrir antes de clicar
- Consegue reconhecer, memorizar e compartilhar manualmente a URL
- Identifica o canal de origem sem abrir o link

### Benefícios para o criador

- Cada link compartilhado reforça o nome do canal na URL
- URL vira extensão da identidade editorial do canal
- Aumenta a probabilidade de cliques orgânicos em compartilhamentos

### Benefícios para o negócio

- Melhora performance em SEO (palavras-chave no path)
- Aumenta CTR em divulgações e redes sociais
- Reduz dependência de metadados para gerar prévia rica
- Facilita análises qualitativas de tráfego por URL

---

## 4. Como Funciona

### Estrutura da URL

```
/:username/watch/:titleLink
```

- **`:username`** — nome público do canal (`channel.profileName`), em minúsculas
- **`watch`** — segmento fixo que identifica o tipo de página
- **`:titleLink`** — slug gerado a partir do título do post

### Regras de geração do slug

A partir do valor de `media.title`, o sistema gera `media.titleLink` aplicando:

1. Converter todo o texto para minúsculo
2. Normalizar acentos (á→a, ç→c, etc.)
3. Remover caracteres especiais (`-`, `,`, `.`, `:`, etc.), mantendo apenas letras e números
4. Substituir espaços por hífens (`-`)
5. Remover hífens consecutivos
6. Remover hífen no início ou no fim

### Exemplos

| Título | Title Link |
|---|---|
| `Hack Hunters - Cyber investigations` | `hack-hunters-cyber-investigations` |
| `Visão geral da RealWe` | `visao-geral-da-realwe` |
| `Dia da Mulher: reflexão, celebração e luta por equidade` | `dia-da-mulher-reflexao-celebracao-e-luta-por-equidade` |
| `Digix é reconhecida como Great Place to Work 2025` | `digix-e-reconhecida-como-great-place-to-work-2025` |

### Unicidade

A combinação `username + titleLink` é o identificador público do post. O nome do canal na URL garante que dois canais diferentes possam ter títulos iguais sem colisão.

---

## 5. Como o Usuário Utiliza

### Passo a passo

1. Usuário encontra um post (no feed, busca ou relacionados)
2. Clica para abrir o conteúdo completo
3. Navegador exibe a URL `/:username/watch/:titleLink`
4. Usuário pode copiar, compartilhar ou salvar essa URL em qualquer canal externo
5. Ao receber a URL, outro usuário consegue inferir o conteúdo antes de abrir

### Cenários de uso

- **Compartilhamento em redes sociais:** link preserva contexto e identidade
- **Mensagens diretas:** destinatário identifica rapidamente o tema
- **Indexação em buscadores:** buscadores conseguem ler e ranquear a URL
- **Bookmark pessoal:** usuário memoriza a URL pelo nome do conteúdo

---

## 6. Impacto Estratégico

### Alinhamento com a identidade da RealWe

A RealWe valoriza **autenticidade** e **conexão entre pessoas reais e empresas reais**. Uma URL genérica com UUID nega esse princípio — ela esconde o criador e o conteúdo. Uma URL com nome do canal e título comunica essa autenticidade desde o primeiro contato com o link.

### Ganhos para o ecossistema

| Eixo | Ganho |
|---|---|
| Marca | Cada URL compartilhada reforça o canal |
| Tráfego | Melhora SEO e aumenta cliques orgânicos |
| Confiança | Usuário sabe o que vai abrir |
| Análise | Métricas ficam legíveis por contexto |
| Escalabilidade | Padrão único aplicável a qualquer tipo de conteúdo |

---

## 7. Considerações Técnicas Resumidas

- O campo `titleLink` é **obrigatório** em `PostMedia` e gerado junto com a criação do post
- O backend resolve o conteúdo a partir de `username + titleLink`, não de UUID
- UUID continua existindo internamente como chave primária, mas não é mais exposto em URLs públicas
- A rota do Angular casa o padrão `:username/watch/:titleLink`

---

## 8. Resumo Executivo

> O Title Link transforma cada URL da plataforma em um descritor semântico do conteúdo e do canal. O ganho é triplo: **usuários** entendem o link antes de clicar, **criadores** ganham visibilidade de marca em cada compartilhamento, e o **negócio** conquista melhor SEO, maior CTR e análises mais claras. É uma mudança pequena em superfície, mas estrutural para a identidade da plataforma.
