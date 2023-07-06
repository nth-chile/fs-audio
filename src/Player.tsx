"use client"

import React, { useEffect, ReactNode, useState, useRef } from "react"
import getYearsListFromTracks from "./utils/getYearsListFromTracks";
import getDateAndVenueListFromTracks from "./utils/getDateAndVenueListFromTracks";
import getTrackListFromTracks from "./utils/getTrackListFromTracks";
import ensureLeadingSlashOnly from "./utils/ensureLeadingSlashOnly"
import getPathParts, { PathParts } from "./utils/getPathParts";
import { Howl } from "howler"
import millisecondsToMinutesAndSeconds from "./utils/millisecondsToMinutesAndSeconds"
import getDurationsForTracks from "./utils/getDurationsForTracks";

//   this.progressWidth =
//     Math.round(
//       e.target.currentTime * $('.player__bar').width() / e.target.duration
//     ) + 'px'

// on end, play next

// seek on mousedown
// seek: function seek(e) {
//   this.updateTime(e)
//   if (e.buttons == 1) {
//     this.elements.$player.find('.player__bar').on('mousemove', function(e) {
//       _this5.updateTime(e)
//       $(window).on('mouseup', function(e) {
//         _this5.elements.$player.find('.player__bar').off('mousemove')
//       })
//     })
//   }
// },

type PlayerProps = {
  basePath: string;
  data: FSS.Track[];
  title: string;
  yearsDirectory?: boolean;
}

