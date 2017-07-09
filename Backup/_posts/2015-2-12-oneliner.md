---
layout: post
title: oneliner
---

## apache の AccessLogで1時間毎のカウント
```bash
$ cat access.log | cut -d " " -f4 | cut -c2- | cut -d":" -f1,2 | uniq -c | less
```
