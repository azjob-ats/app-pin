# Para instalar o WSL (Windows Subsystem for Linux) no Windows, siga o passo a passo abaixo

## 1. Abra o PowerShell como Administrador
```sh
wsl --install
```
Esse comando:

    Ativa os recursos necessários

    Instala o WSL 2

    Instala o Ubuntu (padrão)

    Configura tudo automaticamente

3️⃣ Reinicie o computador 🔄


## 2. Verificar se está usando WSL 2
```sh
wsl -l -v
```

### Resultado esperado:
```sh
NAME      STATE   VERSION
Ubuntu    Running 2
```

## 3. Instalar outra distro (opcional)
```sh
wsl --list --online
```

## 4. Para instalar, por exemplo, Ubuntu:
```sh
wsl --install -d Ubuntu
```

## 5. Atualizar o WSL (recomendado)
```sh
wsl --update
```


## 6. Acessar arquivos do Windows no Linux
```sh
cd /mnt/c
```

## 7. Teste rápido: o comando realmente está rodando?
```sh
wsl --status
```

## 8. Reinicie o serviço do WSL (resolve na maioria dos casos)
```sh
net stop LxssManager
net start LxssManager
```

## 9. Verifique se os recursos do Windows estão ativos
```sh
optionalfeatures
```
Marque TODOS estes itens:

    ✅ Subsistema do Windows para Linux
    ✅ Plataforma de Máquina Virtual
    ✅ Hyper-V (se existir no seu Windows)

👉 Clique em OK e reinicie o PC

## 10. Forçar WSL 2 manualmente
```sh
wsl --set-default-version 2
```

## 11. Encerra completamente o WSL
```sh
wsl --shutdown
```

## 12. Iniciar o WSL
```sh
wsl
```