# Drawer Menu & Side Menu — Documentação e Especificação

Esta documentação detalha o funcionamento da funcionalidade de menu lateral extensível (`DRAWER_MENU`) e o componente de navegação multinível (`SideMenuComponent`), integrados aos dados dinâmicos do servidor.

---

## 📖 Guia do Usuário

O menu lateral é o hub central de configurações, preferências e ajuda da plataforma RealWe.

### 1. Acesso e Interface
- **Acesso**: O menu é aberto via um botão de gatilho (geralmente no cabeçalho da aplicação).
- **Painel**: O menu desliza da lateral esquerda, cobrindo parte da tela com um efeito de "gaveta" (Drawer) de 640px.
- **Navegação Hierárquica**: O menu funciona em três níveis de profundidade:
    1.  **Seções**: Categorias principais (ex: Configurações, Segurança).
    2.  **Itens**: Opções específicas dentro de uma seção.
    3.  **Detalhe/Ação**: Abre um formulário, interruptor ou exibe informações detalhadas.

### 2. Controles de Navegação
- **Botão Voltar**: No cabeçalho do menu, permite retornar ao nível anterior. Se estiver no nível inicial, o botão fecha o menu.
- **Fechar**: Um botão "X" no canto superior direito do menu encerra a sessão de navegação.
- **Links Diretos**: Alguns itens podem levar o usuário diretamente para outras páginas (ex: Design System), fechando o menu automaticamente.

---

## 🛠️ Guia do Desenvolvedor

A arquitetura do menu foi projetada para ser extensível e baseada em dados (data-driven).

### 1. Componentes Principais

#### `DrawerMenuComponent` (`app-drawer-menu`)
- **Papel**: Atua como o container principal (Host) que gerencia o ciclo de vida do Drawer.
- **Responsabilidades**:
    - Gerencia a visibilidade via `model(false)`.
    - Reseta o estado do sub-menu quando fechado.
    - Fornece o cabeçalho dinâmico (títulos e botão voltar).
    - Permite a projeção de conteúdo no rodapé via `#drawerFooter`.

#### `SideMenuComponent` (`app-side-menu`)
- **Papel**: Motor de navegação e renderização de conteúdo.
- **Níveis de Navegação (`NavLevel`)**:
    - `sections`: Lista as categorias principais buscadas via `MenuApi`.
    - `items`: Lista os itens da seção selecionada.
    - `detail`: Renderiza dinamicamente o componente associado ao item selecionado usando o `ComponentIntegratorComponent`.

### 2. Estrutura de Dados (`api-server/src/data/menu.js`)
O menu é alimentado por um arquivo de dados centralizado. Cada item de menu segue este esquema:

```javascript
{
  icon: 'settings',         // Ícone Material Symbols
  name: 'Idioma',           // Título exibido
  description: '...',        // Descrição curta
  routerLink: null,         // { link: string, closeMenu: boolean } para navegação direta
  component: {              // Componente a ser injetado no nível 'detail'
    element: 'LanguageToggleComponent',
    output: null,
    input: null
  },
  text: null                // Texto simples caso não haja componente
}
```

### 3. Implementação Técnica
- **Signals Inter-Componente**: O `DrawerMenuComponent` acessa o estado do `SideMenuComponent` via `viewChild` para exibir o título correto no cabeçalho em tempo real.
- **Integração Dinâmica**: O `ComponentIntegratorComponent` é usado para carregar componentes de interface sob demanda no nível de detalhe, permitindo que o menu cresça sem inflar o bundle inicial de forma desnecessária.
- **Performance**: Utiliza `ChangeDetectionStrategy.OnPush` para evitar re-renderizações custosas durante a animação do Drawer.

### 4. Ciclo de Vida da Navegação
1.  **Init**: `SideMenu` carrega as seções via `MenuApi`.
2.  **Select Section**: Busca itens da seção específica e muda o nível para `items`.
3.  **Select Item**: 
    - Se houver `routerLink`: Navega e fecha.
    - Se houver `component`: Muda nível para `detail` e injeta o componente.
4.  **Back/Reset**: Limpa o histórico de navegação e retorna o nível para `sections`.

---

## 🧪 Configuração e Customização
Para adicionar novas opções ao menu:
1.  Adicione a nova seção em `MENU_SECTIONS` no arquivo `menu.js`.
2.  Mapeie os itens da seção em `MENU_ITEMS`.
3.  Certifique-se de que qualquer componente referenciado no campo `element` esteja registrado no `ComponentIntegrator`.

---

## 🛤️ Jornada do Usuário (Ações Completas)

Esta seção detalha os fluxos de navegação para todas as funcionalidades disponíveis no menu lateral, categorizadas por objetivo do usuário.

### 1. Gestão de Conta e Segurança
Fluxo para usuários que desejam proteger ou gerenciar sua identidade na plataforma.
-   **Informações da Conta**: Navegação para `AccountInfoMenuComponent` para editar dados de perfil.
-   **Alterar Senha**: Acesso direto ao `ChangePasswordMenuComponent`.
-   **Segurança de Dispositivos**: Gerenciamento de sessões ativas via `ConnectedDevicesMenuComponent`.
-   **Privacidade e Dados**: Controle de consentimento (`ConsentManagementMenuComponent`) e solicitação de cópia de dados (`DownloadDataMenuComponent`).
-   **Encerramento de Ciclo**: Opções para desativação temporária (`DeactivateAccountMenuComponent`) ou exclusão permanente (`DeleteAccountMenuComponent`).

### 2. Personalização e Exibição
Fluxo para ajustar a estética e a acessibilidade da interface.
-   **Tema**: Alternância entre temas claro e escuro via `LightDarkToggleComponent`.
-   **Idioma**: Alteração da localização da plataforma através do `LanguageToggleComponent`.

### 3. Atividade e Privacidade de Uso
Fluxo para gerenciar notificações e a visibilidade das ações do usuário.
-   **Notificações**: Configuração de frequência e canais (Push/Email) via `NotificationSettingsMenuComponent`.
-   **Visibilidade**: Controle de quem pode ver interações e candidaturas via `ActivityVisibilityMenuComponent`.
-   **Histórico**: Limpeza de registros de busca e visualização via `ClearHistoryMenuComponent`.

### 4. Suporte, Institucional e Ecossistema
Fluxo para comunicação com a equipe, consulta de termos e informações da empresa.
-   **Feedback e Suporte**: Envio de sugestões (`SendFeedbackMenuComponent`), consulta de FAQ (`HelpCenterMenuComponent`) ou suporte direto (`HireSupportMenuComponent`).
-   **Informações Legais**: Acesso aos termos de uso (`TermsAndPoliciesMenuComponent`) e versão do software (`AppVersionMenuComponent`).
-   **Saiba Mais**: Informações sobre a empresa (`AboutRealweMenuComponent`) e acesso ao **Design System** (navegação externa para `/styleguide`).

---

> Documentação gerada e atualizada em 03 de Abril de 2026.