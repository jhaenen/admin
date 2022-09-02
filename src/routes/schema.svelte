<script lang="ts">
    // Framework
    import { onMount } from "svelte";

    // Types
    import type { Game } from "@/types/types";

    // Components
    import Result from "@/components/result.svelte";
    import Loader from "@/components/load-ball.svelte";

    interface TimeSlot {
        time: string;
        games: Array<Game>;
    }

    let gamesSorted: Array<TimeSlot> = [];

    let error = false;
    let loaded = false;

    async function loadGames() {
        const server = import.meta.env.VITE_API_URL;

        // Get games from server
        try {
            const response = await fetch(server + "games/sorted");
            gamesSorted = await response.json();
            error = false;
            loaded = true;
        } catch (err) {
            error = true;
            console.error(err);
        }
    }

    onMount(async () => await loadGames());

</script>

<main>
    <div class="flex flex-col items-center gap-y-5 m-4">
        <!-- Title -->
        <h1 class="my-2 text-[12vw] leading-none font-thin mi:text-5xl">Dagschema</h1>

        <!-- Game list -->
        <div class="flex flex-col items-center w-fit">
            {#each gamesSorted as slot (slot.time)}
                <div class="border-b-2 border-slate-300 p-5 flex flex-col items-center justify-center gap-5 lg:flex-row lg:p-10 w-full flex-wrap">  
                    {#each slot.games as game (game.id)}
                        <div id={"game" + game.id} class="scroll-mt-5">
                            <Result gameID={game.id} team1={game.team1} team2={game.team2} time={game.time.substring(0, 5)} poule={game.poule.name} court_num={game.court_num} ref={game.ref} banner color={game.poule.color} on:reload={loadGames}/>
                        </div>
                    {/each}
                </div> 
            {:else}
                <!-- Loader -->
                {#if !loaded} 
                    <Loader {error}/>
                {:else}
                    <div class="text-center">
                        <p>Er zijn nog geen poules aangemaakt.</p>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</main>
