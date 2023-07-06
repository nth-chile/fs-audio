"use strict";
// https://www.googleapis.com/storage/v1/b/zdb-shows/o
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
const getFilenameParts_1 = __importDefault(require("../utils/getFilenameParts"));
function default_1(bucketName) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = yield fetch(`https://www.googleapis.com/storage/v1/b/${bucketName}/o`);
        const result = yield req.json();
        return result.items.map((i) => (Object.assign(Object.assign({}, (0, getFilenameParts_1.default)(i.name)), { src: i.mediaLink })))
            .sort((a, b) => b.name.localeCompare(a.name));
    });
}
exports.default = default_1;
