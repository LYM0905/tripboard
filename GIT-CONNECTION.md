# GitHub 连接方式

当前仓库地址：

```text
https://github.com/LYM0905/tripboard.git
```

## 当前可用方式

默认远程仍使用 HTTPS：

```powershell
git push
```

如果 GitHub HTTPS 网络恢复，这是最快方式。

## 稳定备用方式：SSH 走 443 端口

本机已经生成 SSH key：

```text
C:\Users\12144\.ssh\id_ed25519
C:\Users\12144\.ssh\id_ed25519.pub
```

公钥指纹：

```text
SHA256:PMm7BzrQimdGUOsapWNMzKiHnmCv+HFjiXqBIr2Pkcg
```

本机 SSH 配置已经写入：

```text
C:\Users\12144\.ssh\config
```

内容：

```sshconfig
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

还需要在 GitHub 添加公钥。复制：

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

打开 GitHub:

```text
Settings -> SSH and GPG keys -> New SSH key
```

粘贴公钥后测试：

```powershell
ssh -T git@github.com
```

成功后把仓库远程切换为 SSH：

```powershell
git remote set-url origin git@github.com:LYM0905/tripboard.git
git push
```

## 回退到 HTTPS

如果 SSH 不可用，可切回 HTTPS：

```powershell
git remote set-url origin https://github.com/LYM0905/tripboard.git
git push
```
