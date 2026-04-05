---
date: 2010-02-17 04:21:00.003000+00:00
draft: false
tags:
- Ai
- Hardware
title: BenQ W9000 service menu / overscan
---

I found that on my BenQ W9000 projector, when feeding it 1280x720 signal from my computer (for when my gfx card cannot handle the full 1900x1080 at reasonable framerates), and using the Anamorphic mode to scale image to full display area, a fair bit of the image was being cropped. Turns out this has to do with "overscan" setting, which alas is not accessible from regular projector menu. However, it is modifiable if one enters a secret "service menu". For this projector, to enter the service menu press:

* Menu
* Up
* Down
* Up
* Down
* Up
* Down
* Menu

[the above is from <http://www.avsforum.com/avs-vb/showthread.php?t=799576>]

The setting is under Video Signal option ("overscan rate"). When showing the 720p image, the overscan rate was originally only 93%! I've set it to 100% and now there is no longer any cropping. Yay!

FYI, to get back to using the regular OSD menu once you're done with the service menu, select the first option Factory > Return User OSD.
