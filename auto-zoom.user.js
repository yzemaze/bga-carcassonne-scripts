// ==UserScript==
// @name         BGA Carcassonne auto-zoom
// @description  Automatically change map_surface size to maximum available space after each placement and then use BGA’s zoom feature (End button)
// @match        https://*.boardgamearena.com/*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace    https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL  https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL   https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL  https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/auto-zoom.user.js
// @version      0.2.0
// @author       yzemaze
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

const TILES_THRESHOLD = 55; // auto-zoom only below x remaining tiles
const WIDTH_THRESHOLD = 1200; // block execution if window width is greater than threshold
const ANIMATION_TIME = 800; // ms to wait for tile placement animation

"use strict";
if (document.querySelector(".bgagame-carcassonne") && window.innerWidth <= WIDTH_THRESHOLD) {
	function setMapHeight() {
		let deduction = document.getElementById("map_surface").getBoundingClientRect().top
		if (document.querySelector("#dfBox.horizontal")) {
			deduction += document.getElementById("dfBox").getBoundingClientRect()["height"];
		}
		const height = window.innerHeight - deduction;
		document.getElementById("map_container").style["height"] = `${height}px`;
	}

	function autoZoom() {
		const event = new KeyboardEvent("keydown", {
			key: "End",
			keyCode: 35,
		});
		document.dispatchEvent(event);
	}

	const logObserver = new MutationObserver(() => {
		if (document.getElementById("remainingtiles").innerText < TILES_THRESHOLD) {
			setMapHeight();
			setTimeout(() => { autoZoom(); }, ANIMATION_TIME);
		}
	});

	logObserver.observe(document.getElementById("map_scrollable_oversurface"), {
		childList: true,
	});
}
