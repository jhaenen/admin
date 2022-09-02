<script lang="ts">
    import GenGames from "@/modal/gen_games.svelte";
    import GenGrouped from "@/modal/gen_grouped.svelte";

    let hide_gen_games = true;
    let hide_gen_grouped = true;
</script>

<template>
    <div class="flex flex-col items-center m-4 gap-y-8">
        <!-- Title -->
        <h1 class="my-2 font-light text-5xl">Velden</h1>

        <!-- Poule list -->
        <div class="flex flex-col items-center w-fit gap-y-6">
            <div class="relative border-2 p-3 rounded-lg border-slate-500 w-full text-center text-2xl font-bold hover:cursor-pointer" on:click={() => hide_gen_grouped = false}>
                Veld 1/2
            </div>

            <div class="relative border-2 p-3 rounded-lg border-slate-500 w-full text-center text-2xl font-bold hover:cursor-pointer" on:click={() => hide_gen_games = false}>
                Veld 3
            </div>
        </div>

        <GenGames bind:hidden={hide_gen_games}/>
        <GenGrouped bind:hidden={hide_gen_grouped}/>
    </div>
</template>