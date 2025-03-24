<script lang="ts">
    import { redirect } from "@sveltejs/kit";

    let status: "none" | "failed" = $state("none")
    let responseData: { username: string; signupLink: string } | undefined  = $state();

    const onsubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const element = e.target as HTMLFormElement;
        const response = await fetch("/", {
            method: "POST",
            body: new FormData(element),
        });

        const data = await response.json();

        if(!response.ok) {
            status = "failed";
            return;
        }
        
        if (data.data) {
            const json = JSON.parse(data.data);
            responseData = {username: json[1], signupLink: json[2]};
            status = "none";
        }
    };
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="hi" />
</svelte:head>

<section class="flex flex-col items-center">
    <h1>Identity Registration</h1>
    <span class="italic">(pretend this is a Google Forms)</span>
    <form method="post" class="form" action="/login" {onsubmit}>
        <div>
            <label for="type">What are you here for?</label>
            <select id="type" name="type" class="select">
                <option value="developer">Developer</option>
                <option value="sre">Site Reliability Engineer (SRE)</option>
            </select>
        </div>
        <div>
            <label for="firstName">What is your first name?</label>
            <input id="firstName" name="firstName" type="text" />
        </div>
        <div>
            <label for="lastName">What is your last name?</label>
            <input id="lastName" name="lastName" type="text" />
        </div>
        <div>
            <label for="email">What is your email?</label>
            <input id="email" name="email" type="email" />
        </div>
        <button class="button" type="submit">Submit</button>
    </form>
    {#if status === "failed"}
    <span>
        Request failed! Please try again.
    </span>
    {/if}
    {#if responseData}
        <div class="flex flex-col gap-2 border-2 m-2 p-4">
            <span>Success! Here are the details you will need to login (SAVE THEM: YOU WILL ONLY SEE THESE ONCE):</span>
            <span>username: <strong>{responseData.username}</strong></span>
            <span>login page:
                <a href={responseData.signupLink} target="_blank">
                    <strong>{responseData.signupLink}</strong>
                </a>
            </span>
            <span>Once there, you can finalize your account after verifying your email, and creating a password.</span>
        </div>
    {/if}
</section>

<style>
    a:visited {
        color: purple;
    }

    strong {
        text-decoration: underline;
    }
</style>