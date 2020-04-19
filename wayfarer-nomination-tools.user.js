// ==UserScript==
// @id           wafarer-nomination-tools@syakesaba
// @name         Wayfarer Nomination Tools
// @category     Info
// @namespace    syakesaba
// @author       https://github.com/syakesaba/wayfarer-nomination-tools
// @version      0.0011
// @updateURL    https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.user.js
// @downloadURL  https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.user.js
// @description  https://github.com/syakesaba/wayfarer-nomination-tools/README
// @include      https://wayfarer.nianticlabs.com/nominations
// @match        https://wayfarer.nianticlabs.com/nominations
// @grant        none
// ==/UserScript==

/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/* globals unsafeWindow */
const w = typeof unsafeWindow === "undefined" ? window : unsafeWindow;

(function() {
    "use strict";
    // NominationController
    let elm_nc = w.document.querySelector(".nominations-controller");
    let nominationController = w.angular.element(elm_nc).scope().nomCtrl;
    let nominations = [];
    retributeNominations();
    appendExportButton(nominations);

    /*
    id: "AwIEUgcEBlIFV1NQBAABUQFVVQQGDg1ZUwcEVlVSB11LBwcH"
    title: "天神橋筋商店街 天五 タイルアート"
    description: "天神橋筋五丁目のアーケード街にあるタイルアート"
    lat: 34.707639
    lng: 135.511304
    city: "Osaka"
    state: "Osaka"
    day: "2020-04-19"
    order: 277
    imageUrl: "https://lh3.googleusercontent.com/aBlZvLZTd6qDPAd5vJweCg-raJzsEmROI5Bl_Ffyn-ibbQzbkjjLF9_voIOD1867UDmckDpScHlHxXXiKgLwPXph5jWd"
    nextUpgrade: false
    upgraded: false
    status: "NOMINATED"
    */
    function retributeNominations() {
        //https://github.com/PickleRickVE/wayfarer-direct-export/tree/master
        if (!nominationController.loaded) {
            w.setTimeout(retributeNominations, 200);
            return;
        }
        let timestamp = Date.now();
        let nomList = nominationController.nomList;
        nomList.forEach(function(item) {
            let nomination = {
                "id": item.id,
                "title": item.title,
                "description": item.description,
                "lat": item.lat,
                "lng": item.lng,
                "city": item.city,
                "state": item.state,
                "day": item.day,
                "order": item.order,
                "imageurl": item.imageUrl,
                "timestamp": timestamp,
                "status": item.status,
                "upgraded": item.upgraded,
                "nextUpgrade": item.nextUpgrade
            };
            nominations.push(nomination);
        });
    }

    function appendExportButton() {
        //https://blog.foresta.me/posts/extract_devices_with_user_script/
        let button = document.createElement('button');
        button.id = 'exportNominationButton';
        button.type = 'button';
        button.className = '';
        button.innerText = 'Export Nomination';
        let placeholder = document.querySelector('.nomination-header');
        placeholder.appendChild(button);

        //onclick
        button.addEventListener('click', function(e) {
            //https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
            const items = nominations;
            const replacer = (key, value) => value === null ? '' : value;
            const header = [
                "id",
                "title",
                "description",
                "lat",
                "lng",
                "city",
                "state",
                "day",
                "order",
                "imageurl",
                "timestamp",
                "status",
                "upgraded",
                "nextUpgrade"
            ];
            let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
            csv.unshift(header.join(','));
            csv = csv.join('\r\n');
            document.write(csv);
        });
    }
})();
