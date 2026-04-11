---
date: 2009-06-14 15:35:00.002000+00:00
draft: false
tags:
- FountainPen
- Hardware
- Keyboard
title: OmniOutliner annoying binding
---

When I try to use Meta-Ctrl-< in Emacs while there is some text selected, OmniOutliner pops up and tries to insert the text as a "Default Clipping", which is terribly annoying, to say the least. After some looking around it seems to be a "Service" that can be turned off:
> You need to remove the OmniOutliner Professional.service file from ~/Library/Services
> If you want to use OmniOutliner, you can changed the clipping shortcut through the OS X keyboard prefs or using some other app that will modify service shortcuts for you.

and also
> Yes, I did restart after deleting the .service file. I did however find a .plist file (as your colleague suggested) related to OmniOutliner somewhere and once that was gone I am now rid of error messages as well.

Links:

* <http://forums.omnigroup.com/archive/index.php/t-9800.html>
* <http://www.mactech.com/articles/mactech/Vol.20/20.12/OSXServices/index.html>
