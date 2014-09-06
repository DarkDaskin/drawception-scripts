// ==UserScript==
// @id             drawception-browsing-ext@darkdaskin.tk
// @name           Drawception browsing extensions
// @version        1.0
// @namespace      darkdaskin.tk
// @author         Dark Daskin
// @description    
// @include        http://drawception.com/*
// @include        https://drawception.com/*
// @run-at         document-end
// ==/UserScript==

"use strict";

var $ = unsafeWindow.$ || window.$;

function router(url, routes) {
    var match;
    for (var i in routes) if (routes.hasOwnProperty(i)) {
        if (match = url.match(routes[i].pattern)) {
            match.shift();
            return routes[i].action.apply(null, match);
        }
    }
}


// Page actions

function browse(type, page) {
    new Index(type, page, getGames()).save();
}

function viewGame(id) {
    var index = new Index();
    if (!index) return;
    
    var $buttonsPanel = $('.row:first() .lead').next();
    var $bottomPanel = $('<div class="row">').appendTo($('.row').has('.thumbnail'));
    if (index.hasPrevious(id)) {
        $buttonsPanel.prepend(makeButton(index.getPrevious.bind(index, id), 
           'Previous', 'chevron-left', 'left'));
        $bottomPanel.prepend(makeButton(index.getPrevious.bind(index, id), 
           'Previous', 'chevron-left', 'left'));
    }
    if (index.hasNext(id)) {
        $buttonsPanel.append(makeButton(index.getNext.bind(index, id), 
           'Next', 'chevron-right', 'right'));
        $bottomPanel.append(makeButton(index.getNext.bind(index, id), 
           'Next', 'chevron-right', 'right'));
    }
}


// Helper methods

function getGames() {
    return $('.thumbpanel', this).map(function () {
        return this.href.match(/\/viewgame\/(\w+)\//)[1];
    });
}

function makeButton(action, tooltip, icon, float) {
    var $btn = $('<a class="btn btn-default">')
       .attr('title', tooltip)
       .click(action)
       .append($('<span class="glyphicon">')
          .addClass('glyphicon-' + icon));
    if (float) {
        $btn.css('float', float).css('margin-' + float, '25px');
    }
    return $btn;
}

function navigateToGame(id) {
    location.pathname = '/viewgame/' + id + '/-/';
}

function Index(type, page, games) {
    if (arguments.length) {
        this.type = type;
        this.page = page;
        this.games = $.makeArray(games);
        
    } else if (!this.load()) return null;
}
Index.prototype.load = function () {
    var data = JSON.parse(localStorage['browsingExt.index'] || 'null');
    if (!data) return null;
    
    return $.extend(this, data);
}

Index.prototype.save = function () {
    localStorage['browsingExt.index'] = JSON.stringify(this);
}
Index.prototype.hasPrevious = function (id) {
    for (var i in this.games) if (this.games.hasOwnProperty(i)) {
        if (this.games[i] === id) {
            return (i > 0); 
        }
    }
    return false;
}
Index.prototype.hasNext = function (id) {
    for (var i in this.games) if (this.games.hasOwnProperty(i)) {
        if (this.games[i] === id) {
            return (i < this.games.length - 1); 
        }
    }
    return false;
}
Index.prototype.getPrevious = function (id) {
    for (var i in this.games) if (this.games.hasOwnProperty(i)) {
        if (this.games[i] === id) {
            if (i > 0) {
                navigateToGame(this.games[+i - 1]);
                return;
            }
        }
    }
}
Index.prototype.getNext = function (id) {
    for (var i in this.games) if (this.games.hasOwnProperty(i)) {
        if (this.games[i] === id) {            
            if (i < this.games.length - 1) {
                navigateToGame(this.games[+i + 1]);
                return;
            }
        }
    }
}

// Init

router(location.pathname, [
    {pattern: /\/browse\/([\w-]+)\/(\d+)\//, action: browse},
    {pattern: /\/viewgame\/(\w+)\//, action: viewGame}
]);
