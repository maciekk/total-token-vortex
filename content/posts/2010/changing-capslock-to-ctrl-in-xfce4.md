---
date: 2010-12-05 16:26:00.002000+00:00
draft: false
tags:
- Keyboard
title: changing CapsLock to Ctrl in XFCE4
---

From:  
<http://serverfault.com/questions/10437/how-do-you-swap-the-caps-lock-to-control-in-xfce>  
  
Run this on startup:  
   
  /usr/bin/setxkbmap -option "ctrl:nocaps"  
  
  
This can be placed in XFCE's startup (Settings > Session and Startup > Application Autostart tab > Add button).
