<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    // Types
    import type { Poule } from "@/types/types";

    // Components
    import Loader from "@/components/load-ball.svelte";
    import Modal from "./modal.svelte";
import Toggle from "@/components/toggle.svelte";

    let poule = 0;

    export let hidden = true;
    export let court: number;

    const dispatch = createEventDispatcher();

    interface GameGen {
        poule: number;
        time: string;
        interval: number;
        court: number;
        full: boolean;
        use_ref: boolean;
    }

    let game_gen: GameGen = {
        poule: poule,
        time: "12:00",
        interval: 15,
        court: -1,
        full: false,
        use_ref: false,
    };

    let poules: Array<Poule> = [];

    let error = false;

    onMount(async () => {
        const server = import.meta.env.VITE_API_URL;

        // Get poules from server
        try {
            const response = await fetch(server + "poules");
            poules = await response.json();
            game_gen.poule = poules[0].id;
        } catch (err) {
            error = true;
            console.error(err);
        }
    });

    async function gen_games() {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        game_gen.court = court;

        console.log(JSON.stringify(game_gen))

        try {
            await fetch(server + "gen_games", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game_gen),
            })
        } catch (err) {
            console.error(err);
        }

        hidden = true;
        dispatch("reload");
    }
</script>

<template>
    <Modal title="Genereer wedstrijden" bind:hidden>
        <div class="flex flex-col items-center w-fit mx-auto sm:flex-row gap-4">
            <div><span>Poule: </span>
                <select bind:value={game_gen.poule} class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary">
                    {#each poules as poule (poule.id)}
                        <option value={poule.id}>{poule.name}</option>
                    {/each}
                </select>
            </div>
            <div><span>Tijd: </span><input type="time" class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" bind:value={game_gen.time} /></div>
            <div><span>Interval: </span><input type="number" class="my-1 px-2 ml-0.5 w-20 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" min="1" max="100" bind:value={game_gen.interval}/></div>
            <div class="flex flex-row items-center gap-2"><span>Volledig: </span><Toggle bind:checked={game_gen.full}/></div>
            <div class="flex flex-row items-center gap-2"><span>Scheidsen: </span><Toggle bind:checked={game_gen.use_ref}/></div>
            <div><button class="my-1 px-2 ml-3 w-30 h-10 text-center rounded text-stone-50 bg-primary active:bg-primary-active" on:click={() => {gen_games()}}>Genereer</button></div>
        </div>
    </Modal>
</template>