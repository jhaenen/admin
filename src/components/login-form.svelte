<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let username = "";
    export let password = "";
    export let error = "";

    const dispatch = createEventDispatcher();

    function checkEnter(e: KeyboardEvent) {
        if (e.key === "Enter") {
            submit();
        }
    }

    function submit() {
        dispatch('login', {
			username: username,
            password: password
		});
    }
</script>

<template>
    <div class="flex flex-col items-center w-screen sm:p-10 sm:w-fit gap-y-2 sm:border border-gray-400 rounded-md">
        <h1 class="my-4 font-light text-4xl">Administrator tool</h1>
        <div>
            <div class="font-bold text-sm">Gebruiker</div>
            <div><input type="text" bind:value={username} class="my-1 px-2 ml-0.5 w-80 h-10 bg-slate-50 border border-gray-400 rounded accent-primary" on:keydown={checkEnter}/></div>
        </div>

        <div>
            <div class="font-bold text-sm">Wachtwoord</div>
            <div><input type="password" bind:value={password} class="my-1 px-2 ml-0.5 w-80 h-10 bg-slate-50 border border-gray-400 rounded accent-primary" on:keydown={checkEnter}/></div>
        </div>

        <div class="w-full text-rose-600 text-sm">{error}</div>

        <div class="mt-2"><button class="w-80 ml-0.5 h-11 rounded text-stone-50 bg-primary active:bg-primary-active" on:click={submit}>Login</button></div>
    </div>
</template>