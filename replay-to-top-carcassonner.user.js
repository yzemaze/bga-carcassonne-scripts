// ==UserScript==
// @name        BGA Carcassonne replay to top-carcassonner.com
// @description Opens https://top-carcassonner.com/problems/propose and autofills the input fields with values from a BGA replay
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/yzemaze/
// @supportURL  https://github.com/yzemaze/
// @downloadURL https://github.com/yzemaze/
// @updateURL   https://github.com/yzemaze/
// @namespace   https://github.com/yzemaze/
// @match       https://boardgamearena.com/archive/replay/*
// @match       https://top-carcassonner.com/problems/propose
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @version     0.1
// @author      yzemaze
// ==/UserScript==

(function() {
		'use strict';

		if (window.location.href.includes('boardgamearena.com/archive/replay')) {
				addButton();
		} else if (window.location.href === 'https://top-carcassonner.com/problems/propose') {
				document.addEventListener('DOMContentLoaded', function() {
						setTimeout(function() {
								pasteData();
						}, 2000);
				});
		}

		function copyData() {
				const tableRef = document.getElementById('table_ref_item_table_id');
				const remainingTiles = document.getElementById('remainingtiles');
				const moveNbr = document.getElementById('move_nbr').textContent.trim();
				const pageUrl = new URL(window.location);
				pageUrl.searchParams.set('goto', moveNbr);

				GM_setValue('table_ref', tableRef ? tableRef.textContent.replace(/\D/g, "") : '');
				GM_setValue('remaining_tiles', remainingTiles ? remainingTiles.textContent.trim() : '');
				GM_setValue('page_url', pageUrl.href + "\n");

				GM_openInTab('https://top-carcassonner.com/problems/propose', { active: true });
		}

		function pasteData() {
				const tableRefItem = GM_getValue('table_ref', '');
				const remainingTiles = GM_getValue('remaining_tiles', '');
				const pageUrl = GM_getValue('page_url', '');

				const tableId = document.getElementById('inline-table-id');
				const remainingTileCount = document.getElementById('inline-remaining-tile-count');
				const textArea = document.querySelector('textarea#inline-remaining-tile-count');

				if (tableId) tableId.value = tableRefItem;
				if (remainingTileCount) remainingTileCount.value = remainingTiles;
				if (textArea) {
					textArea.value = pageUrl;
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

				archivecontrol = document.getElementById("archivecontrol");
				archivecontrol.appendChild(button);
		}
})();
