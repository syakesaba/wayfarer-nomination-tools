// ==UserScript==
// @id           wafarer-nomination-tools@syakesaba
// @name         Wayfarer Nomination Tools
// @category     Info
// @namespace    syakesaba
// @author       https://github.com/syakesaba/wayfarer-nomination-tools
// @version      0.0001
// @updateURL    https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.js
// @downloadURL  https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.js
// @description  https://github.com/syakesaba/wayfarer-nomination-tools/README
// @include      https://wayfarer.nianticlabs.com/nominations
// @match        https://wayfarer.nianticlabs.com/nominations
// @grant        none
// ==/UserScript==

/* globals unsafeWindow */
const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

let nominationController;
let nominations = [];

(function() {
    'use strict';
    //

    // NominationController
    let el = w.document.querySelector('.nominations-controller');
    if (!el) {
        //console.log('not in nominations');
        return;
    }
    nominationController = w.angular.element(el).scope().nomCtrl;
    if (nominationController !== null) {
        analyzeCandidates();
    }
    function analyzeCandidates() {
        if (!nominationController.loaded) {
            w.setTimeout(analyzeCandidates, 200);
            return;
        }
        let timestamp = Date.now();
        nomList = nominationController.nomList;
        nomList.forEach(function(item) {
            let nomination = {
                'id': item.id,
                'timestamp': timestamp,
                'status': item.status,
                'nickname': 'player',
                'responsedate': 'null',
                'lat': item.lat,
                'lng': item.lng,
                'title': item.title,
                'description': item.description,
                'submitteddate': item.day,
                'imageurl': item.imageUrl
            };
            nominations.push(nomination);
        });
    }
})();

