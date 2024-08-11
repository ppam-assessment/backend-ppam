import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createUserSchema, loginUserSchema } from "./schema.js";
import { createUser, getUserByEmail, getUserByName } from "../../service/prisma/user.js";
import { addSession } from "../../service/prisma/session.js";
import getNextDay from "../../utils/lib/timePeriod.js";
export async function loginController(req, res) {
    loginUserSchema.safeParse(req.body);
    const { email, username, password } = req.body;
    const exp = await getNextDay();
    const sessionId = uuidv4();
    const user = email ?
        await getUserByEmail({ email })
        : username ?
            await getUserByName({ username })
            : undefined;
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!user || !isMatch) {
        return res.code(401).send({
            message: 'Invalid email or password.',
        });
    }
    const token = req.jwt.sign({
        id: sessionId,
        username: user.username,
        institute: (user === null || user === void 0 ? void 0 : user.institute) || undefined,
        status: user.status,
    });
    await addSession({ id: sessionId, userId: user.id, token, exp });
    return res.code(200).send({
        message: 'Login success.',
        data: {
            accessToken: token
        }
    }).setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: false,
        expires: exp
    });
}
export async function createUserController(req, res) {
    createUserSchema.safeParse(req.body);
    const { email, username, password, status, institute } = req.body;
    const id = uuidv4();
    const sessionId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const exp = await getNextDay();
    const user = await createUser({ id, username, institute, email, password: hashedPassword, status });
    const token = req.jwt.sign({
        id: sessionId,
        username: user.username,
        institute: (user === null || user === void 0 ? void 0 : user.institute) || undefined,
        status: user.status,
    });
    await addSession({ id: sessionId, userId: user.id, token, exp });
    return res.code(201).send({
        message: "User created.",
        data: {
            accessToken: token
        }
    }).setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: false,
        expires: exp
    });
}
export async function logoutController(req, res) {
    res.setCookie('access_token', 'invalid', {
        path: '/',
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now())
    });
}
