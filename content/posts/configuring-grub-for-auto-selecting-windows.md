---
date: 2011-09-11 18:35:00+00:00
draft: false
tags:
- Linux
title: configuring grub for auto-selecting Windows
---

Typically "Windows" is one of the last options in the GRUB menu, and thus rather brittle to selecting by static index.  Instead, one can specify default GRUB choice by using the full option name.  Here are the steps I followed last to update this on a recent Ubuntu (11.x) install:  
  

1. edit /etc/default/grub
2. change GRUB\_DEFAULT to FULL name of the Windows menu entry (best to copy-paste from your own config)
3. save
4. to propagate the change, run 'update-grub'

Note that, aside from the static integer index and the full menu item name, one can also use special string 'saved'. However IIRC in the past I was not fully happy with this option (did not stick maybe?).
