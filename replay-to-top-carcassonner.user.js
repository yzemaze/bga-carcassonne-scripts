// ==UserScript==
// @name        BGA Carcassonne replay to top-carcassonner.com
// @description Opens https://top-carcassonner.com/problems/propose and autofills the input fields with values from a BGA replay
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/yzemaze/bga-carcassonne-scripts
// @supportURL  https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/replay-to-top-carcassonner.user.js
// @updateURL   https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/replay-to-top-carcassonner.user.js
// @namespace   https://github.com/yzemaze/
// @match       https://boardgamearena.com/archive/replay/*
// @match       https://top-carcassonner.com/problems/propose
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @version     0.3.0
// @author      yzemaze
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('boardgamearena.com/archive/replay')) {
        if (document.getElementsByClassName("bgagame-carcassonne").length > 0) {
            addButton();
        }
    } else if (window.location.href === 'https://top-carcassonner.com/problems/propose') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                pasteData();
            }, 3000);
        });
    }

    function copyData() {
        const tableEl = document.getElementById('table_ref_item_table_id');
        const tableId = tableEl ? tableEl.textContent.replace(/\D/g, "") : ''
        const remainingTiles = document.getElementById('remainingtiles').textContent.trim();
        const moveNbr = document.getElementById('move_nbr').textContent.trim();
        const pageUrl = new URL(window.location);
        pageUrl.searchParams.set('goto', moveNbr);
        const tableUrl = "https://boardgamearena.com/gamereview?table=" + tableId;
        const players = document.querySelectorAll("#player_boards .player-name");
        const player1 = players[0].textContent.trim().replace(/»\s*/g, "");
        const player2 = players[1].textContent.trim().replace(/»\s*/g, "");

        GM_setValue('table_ref', tableId);
        GM_setValue('remaining_tiles', remainingTiles);
        GM_setValue('page_url', pageUrl.href + "\n\n");
        GM_setClipboard([tableId, moveNbr, remainingTiles, tableUrl, pageUrl.href, player1, player2].join(";"));

        GM_openInTab('https://top-carcassonner.com/problems/propose', {
            active: true
        });
    }

    function pasteData() {
        const tableRefItem = GM_getValue('table_ref', '');
        const remainingTiles = GM_getValue('remaining_tiles', '');
        const pageUrl = GM_getValue('page_url', '');

        const tableId = document.getElementById('inline-table-id');
        const remainingTileCount = document.getElementById('inline-remaining-tile-count');
        const textArea = document.querySelector('textarea#inline-remaining-tile-count');

        // update values and internal variables of Vue.js
        if (tableId) {
            tableId.value = tableRefItem;
            tableId.dispatchEvent(new Event('input'));
        }
        if (remainingTileCount) {
            remainingTileCount.value = remainingTiles;
            remainingTileCount.dispatchEvent(new Event('input'));
        }
        if (textArea) {
            textArea.value = pageUrl;
            textArea.dispatchEvent(new Event('input'));
            textArea.focus();
        }
    }

    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy Data to top-carcassonner';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '180px';
        button.style.padding = '10px 20px';
        button.style.width = 'max-content';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.fontSize = '16px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', function() {
            copyData();
        });

        document.body.appendChild(button);
    }
})();
