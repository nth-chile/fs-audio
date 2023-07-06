"use strict";
// GUI query builder: https://archive.org/advancedsearch.php
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const FIELDS_TO_INCLUDE = [
    "date",
    "identifier",
    "title",
    "year"
];
/** Get all the items in a collection. Collections must be created by IA admins */
function getCollectionItems(collectionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryObj = {
            q: `collection:${collectionId}`,
            fl: FIELDS_TO_INCLUDE,
            sort: ['year desc'],
            output: 'json'
        };
        const queryString = qs_1.default.stringify(queryObj, { arrayFormat: "brackets" });
        const query = `https://archive.org/advancedsearch.php?${queryString}`;
        const req = yield fetch(query);
        const json = yield req.json();
        return json.response.docs;
    });
}
/** Get all the items with a specified creator field. Creator isn't the username of the uploader.
 * It's a field you can set to whatever you want. We can use it as a unique ID that lets us
 * fetch a group of items that belong in the Community Audio collection */
function getCreatorItems(creator) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryObj = {
            q: `creator:${creator}`,
            fl: FIELDS_TO_INCLUDE,
            sort: ['year desc'],
            output: 'json'
        };
        const queryString = qs_1.default.stringify(queryObj, { arrayFormat: "brackets" });
        const query = `https://archive.org/advancedsearch.php?${queryString}`;
        const req = yield fetch(query);
        const json = yield req.json();
        return json.response.docs;
    });
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
