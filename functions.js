var $ = query => [...document.querySelectorAll(query)];
var $1 = query => document.querySelector(query);
HTMLElement.prototype.$ = function(query){return [...this.querySelectorAll(query)]; };
HTMLElement.prototype.$1 = function(query){return this.querySelector(query); };
