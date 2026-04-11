---
date: 2011-07-01 04:35:00.002000+00:00
draft: false
tags:
- Hardware
- Linux
title: fixing headphone config on Acer Aspire One
---

From:  
  <http://ubuntuforums.org/showthread.php?t=1070212>  
> add this line:  
> options snd-hda-intel model=acer\_wmi  
> to the end of /etc/modprobe.d/alsa-base  
>   
> This has now changed. Put the above line in /etc/modprobe.d/sound
