"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var axios_1 = __importDefault(require("axios"));
var Utils = __importStar(require("./utils"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var thingiverse = axios_1.default.create({
    baseURL: 'https://api.thingiverse.com/',
    timeout: 10000,
    headers: { 'authorization': "Bearer " + process.env.THINGIVERSE_TOKEN }
});
var bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN || '');
bot.start(function (ctx) { return ctx.reply('Welcome!'); });
bot.help(function (ctx) { return ctx.reply('Check available options tapping right side button'); });
/* ---Gets LIKES from selected user--- */
bot.command('likes', function (ctx) {
    var _a;
    var userName = Utils.removeCmd((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text);
    if (userName != undefined) {
        ctx.reply("⏳ Loading your likes...");
        thingiverse.get("users/" + userName + "/likes")
            .then(function (response) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, element;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            ctx.reply("❤️ These are your likes");
                            _i = 0, _a = response.data;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            element = _a[_i];
                            return [4 /*yield*/, ctx.replyWithPhoto(element.thumbnail, { caption: "\uD83C\uDFF7 " + element.name + "\n\u2764\uFE0F " + element.like_count + "\n\uD83C\uDF10 " + element.public_url + "\n" })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            ctx.reply("🏁 That's all!");
                            return [2 /*return*/];
                    }
                });
            });
        })
            .catch(function (error) {
            return ctx.reply("Couldn't retrieve yout likes 🤷‍♂️");
        });
    }
    else
        ctx.reply("Username was not specified 🤭");
});
/* ---Gets all COLLECTIONS from selected user--- */
bot.command('collections', function (ctx) {
    var _a;
    ctx.reply("⏳ Loading your collections...");
    var username = Utils.removeCmd((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text);
    // Make a request for a user with a given ID
    if (username != undefined) {
        thingiverse.get("users/" + username + "/collections")
            .then(function (response) {
            var bigarray = response.data;
            var collectionArrays = [];
            var size = 2;
            for (var i = 0; i < bigarray.length; i += size) {
                collectionArrays.push(bigarray.slice(i, i + size));
            }
            var collections = telegraf_1.Markup.inlineKeyboard(collectionArrays.map(function (it) {
                return it.map(function (it) { return telegraf_1.Markup.callbackButton(it.name, it.id); });
            })).extra();
            return ctx.reply("📚 These are your colletions", collections);
        })
            .catch(function (error) {
            return ctx.reply("Couldn't retrieve yout collections 🤷‍♂️");
        });
    }
    else
        ctx.reply("Username was not specified 🤭");
});
bot.launch();
