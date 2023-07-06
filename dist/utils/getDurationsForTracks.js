"use strict";
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
const millisecondsToMinutesAndSeconds_1 = __importDefault(require("./millisecondsToMinutesAndSeconds"));
function getDuration(src) {
    return __awaiter(this, void 0, void 0, function* () {
        const audio = new Audio();
        audio.src = src;
        const duration = yield new Promise(resolve => {
            audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
        });
        if (typeof duration !== "number") {
            return undefined;
        }
        return (0, millisecondsToMinutesAndSeconds_1.default)(duration * 1000);
    });
}
function default_1(tracks) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Promise.all(tracks.map((i) => __awaiter(this, void 0, void 0, function* () {
            const result = Object.assign({}, i);
            const duration = yield getDuration(i.src);
            if (duration) {
                result.duration = duration;
            }
            return result;
        })));
        return result;
    });
}
exports.default = default_1;