export default function Player({
  data, title: titleFromProps, basePath, yearsDirectory = true
}: PlayerProps) {
  const [pathParts, setPathParts] = useState<PathParts>({})
  const baseHref = ensureLeadingSlashOnly(basePath)
  const [title, setTitle] = useState(titleFromProps)
  const [listItems, setListItems] = useState<any[]>([])
  const [howl, setHowl] = useState<Howl | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [userScrubPercent, setUserScrubPercent] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  // This is the index of element in listItems, not of props.data
  const [currentTrackListItemIndex, setCurrentTrackListItemIndex]= useState<number | null>(null)
  const [playerTitle, setPlayerTitle] = useState('')
  const [playerDate, setPlayerDate] = useState('')
  const [venue, setVenue] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const playbackInterval = useRef<any>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)
  const scrubberElapsedRef = useRef<HTMLDivElement>(null)

  function selectTrack(track: FSS.Track) {
    // @ts-ignore
    if (howl && howl._src === track.src) {
      return
    }

    if (howl) {
      clearInterval(playbackInterval.current)
      howl.unload()
      setHowl(null)
    }

    setElapsed(null)
    setDuration(null)
    setPlayerTitle(track.name)
    setPlayerDate(track.date)
    
    const newHowl = new Howl({
      autoplay: true,
      html5: true,
      onload() {
        setDuration(newHowl.duration())
      },
      onend() {
        setIsPlaying(false)
        clearInterval(playbackInterval.current)
        onNextClick()
      },
      onpause() {
        setIsPlaying(false)
        clearInterval(playbackInterval.current)
      },
      onplay() {
        setIsPlaying(true)
        const setElapsedTime = () => setElapsed(newHowl.seek())
        setElapsedTime()
        playbackInterval.current = setInterval(setElapsedTime, 900);
      },
      src: track.src
    })

    setHowl(newHowl)
  }

  function togglePausePlay() {
    if (!howl) return

    if (howl.playing()) {
      howl.pause()
    } else {
      howl.play()
    }
  }

  function goBack() {
    // URL without trailing slases
    let hash = window.location.hash.replace(/\/$/, '')

    if (pathParts.trackSlug) {
      // Remove /trackSlug from end of hash
      hash = hash.replace(new RegExp(`\/${pathParts.trackSlug}$`), '')
    } else if (pathParts.date) {
      // Replace date with year from end of hash
      hash = hash.replace(new RegExp(`${pathParts.date}$`), pathParts.year || '')
    } else if (pathParts.year) {
      // Remove /#/year from end of hash
      hash = hash.replace(new RegExp(`#\/${pathParts.year}$`), '')
    }
    
    location.hash = hash
  }

  useEffect(() => {
    const handleHashChange = () => setPathParts(getPathParts(location.hash))
    handleHashChange()
    addEventListener("hashchange", handleHashChange)

    return () => {
      removeEventListener("hashchange", handleHashChange)
    }
  }, [location.hash])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "A") {
        return
      }

      if (document.activeElement?.tagName === "BUTTON") {
        if (!document.activeElement.classList.contains("fsa-list-item-track")) {
          return
        }
      }

      if (e.code === 'Space' && !!howl) {
        togglePausePlay()
      }
    }

    addEventListener('keydown', handleKeydown)

    return () => {
      removeEventListener('keydown', handleKeydown)
    }
  }, [howl, isPlaying])

  useEffect(() => {
    if (yearsDirectory && !pathParts.year && !pathParts.date) {
      setListItems(getYearsListFromTracks(baseHref, data))
    } else if ((!yearsDirectory || pathParts.year) && !pathParts.date) {
      const listItems = getDateAndVenueListFromTracks(baseHref, yearsDirectory, pathParts.year || "", data)
      setListItems(listItems)
    } else if (pathParts.date) {
      const tracklist = getTrackListFromTracks(baseHref, yearsDirectory, pathParts.date, data)
      setListItems(tracklist)
      getDurationsForTracks(tracklist).then(setListItems);
      
      const listItemWithVenue = tracklist.find(i => i.venue)
      setVenue(listItemWithVenue && listItemWithVenue.venue ? listItemWithVenue.venue : '')
    }
  }, [baseHref, pathParts])

  useEffect(() => {
    let newTitle = pathParts.date || (yearsDirectory && pathParts.year)

    if (newTitle && venue) {
      newTitle = `${newTitle} @ ${venue}`
    }
    
    if (!newTitle) {
      newTitle = titleFromProps
    }

    setTitle(newTitle)
  }, [pathParts, yearsDirectory, venue])

  useEffect(() => {
    if (typeof userScrubPercent === "number") {
      if (scrubberElapsedRef.current) {
        scrubberElapsedRef.current.style.width = userScrubPercent + "%";
      }
  
      if (howl) {
        setElapsed((userScrubPercent / 100) * howl.duration())
        howl.seek((userScrubPercent / 100) * howl.duration())
      }
    }
  }, [userScrubPercent])

  useEffect(() => {
    if (scrubberElapsedRef.current && elapsed && duration) {
      scrubberElapsedRef.current.style.width = (elapsed / duration) * 100 + "%";
    }
  }, [elapsed, duration])

  function onBtnMouseDown (e: React.MouseEvent<HTMLButtonElement>) {
    if (e.target instanceof HTMLElement) {
      e.target.classList.add("fsa-player-button--pressed")
    }
  }

  function onBtnMouseUp (e: React.MouseEvent<HTMLButtonElement>) {
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove("fsa-player-button--pressed")
    }
  }

  function onScrubberMousedown (e: React.MouseEvent<HTMLDivElement>) {
    const zeroPos = scrubberRef.current?.getBoundingClientRect().left;
    const total = scrubberRef.current?.getBoundingClientRect().width;

    if (!zeroPos || !total) {
      return
    }

    setUserScrubPercent(((e.clientX - zeroPos) / total) * 100)
  }

  function onPrevClick () {
    if (typeof currentTrackListItemIndex !== "number") {
      return
    }

    if (currentTrackListItemIndex === 0 && isPlaying) {
      howl?.seek(0)
    } else if (listItems[currentTrackListItemIndex - 1]?.isTrack) {
      const newIndex = currentTrackListItemIndex - 1
      setCurrentTrackListItemIndex(newIndex)
      selectTrack(listItems[newIndex])
    }
  }

  function onNextClick () {
    if (
      typeof currentTrackListItemIndex === "number" && 
      currentTrackListItemIndex < listItems.length - 1 &&
      currentTrackListItemIndex + 1 &&
      listItems[currentTrackListItemIndex + 1]?.isTrack
    ) {
      const newIndex = currentTrackListItemIndex + 1
      setCurrentTrackListItemIndex(newIndex)
      selectTrack(listItems[newIndex])
    }
  }

  function onListItemClick (listItemIndex: number) {
    setCurrentTrackListItemIndex(listItemIndex)
    selectTrack(listItems[listItemIndex])
  }

  return (
    <div className={`fsa-container ${!howl && "fsa-container--player-hidden"}`}>
      <header>
        <button onClick={goBack}>«</button>
        <h1>{title}</h1>
      </header>
      <ul className="fsa-list">
        {listItems.map((i, listItemIndex) => (
          <li className="fsa-list-item" key={`${i.date}${i.venue}${i.year}${i.name}`}>
            {i.isTrack && (
              <button className="fsa-list-item-track" onClick={() => onListItemClick(listItemIndex)}>
                <div className="fsa-list-item-left">
                  <span className="fsa-list-item-name">{i.name}</span>
                </div>
                <div className="fsa-list-item-duration">{i.duration}</div>
              </button>
            )}
            {!i.isTrack && (
              <a href={i.href}>
                <div className="fsa-list-item-left">
                  <span className="fsa-list-item-name">{i.date}{i.venue && ` @ ${i.venue}`}{i.year}</span>
                </div>
              </a>
            )}
          </li>
        ))}
      </ul>
      <div className="fsa-player">
        <div className="fsa-player-buttons">
          <button
            className="fsa-player-button fsa-player-button-prev"
            onMouseDown={onBtnMouseDown}
            onMouseUp={onBtnMouseUp}
            onClick={onPrevClick}
          >
            <svg fill="currentColor" role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"></path></svg>
          </button>
          <button
            className="fsa-player-button fsa-player-button-play"
            onMouseDown={onBtnMouseDown}
            onMouseUp={onBtnMouseUp}
            onClick={togglePausePlay}
          >
            {isPlaying && <svg fill="currentColor" role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M3 2h3v12H3zm7 0h3v12h-3z"></path></svg>}
            {!isPlaying && <svg fill="currentColor" role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M4.018 14L14.41 8 4.018 2z"></path></svg>}
          </button>
          <button
            className="fsa-player-button fsa-player-button-next"
            onMouseDown={onBtnMouseDown}
            onMouseUp={onBtnMouseUp}
            onClick={onNextClick}
          >
            <svg fill="currentColor" role="img" height="16" width="16" viewBox="0 0 16 16"><path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"></path></svg>
          </button>
        </div>
        <div className="fsa-player-other-stuff">
          <div className="fsa-player-metadata">
            <div>
              <span className="fsa-player-title">{playerTitle}</span>
              <span className="fsa-player-date">{playerDate}</span>
              <span className="fsa-player-venue">{venue}</span>
            </div>
            <div className="fsa-player-time">{ elapsed ? millisecondsToMinutesAndSeconds(elapsed * 1000) : "--:--" } / { duration ? millisecondsToMinutesAndSeconds(duration * 1000) : "--:--" }</div>
          </div>
          <div
            className="fsa-player-scrubber"
            onMouseDown={onScrubberMousedown}
            ref={scrubberRef}
          >
            <div className="fsa-player-scrubber-elapsed" ref={scrubberElapsedRef}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
