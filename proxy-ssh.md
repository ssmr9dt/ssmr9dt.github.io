---
layout: page
title: PROXY SSH
permalink: /proxy-ssh/
---

![proxy-ssh](http://nya-tex.net/images/proxy-ssh.png "Proxy ssh")

```
Host ssh_server
	Hostname xxx.xxx.xxx.xxx
	Port 9222
	User ec2-user
	ForwardAgent yes
Host target_server
	Hostname ddd.ddd.ddd.ddd
	Port 22
	User ec2-user
	ProxyCommand ssh -W %h:%p ssh_server
```
