# Para acessar sua aplicação Angular do WSL no celular, siga estes passos:

## 1. Configurar o Angular para acesso externo

No terminal do **WSL/Ubuntu**, rode seu Angular com o **host 0.0.0.0**:

```sh
ng serve --host 0.0.0.0 --port 4200
```

## 2. Descobrir o IP do WSL no Windows

No terminal do WSL, execute:
```sh
hostname -I
```
Anote o IP que aparece (algo como 172.x.x.x).

## 3. Permitir conexão através do firewall do Windows
Abra o PowerShell como Administrador e execute:
```powershell
New-NetFirewallRule -DisplayName "WSL Angular" -Direction Inbound -LocalPort 4200 -Protocol TCP -Action Allow
```
## 4. Configurar porta forwarding (se necessário)
No PowerShell do Windows (normal), execute:
```powershell
netsh interface portproxy add v4tov4 listenport=4200 listenaddress=0.0.0.0 connectport=4200 connectaddress=<IP_DO_WSL>
```
Substitua <IP_DO_WSL> pelo IP que anotou no passo 2.

## 5. Descobrir IP do Windows na rede
No PowerShell ou CMD:
```cmd
ipconfig
```
Procure o IPv4 da sua conexão Wi-Fi/Ethernet (algo como 192.168.x.x).
```text
Adaptador de Rede sem Fio Wi-Fi:

   Sufixo DNS específico de conexão. . . . . . :
   Endereço IPv6 . . . . . . . . . . : 2804:d45:e3d9:df00:9016:2533:8879:7f73
   Endereço IPv6 Temporário. . . . . . . . : 2804:d45:e3d9:df00:4c80:855e:e848:9a13
   Endereço IPv6 de link local . . . . . . . . : fe80::1c33:a014:1cde:3093%7
   Endereço IPv4. . . . . . . .  . . . . . . . : 192.168.1.9 // ✅ ultiliza essa aqui
   Máscara de Sub-rede . . . . . . . . . . . . : 255.255.255.0
   Gateway Padrão. . . . . . . . . . . . . . . : fe80::1%7
                                                 192.168.1.254
```
## 6. Acessar no celular
No navegador do celular, digite:
```sh
http://<IP_DO_WINDOWS>:4200
```



