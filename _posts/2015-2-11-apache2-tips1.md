---
layout: post
title: Apache2 tips1
---

## ドメイン、サブドメインを設定

```bash
NameVirtualHost *:80
<VirtualHost *:80>
    ServerName example.nya-tex.net
    #...（省略）...
</VirtualHost>
 
<VirtualHost *:80>
    ServerName nya-tex.net
    #...（省略）...
</VirtualHost>
```
