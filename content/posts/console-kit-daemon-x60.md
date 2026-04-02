---
date: 2010-12-05 18:39:00+00:00
draft: false
tags:
- hardware
- linux
title: console-kit-daemon x60
---

If you run 'htop' you might see over 60 processes named 'console-kit-daemon'.  This seems to be a bug. On a mostly-single-user system one might as well uninstall 'consolekit' package (seems to be used for fast user switching).

For more see:

<http://ubuntuforums.org/showpost.php?p=3609863&postcount=10>

P.S. Alas, some other packages depend on 'consolekit'; not removing for now.
