<script lang="ts">
    import { goto } from "$app/navigation";
    import { redirect } from "@sveltejs/kit";

    const onsubmit = async(e: SubmitEvent) => {
        e.preventDefault();
        
        const element = e.target as HTMLFormElement;
        const response = await fetch("/login", {
            method: "POST",
            body: new FormData(element),
        });

        const data = await response.json();

        if(!response.ok) {
            return;
        }

        if (data.data) {
            goto("/");
        }
    }
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="or logout" />
</svelte:head>

<div class="flex flex-col items-center">
	<h1>If you don't know, you don't belong here.</h1>
	<form method="post" class="form" {onsubmit}>
        <div>
            <label for="username">Username</label>
            <input id="username" name="username" type="text" />
        </div>
        <div>
            <label for="password">Password</label>
            <input id="password" name="password" type="password"  />
        </div>
        <button class="button" type="submit">Submit</button>
	</form>
</div>