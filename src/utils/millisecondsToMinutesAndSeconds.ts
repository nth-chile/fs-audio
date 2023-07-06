export default function (ms: number) {
  const s = Math.floor((ms / 1000) % 60).toString().padStart(2, '0')
  const m = Math.floor(ms / 1000 / 60).toString().padStart(2, '0')

  return `${m}:${s}`
}