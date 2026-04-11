---
date: 2011-10-22 02:01:00.001000+00:00
draft: false
tags:
- AI
- Hardware
- Linux
title: Monday as first day of week in GNOME
---

A lot of approaches on the Net specify hacking the locale files; e.g.:  
  <http://ubuntuforums.org/showthread.php?t=813945>  
  
However, a far simpler and certainly less intrusive procedure is to simply modify default LC\_TIME:  
  <http://askubuntu.com/questions/6016/how-to-set-monday-as-the-first-day-of-the-week-in-gnome-calendar-applet>  
  
Specifically:  

* in /etc/default/locale add:  
  LC\_TIME="en\_GB.UTF-8"
* log out, then log back in
