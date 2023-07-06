"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const getYearsListFromTracks_1 = __importDefault(require("./utils/getYearsListFromTracks"));
const getDateAndVenueListFromTracks_1 = __importDefault(require("./utils/getDateAndVenueListFromTracks"));
const getTrackListFromTracks_1 = __importDefault(require("./utils/getTrackListFromTracks"));
const ensureLeadingSlashOnly_1 = __importDefault(require("./utils/ensureLeadingSlashOnly"));
const getPathParts_1 = __importDefault(require("./utils/getPathParts"));
const howler_1 = require("howler");
const millisecondsToMinutesAndSeconds_1 = __importDefault(require("./utils/millisecondsToMinutesAndSeconds"));
const getDurationsForTracks_1 = __importDefault(require("./utils/getDurationsForTracks"));
function Player({ data, title: titleFromProps, basePath, yearsDirectory = true }) {
    const [pathParts, setPathParts] = (0, react_1.useState)({});
    const baseHref = (0, ensureLeadingSlashOnly_1.default)(basePath);
    const [title, setTitle] = (0, react_1.useState)(titleFromProps);
    const [listItems, setListItems] = (0, react_1.useState)([]);
    const [howl, setHowl] = (0, react_1.useState)(null);
    const [elapsed, setElapsed] = (0, react_1.useState)(null);
    const [userScrubPercent, setUserScrubPercent] = (0, react_1.useState)(null);
    const [duration, setDuration] = (0, react_1.useState)(null);
    // This is the index of element in listItems, not of props.data
    const [currentTrackListItemIndex, setCurrentTrackListItemIndex] = (0, react_1.useState)(null);
    const [playerTitle, setPlayerTitle] = (0, react_1.useState)('');
    const [playerDate, setPlayerDate] = (0, react_1.useState)('');
    const [venue, setVenue] = (0, react_1.useState)('');
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const playbackInterval = (0, react_1.useRef)(null);
    const scrubberRef = (0, react_1.useRef)(null);
    const scrubberElapsedRef = (0, react_1.useRef)(null);
    function selectTrack(track) {
        // @ts-ignore
        if (howl && howl._src === track.src) {
            return;
        }
        if (howl) {
            clearInterval(playbackInterval.current);
            howl.unload();
            setHowl(null);
        }
        setElapsed(null);
        setDuration(null);
        setPlayerTitle(track.name);
        setPlayerDate(track.date);
        const newHowl = new howler_1.Howl({
            autoplay: true,
            html5: true,
            onload() {
                setDuration(newHowl.duration());
            },
            onend() {
                setIsPlaying(false);
                clearInterval(playbackInterval.current);
                onNextClick();
            },
            onpause() {
                setIsPlaying(false);
                clearInterval(playbackInterval.current);
            },
            onplay() {
                setIsPlaying(true);
                const setElapsedTime = () => setElapsed(newHowl.seek());
                setElapsedTime();
                playbackInterval.current = setInterval(setElapsedTime, 900);
            },
            src: track.src
        });
        setHowl(newHowl);
    }
    function togglePausePlay() {
        if (!howl)
            return;
        if (howl.playing()) {
            howl.pause();
        }
        else {
            howl.play();
        }
    }
    function goBack() {
        // URL without trailing slases
        let hash = window.location.hash.replace(/\/$/, '');
        if (pathParts.trackSlug) {
            // Remove /trackSlug from end of hash
            hash = hash.replace(new RegExp(`\/${pathParts.trackSlug}$`), '');
        }
        else if (pathParts.date) {
            // Replace date with year from end of hash
            hash = hash.replace(new RegExp(`${pathParts.date}$`), pathParts.year || '');
        }
        else if (pathParts.year) {
            // Remove /#/year from end of hash
            hash = hash.replace(new RegExp(`#\/${pathParts.year}$`), '');
        }
        location.hash = hash;
    }
    (0, react_1.useEffect)(() => {
        const handleHashChange = () => setPathParts((0, getPathParts_1.default)(location.hash));
        handleHashChange();
        addEventListener("hashchange", handleHashChange);
        return () => {
            removeEventListener("hashchange", handleHashChange);
        };
    }, [location.hash]);
    (0, react_1.useEffect)(() => {
        const handleKeydown = (e) => {
            var _a, _b;
            if (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.tagName) === "A") {
                return;
            }
            if (((_b = document.activeElement) === null || _b === void 0 ? void 0 : _b.tagName) === "BUTTON") {
                if (!document.activeElement.classList.contains("fsa-list-item-track")) {
                    return;
                }
            }
            if (e.code === 'Space' && !!howl) {
                togglePausePlay();
            }
        };
        addEventListener('keydown', handleKeydown);
        return () => {
            removeEventListener('keydown', handleKeydown);
        };
    }, [howl, isPlaying]);
    (0, react_1.useEffect)(() => {
        if (yearsDirectory && !pathParts.year && !pathParts.date) {
            setListItems((0, getYearsListFromTracks_1.default)(baseHref, data));
        }
        else if ((!yearsDirectory || pathParts.year) && !pathParts.date) {
            const listItems = (0, getDateAndVenueListFromTracks_1.default)(baseHref, yearsDirectory, pathParts.year || "", data);
            setListItems(listItems);
        }
        else if (pathParts.date) {
            const tracklist = (0, getTrackListFromTracks_1.default)(baseHref, yearsDirectory, pathParts.date, data);
            setListItems(tracklist);
            (0, getDurationsForTracks_1.default)(tracklist).then(setListItems);
            const listItemWithVenue = tracklist.find(i => i.venue);
            setVenue(listItemWithVenue && listItemWithVenue.venue ? listItemWithVenue.venue : '');
        }
    }, [baseHref, pathParts]);
    (0, react_1.useEffect)(() => {
        let newTitle = pathParts.date || (yearsDirectory && pathParts.year);
        if (newTitle && venue) {
            newTitle = `${newTitle} @ ${venue}`;
        }
        if (!newTitle) {
            newTitle = titleFromProps;
        }
        setTitle(newTitle);
    }, [pathParts, yearsDirectory, venue]);
    (0, react_1.useEffect)(() => {
        if (typeof userScrubPercent === "number") {
            if (scrubberElapsedRef.current) {
                scrubberElapsedRef.current.style.width = userScrubPercent + "%";
            }
            if (howl) {
                setElapsed((userScrubPercent / 100) * howl.duration());
                howl.seek((userScrubPercent / 100) * howl.duration());
            }
        }
    }, [userScrubPercent]);
    (0, react_1.useEffect)(() => {
        if (scrubberElapsedRef.current && elapsed && duration) {
            scrubberElapsedRef.current.style.width = (elapsed / duration) * 100 + "%";
        }
    }, [elapsed, duration]);
    function onBtnMouseDown(e) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.add("fsa-player-button--pressed");
        }
    }
    function onBtnMouseUp(e) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove("fsa-player-button--pressed");
        }
    }
    function onScrubberMousedown(e) {
        var _a, _b;
        const zeroPos = (_a = scrubberRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().left;
        const total = (_b = scrubberRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().width;
        if (!zeroPos || !total) {
            return;
        }
        setUserScrubPercent(((e.clientX - zeroPos) / total) * 100);
    }
    function onPrevClick() {
        var _a;
        if (typeof currentTrackListItemIndex !== "number") {
            return;
        }
        if (currentTrackListItemIndex === 0 && isPlaying) {
            howl === null || howl === void 0 ? void 0 : howl.seek(0);
        }
        else if ((_a = listItems[currentTrackListItemIndex - 1]) === null || _a === void 0 ? void 0 : _a.isTrack) {
            const newIndex = currentTrackListItemIndex - 1;
            setCurrentTrackListItemIndex(newIndex);
            selectTrack(listItems[newIndex]);
        }
    }
    function onNextClick() {
        var _a;
        if (typeof currentTrackListItemIndex === "number" &&
            currentTrackListItemIndex < listItems.length - 1 &&
            currentTrackListItemIndex + 1 &&
            ((_a = listItems[currentTrackListItemIndex + 1]) === null || _a === void 0 ? void 0 : _a.isTrack)) {
            const newIndex = currentTrackListItemIndex + 1;
            setCurrentTrackListItemIndex(newIndex);
            selectTrack(listItems[newIndex]);
        }
    }
    function onListItemClick(listItemIndex) {
        setCurrentTrackListItemIndex(listItemIndex);
        selectTrack(listItems[listItemIndex]);
    }
    return (react_1.default.createElement("div", { className: `fsa-container ${!howl && "fsa-container--player-hidden"}` },
        react_1.default.createElement("header", null,
            react_1.default.createElement("button", { onClick: goBack }, "\u00AB"),
            react_1.default.createElement("h1", null, title)),
        react_1.default.createElement("ul", { className: "fsa-list" }, listItems.map((i, listItemIndex) => (react_1.default.createElement("li", { className: "fsa-list-item", key: `${i.date}${i.venue}${i.year}${i.name}` },
            i.isTrack && (react_1.default.createElement("button", { className: "fsa-list-item-track", onClick: () => onListItemClick(listItemIndex) },
                react_1.default.createElement("div", { className: "fsa-list-item-left" },
                    react_1.default.createElement("span", { className: "fsa-list-item-name" }, i.name)),
                react_1.default.createElement("div", { className: "fsa-list-item-duration" }, i.duration))),
            !i.isTrack && (react_1.default.createElement("a", { href: i.href },
                react_1.default.createElement("div", { className: "fsa-list-item-left" },
                    react_1.default.createElement("span", { className: "fsa-list-item-name" },
                        i.date,
                        i.venue && ` @ ${i.venue}`,
                        i.year)))))))),
        react_1.default.createElement("div", { className: "fsa-player" },
            react_1.default.createElement("div", { className: "fsa-player-buttons" },
                react_1.default.createElement("button", { className: "fsa-player-button fsa-player-button-prev", onMouseDown: onBtnMouseDown, onMouseUp: onBtnMouseUp, onClick: onPrevClick },
                    react_1.default.createElement("svg", { fill: "currentColor", role: "img", height: "16", width: "16", viewBox: "0 0 16 16" },
                        react_1.default.createElement("path", { d: "M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z" }))),
                react_1.default.createElement("button", { className: "fsa-player-button fsa-player-button-play", onMouseDown: onBtnMouseDown, onMouseUp: onBtnMouseUp, onClick: togglePausePlay },
                    isPlaying && react_1.default.createElement("svg", { fill: "currentColor", role: "img", height: "16", width: "16", viewBox: "0 0 16 16" },
                        react_1.default.createElement("path", { d: "M3 2h3v12H3zm7 0h3v12h-3z" })),
                    !isPlaying && react_1.default.createElement("svg", { fill: "currentColor", role: "img", height: "16", width: "16", viewBox: "0 0 16 16" },
                        react_1.default.createElement("path", { d: "M4.018 14L14.41 8 4.018 2z" }))),
                react_1.default.createElement("button", { className: "fsa-player-button fsa-player-button-next", onMouseDown: onBtnMouseDown, onMouseUp: onBtnMouseUp, onClick: onNextClick },
                    react_1.default.createElement("svg", { fill: "currentColor", role: "img", height: "16", width: "16", viewBox: "0 0 16 16" },
                        react_1.default.createElement("path", { d: "M11 3v4.119L3 2.5v11l8-4.619V13h2V3z" })))),
            react_1.default.createElement("div", { className: "fsa-player-other-stuff" },
                react_1.default.createElement("div", { className: "fsa-player-metadata" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "fsa-player-title" }, playerTitle),
                        react_1.default.createElement("span", { className: "fsa-player-date" }, playerDate),
                        react_1.default.createElement("span", { className: "fsa-player-venue" }, venue)),
                    react_1.default.createElement("div", { className: "fsa-player-time" },
                        elapsed ? (0, millisecondsToMinutesAndSeconds_1.default)(elapsed * 1000) : "--:--",
                        " / ",
                        duration ? (0, millisecondsToMinutesAndSeconds_1.default)(duration * 1000) : "--:--")),
                react_1.default.createElement("div", { className: "fsa-player-scrubber", onMouseDown: onScrubberMousedown, ref: scrubberRef },
                    react_1.default.createElement("div", { className: "fsa-player-scrubber-elapsed", ref: scrubberElapsedRef }))))));
}
exports.default = Player;
