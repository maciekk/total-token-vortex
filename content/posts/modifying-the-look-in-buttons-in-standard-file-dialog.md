---
date: 2007-08-24 03:34:00+00:00
draft: false
tags:
- AI
- Programming
title: modifying the 'look-in' buttons in standard file dialog
---

Standard file dialogs under Windows (2000 and higher?) have a set of five big buttons down the left side which you can click to be directly taken to the corresponding directories. It's called the "Places bar", and the buttons might be called "look-in" buttons. I went in search of how to modify them, as the default set was uterly useless to me. Here are interesting things I found:

* a [thread](http://www.hostingforum.ca/149047-adding-more-buttons-generic-open-file-dialog-box.html) with all the info
* a cool [utility](http://www.cottonwoodsw.com/fx3tour.html), which alas does not aid with the problem
* donationcoder.com has a [review](http://www.donationcoder.com/Reviews/Archive/DialogExtenders/index.html) of various other file dialog extenders, some of which modify the places bar too (Direct Folders, in particular)
* [how](http://www.trilithium.com/johan/2004/12/places-bar/) to do it using registry editing
* but it's much easier to do it using [TweakUI](http://www.annoyances.org/exec/show/tweakui)
