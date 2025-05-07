// ==UserScript==
// @name         BGA Carcassonne auto-zoom
// @description  Automatically change map_surface size to maximum available space after each placement and then use BGA’s zoom feature (End button)
// @match        https://*.boardgamearena.com/*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace    https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL  https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL   https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL  https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/auto-zoom.user.js
// @version      0.3.5
// @author       yzemaze
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

const WIDTH_THRESHOLD = 1200; // block execution if window width is greater than threshold (px)

"use strict";
if (document.querySelector(".bgagame-carcassonne") && window.innerWidth <= WIDTH_THRESHOLD) {
	function getFieldSize() {
		const elements = document.querySelectorAll('[id^="place_"]');
		let minX = -1, maxX = 1;
		let minY = -1, maxY = 1;

		elements.forEach(el => {
			const match = el.id.match(/^place_(-?\d+)x(-?\d+)$/);
			if (match) {
				const x = parseInt(match[1]);
				const y = parseInt(match[2]);

				if (!isNaN(x) && !isNaN(y)) {
					minX = Math.min(minX, x);
					maxX = Math.max(maxX, x);
					minY = Math.min(minY, y);
					maxY = Math.max(maxY, y);
				}
			}
		});

		const edge = parseInt(elements[0].style.width);
		return [maxX - minX + 1, maxY - minY + 1, edge];
	}

	function setMapHeight() {
		let deduction = document.getElementById("map_surface").getBoundingClientRect().top;
		if (document.querySelector("#dfBox.horizontal")) {
			deduction += document.getElementById("dfBox").getBoundingClientRect()["height"];
		}
		const height = window.innerHeight - deduction;
		document.getElementById("map_container").style["height"] = `${height}px`;
	}

	function bgaZoom() {
		const event = new KeyboardEvent("keydown", {
			key: "End",
			keyCode: 35,
		});
		document.dispatchEvent(event);
	}

	const mainTitleObserver = new MutationObserver(() => {
		const mustPlayATile = document.getElementById('titlearg1');
		if (!mustPlayATile) {
			return;
		}

		const [fieldWidth, fieldHeight, edge] = getFieldSize();
		const mapTop = document.getElementById("map_surface").getBoundingClientRect().top;
		const maxMapWidth = document.getElementById("map_surface").getBoundingClientRect().right;
		const maxMapHeight = window.innerHeight - mapTop;

		if (fieldWidth * edge > maxMapWidth || fieldHeight * edge > maxMapHeight) {
			setMapHeight();
			bgaZoom();
		}
	});

	mainTitleObserver.observe(document.getElementById("pagemaintitletext"), {
		childList: true,
		subtree: true
	});
}
