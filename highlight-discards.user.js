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
// @version       0.3.1
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

	const discardDiv = document.createElement("div");
	discardDiv.setAttribute("id", "discard_block");
	discardDiv.style.display = "none";
	const discardSpan = document.createElement("span");
	discardSpan.append(discardText);
	const discardStyle = {
		display: "inline-block",
		position: "relative",
		left: "auto",
		top: "5px",
		margin: "2px 0 0 2px",
	};

	const logObserver = new MutationObserver(() => {
		discardDiv.textContent = '';
		discardDiv.append(discardSpan);
		const logMsgs = document.getElementsByClassName("log_replayable");
		for (const logMsg of logMsgs) {
			if (discardMsgs.some(d => logMsg.textContent.includes(d))) {
				logMsg.childNodes[0].setAttribute("style", `background-color: ${highlightColor};`);
				const discardTile = logMsg.getElementsByClassName("tile_art")[0].cloneNode(true);
				Object.assign(discardTile.style, discardStyle);
				// current tile size changes when zooming
				const tileSize = document.getElementById("tile_art_current").style.height;
				discardTile.style.height = tileSize;
				discardTile.style.width = tileSize;
				discardDiv.style.display = "block";
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
