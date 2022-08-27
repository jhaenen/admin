<script lang="ts">
    // Framework
    import { onMount } from "svelte";

    // Types
    import type { Game, Poule, Stats } from "@/types/types";

    // Components
    import Loader from "@/components/load-ball.svelte";
    import Result from "@/components/result.svelte";
    import Standings from "@/components/standings.svelte";
    import GenGames from "@/modal/gen_games.svelte";
    import TeamManager from "@/modal/team_manager.svelte";
    import SVG from 'svelte-inline-svg';

    // Assets
    import GenIcon from '@/assets/icons/rotate_arrows.svg';
    import TeamIcon from '@/assets/icons/group.svg';

    let poule: Poule;
    let games: Array<Game> = [];
    let stats: Array<Stats> = [];

    let error = false;
    let loaded = false;

    export let params = {id: -1};

    async function load_stats() {
        const server = import.meta.env.VITE_API_URL;

        // Get stats from server
        try {
            const g_resp = await fetch(server + "games/" + params.id);
            games = await g_resp.json();
            console.log(games);

            const p_resp = await fetch(server + "poules/" + params.id);
            poule = await p_resp.json();

            const s_resp = await fetch(server + "stats/" + params.id);
            stats = await s_resp.json();

            loaded = true;
        } catch (err) {
            error = true;
            console.error(err);
        }
    }

    onMount(async () => await load_stats());

    let hide_gen_games = true;
    let hide_team_manager = true;
</script>

<template>
    <div class="flex flex-col items-center m-4"><!-- lg:items-start lg:text-left -->
        {#if loaded && !error}
            <!-- Title -->
            <h1 class="text-[12vw] leading-none font-light text-center border-b-2 py-[5px] mi:text-5xl lg:py-5 lg:w-full lg:bg-white lg:sticky lg:top-0 sm:my-2 sm:border-b-0 sm:underline sm:underline-offset-[10px] sm:decoration-2 z-10" style={"text-decoration-color:" + poule.color + ";border-color:" + poule.color}>
                Poule: {poule.name}
            </h1>

            <div class="flex flex-col lg:flex-row-reverse gap-x-10 gap-y-4 m-4">
                <div class="lg:w-[320px]">
                    <div class="flex flex-col items-center lg:items-start gap-y-3 w-screen lg:w-auto px-4 lg:sticky lg:top-20">
                        <!-- Poule standings -->
                        <div class="flex flex-col items-center lg:flex-row lg:w-full justify-between lg:bg-white lg:sticky lg:top-20">
                            <span class="font-light text-3xl">Stand</span>
                            <div class="flex items-center hover:cursor-pointer" on:click={() => hide_team_manager = false}><span class="text-xs mb-0.5">Team beheer</span><SVG src={TeamIcon} class="w-4 h-4 mx-2"/></div>
                        </div>
                        <Standings standings={stats}/>
                    </div>
                </div>

                <div class="flex flex-col items-center lg:items-start gap-y-5 lg:w-[380px]">
                    <!-- Poule games -->
                    <div class="flex flex-col items-center lg:flex-row lg:w-full justify-between lg:bg-white lg:sticky lg:top-20 z-10">
                        <span class="font-light text-3xl">Wedstrijden</span>
                        <div class="flex items-center hover:cursor-pointer" class:hidden={stats.length == 0} on:click={() => hide_gen_games = false}><span class="text-xs mb-0.5">Genereer wedstrijden</span><SVG src={GenIcon} class="w-4 h-4 mx-2"/></div>
                    </div>
                    {#each games as game (game.id)}
                    <Result gameID={game.id} team1={game.team1} team2={game.team2} time={game.time.substring(0, 5)} court_num={game.court_num} ref={game.ref} on:reload={() => load_stats()}/>
                    {:else}
                        <p>Geen wedstrijden gepland.</p>
                    {/each}
                </div>
            </div>

            <GenGames poule={poule.id} bind:hidden={hide_gen_games} on:reload={() => load_stats()}/>
            <TeamManager poule={poule.id} bind:hidden={hide_team_manager} on:reload={() => load_stats()}/>
        {:else}
            <!-- Loader -->
            <Loader {error}/>
        {/if}       
    </div>
</template>