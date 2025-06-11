// ==UserScript==
// @name          BGA Carcassonne coordinates
// @description   Adds toggles to display  coordinates in legal placement spots and show currently hidden spots as well.
// @match         https://*.boardgamearena.com/archive/replay/*
// @match         https://*.boardgamearena.com/*/carcassonne*
// @icon          https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace     https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL   https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL    https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL   https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/toggle-coords.user.js
// @version       0.2.0
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
		}
		.placename {
			color: #aaa;
			display: none;
			font-size: 11px;
		}
		#coords-toggles {
			bottom: 5px;
			display: flex;
			flex-direction: column;
			gap: 5px;
			left: 5px;
			position: absolute;
		}
		.coords-toggle-btn {
			background: #d3d3d3;
			border: 1px solid #aaa;
			border-radius: 8px;
			color: #333;
			cursor: pointer;
			font-size: 11px;
			padding: 3px;
			transition: background 0.3s, color 0.3s;
			width: 85px;
		}
		.coords-toggle-btn.active {
			background: #89b58b;
			border-color: #74a476;
			color: white;
		}
		.slider {
			-webkit-appearance: none;
			appearance: none;
			height: 1em;
			background: #d3d3d3;
			border-radius: 8px;
			outline: none;
			-webkit-transition: .2s;
			transition: opacity .2s;
			width: 85px;
		}
		.slider::-webkit-slider-thumb, .slider::-moz-range-thumb {
			-webkit-appearance: none;
			appearance: none;
			background: #89b58b;
			border-color: #74a476;
			cursor: pointer;
			height: 1em;
			width: 1em;
		}
	`;
	document.head.appendChild(baseStyle);

	const cssSets = [
		{
			id: "coordsOn",
			content: `
				.placename {
					display: flex;
				}
				.place.disabled > .placename {
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

	function addToggles() {
		const toggleDiv = document.createElement("div");
		toggleDiv.id = "coords-toggles";

		const coordsToggle = document.createElement("button");
		coordsToggle.textContent = "Show Coords";
		coordsToggle.className = "coords-toggle-btn";
		coordsToggle.onclick = () => {
			const active = coordsToggle.classList.toggle("active");
			coordsToggle.textContent = active ? "Hide Coords" : "Show Coords";
			toggleStyle(cssSets[0].id, cssSets[0].content);
		};

		const disabledTilesToggle = document.createElement("button");
		disabledTilesToggle.textContent = "Show disabled";
		disabledTilesToggle.className = "coords-toggle-btn";
		disabledTilesToggle.onclick = () => {
			const active = disabledTilesToggle.classList.toggle("active");
			disabledTilesToggle.textContent = active ? "Hide disabled" : "Show disabled";
			toggleStyle(cssSets[1].id, cssSets[1].content);
		};

		const slider = document.createElement("input");
		slider.type = "range";
		slider.id = "slider";
		slider.className = "slider";
		slider.min = 8;
		slider.max = 24;
		slider.value = 12;
		slider.width = "100%";

		const placenameStyle = createStyleElement("placename-style", "");
		slider.oninput = () => {
			placenameStyle.textContent = `.placename { font-size: ${slider.value}px; }`;
		}

		toggleDiv.appendChild(coordsToggle);
		toggleDiv.appendChild(disabledTilesToggle);
		toggleDiv.appendChild(slider);
		document.getElementById("map_container").appendChild(toggleDiv);
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
			span.className = "placename";
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
