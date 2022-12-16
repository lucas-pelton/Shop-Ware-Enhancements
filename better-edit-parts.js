// ==UserScript==
// @name         Better Edit Parts on Work Order
// @namespace    Shop_Ware_Enhancements
// @version      2.0
// @description  Add click to edit part
// @author       Lucas Pelton @ MOM+POP, Ltd.
// @match        *://*.shop-ware.com/work_orders*
// @icon         https://app.shop-ware.com/assets/favicons/apple-touch-icon-72x72-89af59ff6d6f34e91a6d7bd08d47589c10693c21fcdfeabad510985c8730ed08.png
// @updateURL    https://raw.githubusercontent.com/lucas-pelton/Shop-Ware-Enhancements/main/better-edit-parts.js
// @grant        none
// ==/UserScript==

/*global $*/

/************
 * REQUIRES Better Parts Search v1.3+
 */

 (function () {
    'use strict';

    console.log('Better Edit Parts Running');


    Number.prototype.between = function (a, b, inclusive = 0) {
        return inclusive ?
            (this >= Math.min(a, b) && this <= Math.max(a, b)) ? 1 : 0 :
            (this > Math.min(a, b) && this < Math.max(a, b)) ? 1 : 0;
    };


    /***************
     * Local Style Overrides
     */

    var style = document.createElement('style');
    style.innerHTML = `
.backbone-app .modal-footer::before,
.backbone-app .modal-footer::after {
    display:none !important;
}

.in-stock {
        background: #4caf503b;
}

.in-stock.limited-stock {
    background: #FF22aa3b;
}
.no-stock a {
    color: #d51515e0 !important;
}
  `;
    document.head.appendChild(style);


    var $partsModal = $('.js-part-edit-modal-container'),
        actionString = "Edit Master Part";

    var $addPartsSelector = $('#parts-autocomplete .ui-autocomplete');


    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var partsModalObserver = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs

        let partNumber = $('#part_number', $partsModal).val(),
            url = `/inventory/?s=${partNumber}&modal=true`;

        partsModalObserver.disconnect($partsModal[0]);
        $('.modal-footer', $partsModal)
            .prepend(`<a target="_blank" href="${url}">${actionString}</a>`)
            .css({
                'display': 'flex',
                'justify-content': 'space-between'
            });

        // Make this work to disappear the before and after items that are changing the spacing of the items in the container
        // $('.backbone-app .modal-footer:before, .backbone-app .modal-footer:after', $partsModal).css('display', 'none');

        partsModalObserver.observe($partsModal[0], {
            childList: true,

            //...
        });

    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    partsModalObserver.observe($partsModal[0], {
        childList: true,

        //...
    });


    var addPartsSelectorObserver = new MutationObserver(function (mutations) {
        // fired when a mutation occurs
        let $theUL = $(mutations[0].target);
        if ($theUL.css('display') != 'block') return;

        let theStuff = $("li", $theUL);


        theStuff.sort(function (a, b) {
            return parseInt($(a).find("i").text()) > parseInt($(b).find("i").text())
                ? -1
                : 1;
        }).each(function () {
            $(this).addClass(parseInt($('i', this).text()) ? "in-stock" : "no-stock");
            $(this).addClass(parseInt(parseInt($('i', this).text()).between(0, 6)) ? "limited-stock" : "");
        });


        addPartsSelectorObserver.disconnect();
        $theUL.append(theStuff);
        $addPartsSelector.each(function(){
        addPartsSelectorObserver.observe(this, {
            childList: true,
        });
    });

    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    $addPartsSelector.each(function(){
        addPartsSelectorObserver.observe(this, {
            childList: true,
        });
    });


})();
