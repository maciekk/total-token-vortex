---
date: 2011-05-28 18:58:00+00:00
draft: false
tags:
- hardware
- linux
title: 'Ubuntu/gnome: disabling password request on resume'
---

Problem: on resume from suspend, Ubuntu/GNOME presents password entry dialog,  which is annoying.

Found a working solution here:

<http://ubuntuforums.org/showthread.php?t=1466504>

Namely:

> 1. As you've probably already done, uncheck:  
> "lock screen when screen saver is activated"  
> in the System->Preferences->Screen Saver menu.  
> 2. Type gconf-editor in a terminal. Under apps/gnome-power-manager/locks check:  
> "use\_screensaver\_settings".  
> 3. If still asked for password, you can (also in gconf-editor) go to desktop/gnome/lockdown and check:  
> "disable\_lock\_screen"  
> Credits to itslofty below for this tip!

I only had to do steps 1 and 2 on my Ubuntu 11.04 Natty Narwal on the Acer Aspire 522 BZ499.
