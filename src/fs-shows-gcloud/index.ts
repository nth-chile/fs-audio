// https://www.googleapis.com/storage/v1/b/zdb-shows/o

import getFilenameParts from "../utils/getFilenameParts";

export default async function (bucketName: string): Promise<FSS.Track[]> {
  const req = await fetch(
    `https://www.googleapis.com/storage/v1/b/${bucketName}/o`
  );
  const result = await req.json();

  return result.items
    .filter((i: { contentType: string }) => i.contentType === "audio/mpeg")
    .map((i: { name: string; mediaLink: string }) => {
      // Select the filename, ignoring any path before it
      let name = i.name;
      const lastSlashIndex = name.lastIndexOf("/");

      if (lastSlashIndex !== -1) {
        name = name.substring(lastSlashIndex + 1);
      }

      return {
        ...getFilenameParts(name),
        src: i.mediaLink,
      };
    })
    .sort((a: FSS.Track, b: FSS.Track) => b.name.localeCompare(a.name));
}
