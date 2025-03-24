import jwt from "jsonwebtoken";
import { error, type Actions } from "@sveltejs/kit";
import { SVELTE_USERNAME, SVELTE_PASSWORD, JWT_STATUS_ID, JWT_SIGNING_SECRET,
} from "$env/static/private";

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();

        const username = data.get("username");
        const password = data.get("password");

        if (username !== SVELTE_USERNAME || password !== SVELTE_PASSWORD) {
            return error(401, { message: "Unauthorized." });
        }

        const token = jwt.sign({ status: JWT_STATUS_ID }, JWT_SIGNING_SECRET);

        event.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
            path: "/",
        });

        return { success: true };
    },
} satisfies Actions;
