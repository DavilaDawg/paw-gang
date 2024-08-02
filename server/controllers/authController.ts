import jwt from "jsonwebtoken"

const SUPER_SECRET_KEY: string = "yolo"
const blockedList: Set<string>= new Set(); 
interface Session {
    expiresAt: number,
    userId: string,
}

export const createSession = (username: string): string => {
    const expiry: Date = new Date();
    expiry.setMonth(expiry.getMonth() + 1)

    const newSession : Session = { 
        expiresAt: expiry.valueOf(),
        userId: username,
    }

    return jwt.sign(newSession, SUPER_SECRET_KEY)
}

export const getSession = (token: string): Session | undefined => {
    if (blockedList.has(token)) return undefined

    try {
        const decoded = jwt.verify(token, SUPER_SECRET_KEY) as Session

        if (decoded.expiresAt < Date.now()) {
            console.log("Token has expired.")
            return undefined
        }

        return decoded
    } catch (error) {
        console.error("Invalid token:", error);
        return undefined;
    }
}

export const destroySession = (token: string): void => {
    blockedList.add(token)
}
