import jwt from "jsonwebtoken";
import { redirect, type Handle } from "@sveltejs/kit";
import { JWT_SIGNING_SECRET, JWT_STATUS_ID } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {

    if (event.url.pathname === "/login") {
        const response = await resolve(event, {});
        return response;
    }

    const token = event.cookies.get("token") ?? null;

    if (token == null) {
        return redirect(307, "/login");
    }

    try {
        const result = jwt.verify(token, JWT_SIGNING_SECRET);
		
        if ((result as jwt.JwtPayload).status === JWT_STATUS_ID) {
            const response = await resolve(event, {});
            return response;
        } else {
            return redirect(307, "/login");
        }
    } catch (err) {
        return redirect(307, "/login");
    }
};
