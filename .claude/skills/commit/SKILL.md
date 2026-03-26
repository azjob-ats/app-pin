---
name: commit
description: Gera sugestão de mensagem de commit padronizada conforme README.md do projeto
allowed-tools: Bash(git diff*), Bash(git status*)
argument-hint: [contexto opcional]
---

Analise as alterações atuais no repositório e gere uma sugestão de mensagem de commit seguindo rigorosamente o padrão definido no projeto.

## Padrão obrigatório

```
emoji type(scope): description
```

### Tabela de emojis e tipos

| Emoji | Type       | Quando usar                    |
| ----- | ---------- | ------------------------------ |
| ✨    | `feat`     | Nova funcionalidade            |
| 🐛    | `fix`      | Correção de bug                |
| 🚀    | `perf`     | Melhoria de performance        |
| ⏪️    | `revert`   | Reverter commit anterior       |
| 📦    | `refactor` | Refatoração de código          |
| 🔧    | `ci`       | CI/CD                          |
| 🧪    | `test`     | Testes                         |
| 📝    | `docs`     | Documentação                   |
| 💄    | `style`    | Estilo de código               |
| 🏗️    | `build`    | Sistema de build               |
| 🚧    | `chore`    | Manutenção                     |

### Regras

1. **Emoji no início** (OBRIGATÓRIO - commit será rejeitado sem ele)
2. **Type** em inglês (feat, fix, etc.)
3. **Scope** entre parênteses — use o nome do componente, serviço ou área afetada (opcional, mas recomendado)
4. **Dois-pontos e espaço**
5. **Descrição imperativa, clara e em inglês** — "o que esse commit vai fazer?" (não "o que eu fiz")
6. **NÃO adicionar** trailers `Co-Authored-By`

### Exemplos válidos

```
✨ feat(button): add loading state
🐛 fix(input): resolve focus bug
📦 refactor(dialog): improve animation performance
🧪 test(form): add validation tests
📝 docs(readme): update installation guide
```

## O que fazer

1. Execute `git diff HEAD` e `git status` para entender as mudanças
2. Se o usuário passou contexto em `$ARGUMENTS`, use como guia adicional
3. Determine o emoji e type corretos com base nas mudanças
4. Identifique o scope (componente, serviço ou área afetada)
5. Escreva uma descrição imperativa e concisa em inglês
6. Exiba a sugestão formatada e pronta para copiar
7. Confirme com o usuário se ele deseja commitar
