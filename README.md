# Carcassonne scripts
Some improvements of BGA’s Carcassonne UI.

## Just show me …
![screenshot-board](/img/screenshot-board.png?raw=true)
1. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/highlight-discards.user.js">Highlight discard messages</a> in the log.
2. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/highlight-discards.user.js">Show discarded tiles</a> permanently.
3. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/log-tiles-fix.user.styl">Fix distorted tiles</a> in the log (and if desired align them to the right – obsolete since update 07/2024).
4. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/tile-borders.user.styl">Border width and colors</a> for last placed tiles.
5. <a href="https://github.com/yzemaze/bga-scripts/raw/main/starting-player-tag.user.js">Starting player icon</a> (obsolete for Carcassonne since update 07/2024).

## More useful scripts
1. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/original-tiles.user.styl">Original tiles</a> everywhere, even in replays!
2. [Carcassonne tile draw probabilities](https://github.com/yzemaze/carcassonne-probabilities)
3. [BGA duel finder](https://github.com/yzemaze/bga-duel-finder)
4. <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/mobile-condensed-playerboards.user.styl">Shrink playerboards on mobile devices</a> or smaller windows (<= 960 px). (With some browser zooming you could watch up to 6 Carcassonne games on one Full HD screen. ;-) )
5. [Replay to top-carcassonner.com](https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/replay-to-top-carcassonner.user.js)
6. <a href="https://github.com/yzemaze/bga-scripts/raw/main/replay-with-keys.user.js">keyboard support for replays</a>
7. <a href="https://github.com/yzemaze/bga-scripts/raw/main/game-logs-decluttered.user.styl">decluttered game logs</a> (say goodbye to friends’ status spam …)
8. <a href="https://github.com/yzemaze/bga-scripts/raw/main/toggle-coords.user.js">show coordinates</a> in empty spaces. Useful for notation purposes or just to talk with others about a game and be able to pinpoint positions. Buttons are added to BGA’s scrollmap button panel.
9. <a href="https://github.com/yzemaze/bga-scripts/raw/main/auto-zoom.user.js">auto center & zoom</a> if you’re tired of zooming yourself. This script fires once per move and it’s possible to deactivate it from BGA’s scrollmap button panel. Setting (top, right, bottom, left) margins for the map-container is supported, so the playing area would only ever expand to a defined size staying clear of specific areas defined by you.

## Prerequisites
<a href="https://violentmonkey.github.io/">Violentmonkey</a> (Tampermonkey, Greasemonkey) or any other way to execute .user.js-files. Some scripts have a tiny config section. Please check the source after the UserStyle section during installation. E.g. <a href="/highlight-discards.user.js">highlight-discards.user.js</a> needs the discard string of the language you use on BGA.
<a href="https://github.com/openstyles/stylus#readme">Stylus</a> or some other way to apply .user.styl-files. Config is done within Stylus:

![screenshot-stylus.png](/img/screenshot-stylus.png?raw=true)

## Problems? Ideas?
All scripts were designed and tested for 2p-Carcassonne without expansions. Most should work fine with more players and expansions, though. Some edges might still be rough (cf. version numbers ;) ). If you encounter any problems please let me know. Either open an issue or contact me on BGA. Same goes if you’d like to see specific improvements.
