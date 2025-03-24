import {
    GROUP_ADMINISTRATORS_ID,
    GROUP_DEVELOPERS_ID,
    IDENTITY_STORE_ID,
} from "$env/static/private";
import {
    CreateGroupMembershipCommand,
    CreateUserCommand,
    Identitystore,
} from "@aws-sdk/client-identitystore";
import { utility } from "$lib/utility";
import type { Actions } from "@sveltejs/kit";

const client = new Identitystore({ apiVersion: "v2", region: "us-east-1" });

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();

        const type = data.get("type");
        const firstName = data.get("firstName");
        const lastName = data.get("lastName");
        const email = data.get("email");

        if (type !== "sre" && type !== "developer") {
            return;
        }

        if (!firstName || !lastName || !email) {
            return;
        }

        const username = `${type}-${utility.randomString(16)}`;
        const createUser = new CreateUserCommand({
            IdentityStoreId: IDENTITY_STORE_ID,
            DisplayName: `${firstName} ${lastName}`,
            UserName: username,
            Name: {
                GivenName: `${firstName} ${lastName}`,
                FamilyName: `${firstName} ${lastName}`,
            },
            Emails: [
                { Primary: true, Type: "string", Value: email.toString() },
            ],
        });

        const responseUser = await client.send(createUser);

        let groupId: string;
        switch (type) {
            case "developer":
                groupId = GROUP_DEVELOPERS_ID;
                break;
            case "sre":
                groupId = GROUP_ADMINISTRATORS_ID;
                break;
        }

        const attachUser = new CreateGroupMembershipCommand({
            IdentityStoreId: IDENTITY_STORE_ID,
            GroupId: groupId,
            MemberId: { UserId: responseUser.UserId } as any,
        });

        const responseAttach = await client.send(attachUser);

        return {
            username: username,
            signupLink: `https://${IDENTITY_STORE_ID}.awsapps.com/start`,
        };
    },
} satisfies Actions;
