// ==UserScript==
// @name          BGA Carcassonne coordinates and other toggles
// @description   Adds toggles to display coordinates in legal placement spots and show currently hidden spots as well. Additional toggles for counts and dead tiles are not functional without another script.
// @match         https://*.boardgamearena.com/archive/replay/*
// @match         https://*.boardgamearena.com/*/carcassonne*
// @icon          https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace     https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL   https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL    https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL   https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/toggle-coords.user.js
// @version       0.4.1
// @author        yzemaze
// @license       GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

"use strict";
if (document.querySelector(".bgagame-carcassonne")) {

	const baseStyle = document.createElement("style");
	baseStyle.innerHTML = `
		.place {
			align-items: center;
			display: flex;
			justify-content: center;
			font-size: 16px;
			flex-direction: column;
		}
		.placeName, .place-count {
			color: #aaa;
			display: none;
		}
		.scrollmap_button_wrapper {
			cursor: pointer;
		}
		.yzToggleBtn {
			filter: unset;
			opacity: 0.3;
		}
		.yzToggleBtn.active {
			opacity: 1;
		}
		#yzFontSizeSlider {
			display: flex;
			align-items: center;
		}
		#yzFontSizeSlider .slider {
			-webkit-appearance: none;
			appearance: none;
			height: 1em;
			background: #d3d3d3;
			border-radius: 8px;
			outline: none;
			-webkit-transition: .2s;
			transition: opacity .2s;
			width: 100%;
		}
		#yzFontSizeSlider .slider::-webkit-slider-thumb, #yzFontSizeSlider .slider::-moz-range-thumb {
			-webkit-appearance: none;
			appearance: none;
			background: #000;
			border-color: #74a476;
			cursor: pointer;
			height: 1em;
			width: 1em;
		}
		.scrollmap_btns_left .scrollmap_btns_flex, .scrollmap_btns_right .scrollmap_btns_flex {
			max-width: min-content !important;
		}
		.scrollmap_btns_top .slider {
			max-width: 60px;
		}
	`;
	document.head.appendChild(baseStyle);

	const cssSets = [
		{
			id: "coordsOn",
			content: `
				.placeName {
					display: flex;
				}
				.place.disabled > .placeName {
					display: flex;
					color: #666;
				}
			`
		},
		{
			id: "coordsWithDisabled",
			content: `
				.place.disabled {
					opacity: 1 !important;
					display: flex;
					background-color: #aaa;
					background-image: none;
					box-shadow: inset 0px 0px 0px 1px #777;
				}
			`
		},
		{
			id: "countsOn",
			content: `
				.place-count {
					display: flex;
				}
				.place.disabled > .place-count {
					display: flex;
					color: #666;
				}
			`
		},
				{
			id: "deadsOn",
			content: `
				.place:has(.dead) {
					background-color: rgba(255,0,0,0.1) !important;
					background-image: none;
					opacity: 1 !important;
				}
			`
		}
	];

	function createStyleElement(id, content) {
		let el = document.getElementById(id);
		if (!el) {
			el = document.createElement("style");
			el.id = id;
			el.textContent = content;
			document.head.appendChild(el);
		}
		return el;
	}

	function createToggle(id, cssSetId, caption, faIcon) {
		const button = document.createElement("div");
		button.id = id;
		button.className = "yzToggleBtn scrollmap_button_wrapper";
		button.onclick = () => {
			const active = button.classList.toggle("active");
			toggleStyle(cssSets[cssSetId].id, cssSets[cssSetId].content);
		}
		const icon = document.createElement("i");
		icon.className = "scrollmap_icon fa6-solid";
		icon.classList.add(faIcon);
		icon.title = caption;
		button.appendChild(icon);
		return button;
	}

	async function addToggles() {
		const scrollBtnsHelp = await waitForElement("#map_container_info");
		const scrollmapBtns = scrollBtnsHelp.parentElement;

		const countToggle = createToggle("countToggle", 2, "count", "fa6-hashtag");
		const coordsToggle = createToggle("coordsToggle", 0, "coords", "fa6-map");
		const disabledTilesToggle = createToggle("disabledTilesToggle", 1, "disabled", "fa6-eye-slash");
		const deadPlacesToggle = createToggle("deadPlacesToggle", 3, "dead", "fa6-skull");

		const sliderDiv = document.createElement("div");
		sliderDiv.id = "yzFontSizeSlider";
		const slider = document.createElement("input");
		slider.type = "range";
		slider.className = "slider";
		slider.min = 0;
		slider.max = 48;
		slider.value = 16;
		sliderDiv.appendChild(slider);

		const placeStyle = createStyleElement("placeStyle", "");
		slider.oninput = () => {
			placeStyle.textContent = `.place { font-size: ${slider.value}px; }`;
		}

		scrollmapBtns.append(countToggle, coordsToggle, disabledTilesToggle, deadPlacesToggle, sliderDiv);
	}

	function toggleStyle(id, cssContent) {
		const el = document.getElementById(id);
		if (el) {
			el.remove();
		} else {
			createStyleElement(id, cssContent);
		}
	}

	function addPlaceName(place) {
		const spanId = place.id + "_name";
		let span = document.getElementById(spanId);
		if (!span) {
			span = document.createElement("span");
			span.className = "placeName";
			span.id = spanId;
			const coords = place.id.match(/(-?\d+)x(-?\d+)/);
			span.textContent = `${coords[1]}, ${-1 * parseInt(coords[2])}`;
			place.appendChild(span);
		}
	}

	async function waitForElement(selector) {
		while (!document.querySelector(selector)) {
			await new Promise(resolve => requestAnimationFrame(resolve));
		}
		return document.querySelector(selector);
	}

	const placesContainerObserver = new MutationObserver(placeChanges);

	function placeChanges(mutations) {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					addPlaceName(node);
				}
			});
		});
	}

	(async () => {
		const el = await waitForElement("#places_container");
		document.querySelectorAll(".place").forEach(addPlaceName);
		placesContainerObserver.observe(el, { childList: true, subtree: false });
		addToggles();
	})();
}
