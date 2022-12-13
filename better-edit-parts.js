// ==UserScript==
// @name         Better Edit Parts on Work Order
// @namespace    Shop_Ware_Enhancements
// @version      1.1
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


    /***************
     * Local Style Overrides
     */

    var style = document.createElement('style');
    style.innerHTML = `
.backbone-app .modal-footer::before,
.backbone-app .modal-footer::after {
    display:none !important;
}
  `;
    document.head.appendChild(style);


    var $partsModal = $('.js-part-edit-modal-container'),
        actionString = "Edit Master Part";


    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
        // fired when a mutation occurs
        console.log(mutations, observer);

        let partNumber = $('#part_number', $partsModal).val(),
            url = `/inventory/?s=${partNumber}&modal=true`;

        observer.disconnect($partsModal[0]);
        $('.modal-footer', $partsModal)
            .prepend(`<a target="_blank" href="${url}">${actionString}</a>`)
            .css({
                'display': 'flex',
                'justify-content': 'space-between'
            });

        // Make this work to disappear the before and after items that are changing the spacing of the items in the container
        // $('.backbone-app .modal-footer:before, .backbone-app .modal-footer:after', $partsModal).css('display', 'none');

        observer.observe($partsModal[0], {
            childList: true,

            //...
        });

    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe($partsModal[0], {
        childList: true,

        //...
    });

})();