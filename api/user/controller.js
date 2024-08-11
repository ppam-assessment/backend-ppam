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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createUserSchema, loginUserSchema } from "./schema.js";
import { createUser, getUserByEmail, getUserByName } from "../../service/prisma/user.js";
import { addSession } from "../../service/prisma/session.js";
import getNextDay from "../../utils/lib/timePeriod.js";
export function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, username, password, exp, sessionId, user, _b, _c, isMatch, _d, token;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    loginUserSchema.safeParse(req.body);
                    _a = req.body, email = _a.email, username = _a.username, password = _a.password;
                    return [4 /*yield*/, getNextDay()];
                case 1:
                    exp = _e.sent();
                    sessionId = uuidv4();
                    if (!email) return [3 /*break*/, 3];
                    return [4 /*yield*/, getUserByEmail({ email: email })];
                case 2:
                    _b = _e.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!username) return [3 /*break*/, 5];
                    return [4 /*yield*/, getUserByName({ username: username })];
                case 4:
                    _c = _e.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _c = undefined;
                    _e.label = 6;
                case 6:
                    _b = _c;
                    _e.label = 7;
                case 7:
                    user = _b;
                    _d = user;
                    if (!_d) return [3 /*break*/, 9];
                    return [4 /*yield*/, bcrypt.compare(password, user.password)];
                case 8:
                    _d = (_e.sent());
                    _e.label = 9;
                case 9:
                    isMatch = _d;
                    if (!user || !isMatch) {
                        return [2 /*return*/, res.code(401).send({
                                message: 'Invalid email or password.',
                            })];
                    }
                    token = req.jwt.sign({
                        id: sessionId,
                        username: user.username,
                        institute: (user === null || user === void 0 ? void 0 : user.institute) || undefined,
                        status: user.status,
                    });
                    return [4 /*yield*/, addSession({ id: sessionId, userId: user.id, token: token, exp: exp })];
                case 10:
                    _e.sent();
                    return [2 /*return*/, res.code(200).send({
                            message: 'Login success.',
                            data: {
                                accessToken: token
                            }
                        }).setCookie('access_token', token, {
                            path: '/',
                            httpOnly: true,
                            secure: false,
                            expires: exp
                        })];
            }
        });
    });
}
export function createUserController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, username, password, status, institute, id, sessionId, hashedPassword, exp, user, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    createUserSchema.safeParse(req.body);
                    _a = req.body, email = _a.email, username = _a.username, password = _a.password, status = _a.status, institute = _a.institute;
                    id = uuidv4();
                    sessionId = uuidv4();
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 1:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, getNextDay()];
                case 2:
                    exp = _b.sent();
                    return [4 /*yield*/, createUser({ id: id, username: username, institute: institute, email: email, password: hashedPassword, status: status })];
                case 3:
                    user = _b.sent();
                    token = req.jwt.sign({
                        id: sessionId,
                        username: user.username,
                        institute: (user === null || user === void 0 ? void 0 : user.institute) || undefined,
                        status: user.status,
                    });
                    return [4 /*yield*/, addSession({ id: sessionId, userId: user.id, token: token, exp: exp })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, res.code(201).send({
                            message: "User created.",
                            data: {
                                accessToken: token
                            }
                        }).setCookie('access_token', token, {
                            path: '/',
                            httpOnly: true,
                            secure: false,
                            expires: exp
                        })];
            }
        });
    });
}
export function logoutController(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.setCookie('access_token', 'invalid', {
                path: '/',
                httpOnly: true,
                secure: false,
                expires: new Date(Date.now())
            });
            return [2 /*return*/];
        });
    });
}
