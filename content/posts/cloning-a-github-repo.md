---
date: 2011-10-17 00:41:00+00:00
draft: false
tags:
- Ai
- Programming
title: cloning a github repo
---

Steps needed to download my repo from github to a new computer:  

* install git
* generate SSH key  
  ssh-keygen -t rsa -C "your\_email@youremail.com"
* add public key to github keys associated with my identity
* have ssh-agent forget identies  
  ssh-add -d
* now reread new ones  
  ssh-add
* verify ssh setup is working (see <http://help.github.com/ssh-issues/>)  
  ssh -vT git@github.com
* clone repo  
  git clone git://github.com/maciekk/emacs.git

Note that did not have to do a "git init" or "git remote add".
