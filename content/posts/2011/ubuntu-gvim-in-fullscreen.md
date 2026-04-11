---
date: 2011-05-29 00:01:00+00:00
draft: false
tags:
- Keyboard
- Linux
title: 'Ubuntu: gVim in fullscreen'
---

Under compiz window manager, you need an extra package, which is not installed by default in Ubuntu 11.04. I've set the keybinding through gnome settings, and that was not sufficient to have the fullscreen action work.  
  
Steps:  
  

* apt-get install compiz-plugins-extra
* Systems Settings > CompizConfig Settings Manager > Extra WM Actions > Toggle Fullscreen (provide keybinding, such as Alt-Enter)
* I found that I needed to restart the window manager for this to start working.

  
Source:  
  <http://askubuntu.com/questions/2140/is-there-a-way-to-turn-gvim-into-fullscreen-mode>
