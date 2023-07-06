// GUI query builder: https://archive.org/advancedsearch.php

import qs from "qs"

type CollectionOrCreatorItems = Array<{
  date: string;
  identifier: string;
  title: string;
  year: string;
}>

const FIELDS_TO_INCLUDE = [
  "date",
  "identifier",
  "title",
  "year"
]

/** Get all the items in a collection. Collections must be created by IA admins */
async function getCollectionItems(collectionId: string): Promise<CollectionOrCreatorItems> {
  const queryObj = {
    q: `collection:${collectionId}`,
    fl: FIELDS_TO_INCLUDE,
    sort: ['year desc'],
    output: 'json'
  }

  const queryString = qs.stringify(queryObj, { arrayFormat: "brackets" })
  const query = `https://archive.org/advancedsearch.php?${queryString}`
  const req = await fetch(query)
  const json = await req.json()

  return json.response.docs
}

/** Get all the items with a specified creator field. Creator isn't the username of the uploader.
 * It's a field you can set to whatever you want. We can use it as a unique ID that lets us
 * fetch a group of items that belong in the Community Audio collection */
async function getCreatorItems(creator: string): Promise<CollectionOrCreatorItems> {
  const queryObj = {
    q: `creator:${creator}`,
    fl: FIELDS_TO_INCLUDE,
    sort: ['year desc'],
    output: 'json'
  }

  const queryString = qs.stringify(queryObj, { arrayFormat: "brackets" })
  const query = `https://archive.org/advancedsearch.php?${queryString}`
  const req = await fetch(query)
  const json = await req.json()

  return json.response.docs
}

// async function getItem(itemId: string, includeFileFormats: [string]): Promise<FSS.Track> {
//   const req = await fetch(`https://archive.org/metadata/${itemId}`)
//   let json = await req.json()

//   json = json.filter(i => {
//     if(!i.track || !i.metadata.date || i.metadata.venue) {

//     }
//   })

//   return {
//     json.files
//       .filter((i: FSS.Track) => includeFileFormats.includes(i.format))
//       .sort((a: FSS.Track, b: FSS.Track) => (a.track || a.name).localeCompare((b.track || b.name))),
//     date: json.metadata.date,
//     trackNumber: json.track,
//     venue: json.metadata.venue
//   }
// }

// export async function getDataByCollection(id: string, includeFileFormats: [string]) {
//   const collectionItems = await getCollectionItems(id)

//   const result = await Promise.all(
//     collectionItems.map(collectionItem => getItem(collectionItem.identifier, includeFileFormats))
//   )

//   return result
// }

// export async function getDataByCreator(id: string, includeFileFormats: [string]) {
//   const collectionItems = getCollectionItems
// }