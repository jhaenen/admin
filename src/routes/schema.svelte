<script lang="ts">
    // Framework
    import { onMount } from "svelte";

    // Types
    import type { Game } from "@/types/types";

    // Components
    import Result from "@/components/result.svelte";
    import Loader from "@/components/load-ball.svelte";

    let games: Array<Game> = [];

    let error = false;

    async function loadGames() {
        const server = import.meta.env.VITE_API_URL;

        // Get games from server
        try {
            const response = await fetch(server + "games");
            games = await response.json();
            error = false;
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
        {#each games as game (game.id)}
        <Result gameID={game.id} team1={game.team1} team2={game.team2} time={game.time.substring(0, 5)} poule={game.poule.name} court_num={game.court_num} ref={game.ref} banner color={game.poule.color} on:reload={loadGames}/>
        {:else}
            <Loader {error}/>
        {/each}
    </div>
</main>
