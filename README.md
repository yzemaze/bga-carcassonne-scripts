# Carcassonne scripts
Some improvements of BGA’s Carcassonne UI.

## Just show me …
![screenshot-board](/img/screenshot-board.png?raw=true)
1) <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/highlight-discards.user.js">Highlight discard messages</a> in the log.
2) <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/highlight-discards.user.js">Show discarded tiles</a> permanently.
3) <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/log-tiles-fix.user.styl">Fix distorted tiles</a> in the log (and if desired align them to the right).
4) <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/tile-borders.user.styl">Border width and colors</a> for last placed tiles.
5) <a href="https://github.com/yzemaze/bga-scripts/raw/main/starting-player-tag.user.js">Starting player icon</a> (not limited to Carcassonne!).

## More useful scripts
1) Replace second edition tiles everywhere with the <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/original-tiles.user.styl">original tiles</a>.
2) <a href="https://github.com/yzemaze/bga-carcassonne-scripts/raw/main/mobile-condensed-playerboards.user.styl">Shrink playerboards on mobile devices</a> or smaller windows (<= 960 px). (With 640 px wide windows you can watch all duels of a WTCOC match on 2 screens. ;) )
3) <a href="https://github.com/yzemaze/bga-scripts/raw/main/replay-with-keys.user.js">keyboard support for replays</a>
4) <a href="https://github.com/yzemaze/bga-scripts/raw/main/game-logs-decluttered.user.styl">decluttered game logs</a> (say goodbye to friends’ status spam …)

## Prerequisites
<a href="https://violentmonkey.github.io/">Violentmonkey</a> or the like for .user.js-files. <a href="/highlight-discards.user.js">highlight-discards.user.js</a> has a tiny config section. Please edit the discard string according to the language you use on BGA.
<a href="https://github.com/openstyles/stylus#readme">Stylus</a> or some other way to apply .user.styl-files. Config is done within Stylus:

![screenshot-stylus.png](/img/screenshot-stylus.png?raw=true)

## Problems? Ideas?
All scripts were designed and tested for 2p-Carcassonne without expansions. They should work fine with more players and expansions, though. Some edges might still be rough (cf. version numbers ;) ). So if you encounter any problems please let me know. Either open an issue or contact me on BGA. Same goes if you’d like to see specific improvements.
