// ==UserScript==
// @id           wafarer-nomination-tools@syakesaba
// @name         Wayfarer Nomination Tools
// @category     Info
// @namespace    syakesaba
// @author       https://github.com/syakesaba/wayfarer-nomination-tools
// @version      0.3
// @updateURL    https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.user.js
// @downloadURL  https://github.com/syakesaba/wayfarer-nomination-tools/wayfarer-nomination-tools.user.js
// @description  https://github.com/syakesaba/wayfarer-nomination-tools/README
// @include      https://wayfarer.nianticlabs.com/nominations
// @match        https://wayfarer.nianticlabs.com/nominations
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://unpkg.com/tabulator-tables@4.6.2/dist/js/tabulator.min.js
// @resource     tabulator_css https://unpkg.com/tabulator-tables@4.6.2/dist/css/tabulator.min.css
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

//https://github.com/olifolkerd/tabulator
//https://wiki.greasespot.net/Third-Party_Libraries
var tabulator_css = GM_getResourceText("tabulator_css");
GM_addStyle(tabulator_css);

/* globals unsafeWindow */
const w = typeof unsafeWindow === "undefined" ? window : unsafeWindow;

(function() {
    "use strict";
    const STATES = {init: 0, details: 1, edit: 2, error: 3};
    // NominationController
    let elm_nc = w.document.querySelector(".nominations-controller");
    let nominationController = w.angular.element(elm_nc).scope().nomCtrl;
    let nominations = [];
    let selectedNomination = undefined;
    //appendExportButton();
    //retributeNominations();
    appendExportCSVButton();
    appendStreetviewLink();
    hookNominationLoaded();

    function appendStreetviewLink() {
        let a = document.createElement("a");
        a.id = 'sview';
        a.href = "";
        a.target = "_blank"
        a.innerText = "ストリートビューを開く";
        a.className = 'button-primary';
        let placeholder = document.querySelector('.nomination-detail');
        placeholder.appendChild(a);
    }

    function onNominationLoaded() {
        hookCurrentNominationChange();
    }

    function onCurrentNominationChange() {
        let sview = document.querySelector('#sview');
        sview.href = "https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + selectedNomination.lat + "," + selectedNomination.lng;
    }

    function hookNominationLoaded() {
        if (!nominationController.loaded) {
            w.setTimeout(hookCurrentNominationChange, 200);
        }
        onNominationLoaded();
    }

    function hookCurrentNominationChange() {
        if (nominationController.currentNomination != undefined){
            if (selectedNomination != nominationController.currentNomination){
                selectedNomination = nominationController.currentNomination;
                onCurrentNominationChange();
            }
        }
        w.setTimeout(hookCurrentNominationChange, 1000);
    }

/*
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
*/

/*
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
                "imageUrl",
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
*/
    function appendExportCSVButton() {
        let table_holder = document.createElement("div");
        table_holder.id = "nominations_table";
        //データのデバッグ用テーブル。隠しちゃおう。
        table_holder.style.visibility = "hidden";
        table_holder.style.display = "none";
        //
        let placeholder = document.querySelector('.nomination-header');
        placeholder.appendChild(table_holder);
        let table = new Tabulator("#nominations_table", {
            height:"311px",
            index:"order",
            layout:"fitData",
             columns:[
                {title:"ID",field:"id",width:100},
                {title:"タイトル",field:"title"},
                {title:"説明",field:"description"},
                {title:"緯度",field:"lat"},
                {title:"経度",field:"lng"},
                {title:"市",field:"city"},
                {title:"州",field:"state"},
                {title:"申請日",field:"day"},
                {title:"番号",field:"order"},
                {title:"画像URL",field:"imageUrl",width:100},
//                {title:"timestamp",field:"timestamp"},
                {title:"状態",field:"status"},
                {title:"アプグレ済フラグ",field:"upgraded"},
                {title:"次回アプグレフラグ",field:"upgraded"}
            ],
            ajaxResponse:function(url, params, response){
                //url - the URL of the request
                //params - the parameters passed with the request
                //response - the JSON object returned in the body of the response.
                let data = response.result;
//                console.table(data);
                return data;
            }
        });
        var ajaxConfig = {
            method:"get", //set request type to Position
            headers: {
                "Content-type": 'application/json; charset=utf-8', //set specific content type
            }
        };
        table.setData("https://wayfarer.nianticlabs.com/api/v1/vault/manage", {}, ajaxConfig); //make ajax request with advanced config options

        let button = document.createElement('button');
        button.id = 'exportTableButton';
        button.type = 'button';
        button.className = 'button-primary';
        button.innerText = 'CSVでエクスポート';
        button.addEventListener('click', function(e) {
            table.download("csv", "nominations.csv");
        });
        placeholder.appendChild(button);
    }

})();

