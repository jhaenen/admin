<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    // Types
    import type { Poule } from "@/types/types";

    // Components
    import Loader from "@/components/load-ball.svelte";
    import Modal from "./modal.svelte";
    import Toggle from "@/components/toggle.svelte";

    let poule1 = 0;
    let poule2 = 0;

    export let hidden = true;

    const dispatch = createEventDispatcher();

    interface GameGen {
        poule1: number;
        poule2: number;
        time: string;
        interval: number;
        court1: number;
        court2: number;
    }

    let game_gen: GameGen = {
        poule1: poule1,
        poule2: poule2,
        time: "12:00",
        interval: 15,
        court1: 1,
        court2: 2,
    };

    let poules: Array<Poule> = [];

    let error = false;
    let msg = "";

    onMount(async () => {
        const server = import.meta.env.VITE_API_URL;

        // Get poules from server
        try {
            const response = await fetch(server + "poules");
            poules = await response.json();
            game_gen.poule1 = poules[0].id;
            game_gen.poule2 = poules[1].id;
        } catch (err) {
            error = true;
            console.error(err);
        }
    });

    async function gen_games() {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        try {
             const response = await fetch(server + "gen_grouped", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game_gen),
            });

            if(!response.ok) {
                error = true;
                const msgObj = await response.json();
                msg = msgObj.msg;
            } else {
                error = false;
                hidden = true;
            }
        } catch (err) {
            error = true;
            console.error(err);
        }

        
    }
</script>

<template>
    <Modal title="Genereer wedstrijden" bind:hidden>
        <div class="flex flex-col items-center w-fit mx-auto gap-4">
            <div><span>Poule 1: </span>
                <select bind:value={game_gen.poule1} class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary">
                    {#each poules as poule (poule.id)}
                        <option value={poule.id}>{poule.name}</option>
                    {/each}
                </select>
            </div>
            <div><span>Poule 2: </span>
                <select bind:value={game_gen.poule2} class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary">
                    {#each poules as poule (poule.id)}
                        <option value={poule.id}>{poule.name}</option>
                    {/each}
                </select>
            </div>
            <div><span>Tijd: </span><input type="time" class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" bind:value={game_gen.time} /></div>
            <div><span>Interval: </span><input type="number" class="my-1 px-2 ml-0.5 w-20 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" min="1" max="100" bind:value={game_gen.interval}/></div>
            <!-- Error message -->
            {#if error}
                {#if msg === ""}
                    <div class="text-red-500">Er is iets misgegaan met het ophalen van de poules</div>
                {:else}
                    <div class="text-red-500">{msg}</div>
                {/if}
            {/if}
            <div><button class="my-1 px-2 ml-3 w-30 h-10 text-center rounded text-stone-50 bg-primary active:bg-primary-active" on:click={() => {gen_games()}}>Genereer</button></div>
        </div>
    </Modal>
</template>