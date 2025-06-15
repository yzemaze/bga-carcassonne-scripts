// ==UserScript==
// @name          BGA Carcassonne highlight discarded tiles
// @description   Highlights a discard in the log and displays discarded tiles permanently.
// @match         https://*.boardgamearena.com/archive/replay/*
// @match         https://*.boardgamearena.com/*/carcassonne*
// @icon          https://x.boardgamearena.net/data/themereleases/231110-1000/img/logo/logo.png
// @namespace     https://github.com/yzemaze/bga-carcassonne-scripts/
// @homepageURL   https://github.com/yzemaze/bga-carcassonne-scripts/
// @supportURL    https://github.com/yzemaze/bga-carcassonne-scripts/issues
// @downloadURL   https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/highlight-discards.user.js
// @version       0.4.0
// @author        yzemaze
// @license       GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

// The script should work fine for replays and live games. Due to early gamelog
// entries being wiped in specific cases, it doesn’t function reliably in
// turn-based games, as spectator or when refreshing your game. I couldn’t
// figure out when exactly this happens. It seems to be a restriction applied
// after a specific number of moves or elapsed time. Please beware of this
// issue and use the script with caution.

"use strict";
if (document.querySelector(".bgagame-carcassonne")) {
	// CONFIG
	// change official translations in discardMsgs or add to them
	// cf. https://boardgamearena.com/translation?module_id=1&source_locale=en_US&dest_locale=en_US&findtype=all&find=cannot%20play%20and%20discards
	const discardMsgs = ["cannot play and discards", "kann das Plättchen nicht anlegen und wirft es ab"];
	// adjust to your preference
	const discardText = "Discarded: ";
	const highlightColor = "yellow";
	// CONFIG END

	let style = document.createElement("style");
	style.id = "discardStyle";
	style.innerHTML = `
		#discard_block {
			display: none;
			align-items: center;
		}
		#discard_block .tile_art {
			display: inline-block;
			position: relative;
			margin: 0 0 0 2px;
			height: 40px !important;
			width: 40px !important;
		}
	`;
	document.head.append(style);

	const discardDiv = document.createElement("div");
	discardDiv.id = "discard_block";
	const discardSpan = document.createElement("span");
	discardSpan.append(discardText);

	const logObserver = new MutationObserver(() => {
		discardDiv.textContent = "";
		discardDiv.append(discardSpan);
		const logMsgs = document.getElementsByClassName("log_replayable");
		for (const logMsg of logMsgs) {
			if (discardMsgs.some(d => logMsg.textContent.includes(d))) {
				logMsg.childNodes[0].setAttribute("style", `background-color: ${highlightColor};`);
				const discardTile = logMsg.getElementsByClassName("tile_art")[0].cloneNode(true);
				discardDiv.style.display = "flex";
				discardDiv.append(discardTile);
				document.querySelector("#remainingblock").append(discardDiv);
			}
		}
	});

	async function waitForElement(selector) {
	  while (!document.querySelector(selector)) {
	    await new Promise(resolve => requestAnimationFrame(resolve));
	  }
	  return document.querySelector(selector);
	}

	(async () => {
	  const el = await waitForElement("#logs");
	  logObserver.observe(el, {
	    childList: true,
	  });
	})();
}
