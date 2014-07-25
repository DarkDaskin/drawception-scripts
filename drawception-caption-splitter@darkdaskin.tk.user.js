// ==UserScript==
// @id             drawception-caption-splitter@darkdaskin.tk
// @name           Drawception caption splitter
// @version        1.0
// @namespace      darkdaskin.tk
// @author         Dark Daskin
// @description    SplitsOneWordCaptionsNotFittingIntoPanel
// @include        http://drawception.com/viewgame/*
// @include        https://drawception.com/viewgame/*
// @run-at         document-end
// ==/UserScript==

var panels = document.querySelectorAll('.gamepanel');
for (var i = 0; i < panels.length; i++) {
    var caption = panels[i].querySelector('p');
    console.log(caption && caption.scrollWidth,  panels[i].clientWidth);
    if (!caption || caption.scrollWidth <= panels[i].clientWidth) 
        continue;
    console.log(caption.innerHTML);
    caption.innerHTML = caption.innerHTML.trim().replace(/[A-Z]/g, ' $&');
}
