<script lang="ts">
    // Framework
    import { createEventDispatcher } from "svelte";

    // Types
    import type { Team, TeamResult } from "@/types/types";

    // Components
    import SVG from 'svelte-inline-svg';

    // Assets
    import EditIcon from "@/assets/icons/edit.svg";
    import CheckIcon from "@/assets/icons/check.svg";
    import CancelIcon from "@/assets/icons/cancel.svg";

    const dispatcher = createEventDispatcher();

    export let team1 : TeamResult; 
    export let team2 : TeamResult;
    export let time = "00:00";
    export let poule = "";
    export let court_num = 0;
    export let gameID;
    export let ref: Team | null = null;
    export let banner = false;

    export let color = "#000000";

    let editMode = false;

    let tempScore1 = 0;
    let tempScore2 = 0;

    function enterEditMode() {
        tempScore1 = team1.score;
        tempScore2 = team2.score;
        editMode = true;
    }

    async function pushEdit() {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        // Make PATCH request to server
        try {
            await fetch(server + "results", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: gameID,
                    score1: tempScore1,
                    score2: tempScore2
                })
            });
        } catch (err) {
            console.error(err);
        }

        editMode = false;

        dispatcher('reload');
    }
</script>

<template>
    <div class="relative border-2 rounded-lg border-slate-400 p-2 text-center max-w-sm w-fit">
        <div class="w-full" class:hidden={editMode}><SVG src={EditIcon} class="mt-1 ml-auto mr-2 w-5 h-5 hover:cursor-pointer fill-slate-600" on:click={enterEditMode} /></div>
        <div class="w-full flex justify-end mt-1 mr-4 gap-2" class:hidden={!editMode}>
            <SVG src={CheckIcon} class="w-5 h-5 hover:cursor-pointer fill-teal-600" on:click={pushEdit} />
            <SVG src={CancelIcon} class="w-5 h-5 hover:cursor-pointer fill-rose-600" on:click={() => editMode = false} />
        </div>

        <div class="text-xs font-bold mt-2">
            <span class:hidden={poule===""}>{poule}</span>
            <span class="mx-1" class:hidden={poule==="" || court_num==0}>-</span>
            <span class:hidden={court_num==0}>Veld {court_num}</span>
        </div>
        
        <div class="flex justify-between items-center">
            <div class="w-[35vw] mi:w-40">
                <div class="m-1 mi:leading-7 font-bold" style="font-size: min(1rem, 1.25rem);">{team1.name}</div>
                <div class="text-[8vw] mi:text-4xl font-light" class:hidden={editMode}>{team1.score}</div>
                <input class="text-[8vw] w-24 ml-5 text-center mi:text-4xl font-light bg-slate-50 border border-gray-400 rounded accent-primary" class:hidden={!editMode} type="number" bind:value={tempScore1} min="0" max="999" />
            </div>
            
            <div class="mt-6 text-sm">
                <div class="mb-1">VS</div>
                <div>{time}</div>
            </div>

            <div class="w-[35vw] mi:w-40">
                <div class="m-1 mi:leading-7 font-bold" style="font-size: min(1rem, 1.25rem);">{team2.name}</div>
                <div class="text-[8vw] mi:text-4xl font-light" class:hidden={editMode}>{team2.score}</div>
                <input class="text-[8vw] ml-5 w-24 text-center mi:text-4xl font-light bg-slate-50 border border-gray-400 rounded accent-primary" class:hidden={!editMode} type="number" bind:value={tempScore2}  min="0" max="999"/>
            </div>
        </div>
        
        {#if ref !== null}
            <div class="text-xs my-2" >
                <div class="font-bold">Tafel/Scheids</div> 
                <div>{ref.name}</div>
            </div>
        {:else}
            <div class="text-xs my-2 select-none">
                <div class="font-bold">&nbsp;</div> 
                <div>&nbsp;</div>
            </div>
        {/if}
        
        <div class="absolute w-2 h-full top-0 right-0 -z-10" class:hidden={!banner} style={"background-color: " + color}></div>
    </div>
</template>