// ==UserScript==
// @name         BGA Carcassonne auto-zoom
// @description  Automatically change map_surface size to maximum available space after each placement and then use BGA’s zoom feature (End button)
// @match        https://*.boardgamearena.com/archive/replay/*
// @match        https://*.boardgamearena.com/*/carcassonne*
// @icon         https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace    https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL  https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL   https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL  https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/auto-zoom.user.js
// @version      0.5.6
// @author       yzemaze
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

"use strict";
// block execution if window width is greater than threshold (px)
const WIDTH_THRESHOLD = 1920;
// keep n px clear space around the map for superimposed images, scoreboards, cameras etc.
// use negative values to force empty spaces being cut off or (partially) invisible
const MARGIN = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
}
const AUTO_CENTER = true;

if (document.querySelector(".bgagame-carcassonne") && window.innerWidth <= WIDTH_THRESHOLD) {

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

	function getFieldSize() {
		const elements = document.querySelectorAll('[id^="place_"]');
		let minX = -1, maxX = 1, minY = -1, maxY = 1;

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

		let _a, _b;
		const defaultEdge = 89;
		const el = (_a = document.getElementById("map_scrollable")) == null ? void 0 : _a;
		const scale = (_b = el.style.transform.match(/scale\((\d+(\.\d+)?)\)/)) == null ? 1 : parseFloat(_b[1]);
		return [maxX - minX + 1, maxY - minY + 1, defaultEdge*scale];
	}

	function moveScrollmapButtons(parentEl) {
		const scrollmapBtns = document.getElementById("map_container_info").parentElement;
		if (scrollmapBtns) {
			if (scrollmapBtns.dataset.moved === true) return;
			parentEl.appendChild(scrollmapBtns);
			createStyleElement("yzScrollMapBtnStyle", `
				.scrollmap_icon {
					background-color: transparent;
				}
				svg.maximize-height {
					height: 15px;
					width: 15px;
				}
				#yzMapFooter .scrollmap_btns_flex {
					position: fixed;
					bottom: 0;
					display: grid;
					grid-template-columns: repeat(6, 1fr);
					grid-gap: 5px;
					padding: 10px;
					width: min-content;
				}
				#yzMapFooter #map_container_info {
					display: none;
				}
				#yzMapFooter svg.maximize_height {
					height: 20px;
				}
				#yzMapFooter div.scrollmap_button_wrapper:nth-child(n+8):nth-child(-n+11) {
					grid-row-start: 2;
					grid-column: span 1;
				}
				#yzMapFooter div.scrollmap_button_wrapper:nth-child(n+12):nth-child(-n+15) {
					grid-row-start: 3;
					grid-column: span 1;
				}
				#yzFontSizeSlider {
					grid-row-start: 3;
					grid-column: span 2;
				}
			`);
			scrollmapBtns.dataset.moved = true;
		}
	}

	function createToggle(id, caption, faIcon) {
		const button = document.createElement("div");
		button.id = id;
		button.className = "yzToggleBtn scrollmap_button_wrapper";
		button.style.cursor = "pointer";
		button.onclick = () => {
			const active = button.classList.toggle("active");
		}
		const icon = document.createElement("i");
		icon.className = "scrollmap_icon fa6-solid";
		icon.classList.add(faIcon);
		icon.title = caption;
		button.appendChild(icon);
		return button;
	}

	function addToggle() {
		const scrollBtnsHelp = document.getElementById("map_container_info");
		const scrollmapBtns = scrollBtnsHelp.parentElement;
		const zoomToggle = createToggle("zoomToggle", "auto-zoom", "fa6-wand-sparkles");
		zoomToggle.classList.toggle("active");
		scrollmapBtns.append(zoomToggle);
	}

	function setMapHeight() {
		const browserZoom = window.devicePixelRatio;
		const mc = document.getElementById("map_container");
		const mcBCR = mc.getBoundingClientRect();
		const deductionX = MARGIN.left + MARGIN.right;
		let deductionY = MARGIN.bottom + mcBCR.top;
		let dfBox;
		if (dfBox = document.getElementById("dfBox")) {
			const dfBoxBCR = dfBox.getBoundingClientRect();
			// keep clear of dfBox if it has horizontal orientation or is in the bottom middle (between cams)
			if (document.querySelector("#dfBox.horizontal") || (mcBCR.width / 4 < dfBoxBCR.left && dfBoxBCR.top > mcBCR.height * 3/4)) {
				deductionY += dfBoxBCR.height;
			}
			// create backdrop for dfBox with same background as mapContainer
			// move toggle buttons there, too
			let mapFooter;
			if (!(mapFooter = document.getElementById("yzMapFooter"))) {
				mapFooter = document.createElement("div");
				mapFooter.id = "yzMapFooter";
				mapFooter.style.height = `${dfBoxBCR.height}px`;
				moveScrollmapButtons(mapFooter);
				const pageContent = document.getElementById("page-content");
				pageContent.appendChild(mapFooter);
			}
		}
		const height = window.innerHeight - deductionY;
		const lsBCR = document.getElementById("left-side").getBoundingClientRect();
		const width = lsBCR.width - deductionX;
		const mcStyle = createStyleElement("yzMapContainerStyle");
		// vars might change => set outside of creation
		mcStyle.textContent = `
			#map_container {
				margin: ${MARGIN.top}px ${MARGIN.right}px ${MARGIN.bottom}px ${MARGIN.left}px;
				--scrollmap_height: ${height}px !important;
				width: ${width}px;
			}
		`;
	}

	function bgaZoomToFit() {
		document.querySelector("div.zoomtofit.scrollmap_button_wrapper").click();
	}

	function bgaCenter() {
		document.querySelector("div.reset.scrollmap_button_wrapper").click();
	}

	const mainTitleObserver = new MutationObserver(() => {
		const mustPlayATile = document.getElementById("titlearg1");
		if (!mustPlayATile || !document.getElementById("zoomToggle").classList.contains("active")) {
			return;
		}

		// only execute after previous move is done
		const [fieldWidth, fieldHeight, edge] = getFieldSize();
		const mcBCR = document.getElementById("map_container").getBoundingClientRect();
		setMapHeight();
		if (fieldWidth * edge > mcBCR.width || fieldHeight * edge > mcBCR.height) {
			bgaZoomToFit();
		} else if (AUTO_CENTER) {
			bgaCenter();
		}
	});

	window.onload = (event) => {
		setMapHeight();
		bgaCenter();
		addToggle();
		mainTitleObserver.observe(document.getElementById("pagemaintitletext"), {
			childList: true,
			subtree: true
		});
	};
}
