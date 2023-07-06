// https://www.googleapis.com/storage/v1/b/zdb-shows/o

import getFilenameParts from "../utils/getFilenameParts"

export default async function (bucketName: string): Promise<FSS.Track[]> {
  const req = await fetch(`https://www.googleapis.com/storage/v1/b/${bucketName}/o`)
  const result = await req.json()

  return result.items.map((i: { name: string, mediaLink: string }) => ({
    ...getFilenameParts(i.name),
    src: i.mediaLink,
  }))
  .sort((a: FSS.Track, b: FSS.Track) => b.name.localeCompare(a.name))
}
