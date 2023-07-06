import millisecondsToMinutesAndSeconds from "./millisecondsToMinutesAndSeconds";

async function getDuration(src: string): Promise<string | undefined> {
  const audio = new Audio();
  audio.src = src;
  
  const duration = await new Promise(resolve => {
    audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
  });

  if (typeof duration !== "number") {
    return undefined
  }

  return millisecondsToMinutesAndSeconds(duration * 1000)
}


export default async function (tracks: FSS.Track[]) : Promise<FSS.Track[]> {
  const result = await Promise.all(
    tracks.map(async i => {
      const result = { ...i }
  
      const duration = await getDuration(i.src)

      if (duration) {
        result.duration = duration
      }

      return result
    })
  )

    return result
}