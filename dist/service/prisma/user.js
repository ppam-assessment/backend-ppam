import { Status } from "@prisma/client";
import prisma from "../../config/prisma.js";
export const getUserByEmail = async ({ email }) => {
    const user = await prisma.users.findFirst({
        where: {
            email
        }
    });
    return user;
};
export const getUserByName = async ({ username }) => {
    const user = await prisma.users.findFirst({
        where: {
            username
        }
    });
    return user;
};
export const createUser = async ({ id, username, institute, email, password, status = Status.viewer }) => {
    const user = await prisma.users.create({
        data: {
            id,
            username,
            institute,
            email,
            password,
            status
        }
    });
    return user;
};
export const validateUserRole = async ({ id, status }) => {
    const user = await prisma.users.findFirstOrThrow({
        where: {
            id,
            status
        }
    });
    if (user === null || user === void 0 ? void 0 : user.id) {
        return true;
    }
    else {
        return false;
    }
};
