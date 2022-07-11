<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Modal from "./modal.svelte";

    export let poule = 0;

    export let hidden = true;

    const dispatch = createEventDispatcher();

    interface GameGen {
        poule: number;
        time: string;
        interval: number;
        court: number;
    }

    let game_gen: GameGen = {
        poule: poule,
        time: "12:00",
        interval: 15,
        court: 1
    };

    async function gen_games() {
        const server = import.meta.env.VITE_SERVER_URL;

        try {
            await fetch(server + "/admin/gen_games", {
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
        <div class="flex flex-col items-end w-fit mx-auto sm:flex-row gap-4">
            <div><span>Tijd: </span><input type="time" class="my-1 px-2 ml-0.5 w-30 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" bind:value={game_gen.time} /></div>
            <div><span>Interval: </span><input type="number" class="my-1 px-2 ml-0.5 w-20 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" min="1" max="100" bind:value={game_gen.interval}/></div>
            <div><span>Veld: </span><input type="number" class="my-1 px-2 ml-0.5 w-20 h-10 text-center bg-slate-50 border border-gray-400 rounded accent-primary" min="1" max="3" bind:value={game_gen.court}/></div>
            <div><button class="my-1 px-2 ml-3 w-30 h-10 text-center rounded text-stone-50 bg-primary active:bg-primary-active" on:click={() => {gen_games()}}>Genereer</button></div>
        </div>
    </Modal>
</template>