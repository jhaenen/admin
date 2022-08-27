<script lang="ts">
    // Framework
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    // Components
    import Modal from "./modal.svelte";
    import Loader from "@/components/load-ball.svelte";
    import SVG from 'svelte-inline-svg';

    // Types
    import type { Team } from "@/types/types";

    // Assets
    import PlusIcon from "@/assets/icons/plus.svg";
    import MinusIcon from "@/assets/icons/minus.svg";
    import EditIcon from "@/assets/icons/edit.svg";
    import CheckIcon from "@/assets/icons/check.svg";
    import CancelIcon from "@/assets/icons/cancel.svg";

    export let poule = 0;

    export let hidden = true;

    interface Edit {
        id: number;
        name: string;
        isEditing: boolean;
    }

    let teams: Array<Team> = [];
    let teamsEdit: Array<Edit> = [];
    let teamAdd: {isAdding: boolean, name: string} = {isAdding: false, name: ""};

    let error = false;
    let loaded = false;

    const dispatch = createEventDispatcher();

    async function load_teams() {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        // Get teams from server
        try {
            const response = await fetch(server + "teams?poule=" + poule);
            teams = await response.json();

            teamsEdit = [];
            teams.forEach(team => {
                teamsEdit.push({
                    id: team.id,
                    name: team.name,
                    isEditing: false
                });
            });

            error = false;
            loaded = true;
        } catch (err) {
            error = true;
            console.error(err);
        }
    }

    onMount(async () => {
        await load_teams();
    });

    async function pushAdd() {
        if (teamAdd.isAdding) {
            const server = import.meta.env.VITE_ADMIN_API_URL;

            // Make PUT request to server
            try {
                await fetch(server + "teams", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        poule_id: poule,
                        name: teamAdd.name
                    })
                });
            } catch (err) {
                console.error(err);
            }

            await load_teams();
            dispatch("reload");

            teamAdd = {isAdding: false, name: ""};
        }        
    }

    async function pushEdit(index: number) {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        // Make PATCH request to server
        try {
            await fetch(server + "teams", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: teamsEdit[index].id,
                    name: teamsEdit[index].name
                })
            });
        } catch (err) {
            console.error(err);
        }

        teamsEdit[index].isEditing = false;

        await load_teams();
        dispatch("reload");
    }

    async function pushDelete(index: number) {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        if (confirm("Weet je zeker dat je dit team wilt verwijderen? Bij deze actie worden alle wedstrijden van dit team ook verwijderd.")) {
            // Make DELETE request to server
            try {
                await fetch(server + "teams", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: teams[index].id
                    })
                });
            } catch (err) {
                console.error(err);
            }

            await load_teams();
            dispatch("reload");
        }        
    }
</script>

<template>
    <Modal title="Team beheer" bind:hidden>
        <div class="mx-auto w-fit sm:ml-0">
            {#if loaded}
                <table class="text-left">
                    <tbody>
                    {#each teams as team, index}
                        <tr>
                            <td class="text-xl pr-10 font-bold">
                                <span class:hidden={teamsEdit[index].isEditing}>{team.name}</span>
                                <input class:hidden={!teamsEdit[index].isEditing} type="text" bind:value={teamsEdit[index].name} class="bg-slate-50 border border-gray-400 rounded accent-primary"/>
                            </td>

                            <td class="pr-5">
                                <!-- Edit team -->
                                <span class:hidden={teamsEdit[index].isEditing}><SVG src={EditIcon} class="w-6 h-6 fill-slate-600 hover:cursor-pointer" on:click={() => teamsEdit[index].isEditing = true}/></span>
                                <!-- Accept edit -->
                                <span class:hidden={!teamsEdit[index].isEditing}><SVG src={CheckIcon} class="w-6 h-6 fill-teal-600 hover:cursor-pointer" on:click={() => pushEdit(index)}/></span>
                            </td>
                            <td>
                                <!-- Delete team -->
                                <span class:hidden={teamsEdit[index].isEditing}><SVG src={MinusIcon} class="w-6 h-6 fill-rose-600 hover:cursor-pointer" on:click={() => pushDelete(index)}/></span>
                                <!-- Cancel edit -->
                                <span class:hidden={!teamsEdit[index].isEditing}><SVG src={CancelIcon} class="w-6 h-6 fill-rose-600 hover:cursor-pointer" on:click={() => teamsEdit[index].isEditing = false}/></span>
                            </td>
                        </tr>      
                    {/each}
                    <tr class:hidden={!teamAdd.isAdding}>
                        <td class="text-xl pr-10 font-bold">
                            <input type="text" bind:value={teamAdd.name} class="bg-slate-50 border border-gray-400 rounded accent-primary"/>
                        </td>
                        <!-- Accept add -->
                        <td class="pr-5"><SVG src={CheckIcon} class="w-6 h-6 fill-teal-600 hover:cursor-pointer" on:click={() => pushAdd()}/></td>
                        <!-- Cancel add -->
                        <td><SVG src={CancelIcon} class="w-6 h-6 fill-rose-600 hover:cursor-pointer" on:click={() => {teamAdd.isAdding = false; teamAdd.name = ""}}/></td>
                    </tr>  
                        <tr class:hidden={teamAdd.isAdding}>
                            <td class="text-lg pr-10 pt-5">Team toevoegen</td>
                            <td class="pr-5 pt-5"><SVG src={PlusIcon} class="w-6 h-6 fill-teal-600 hover:cursor-pointer" on:click={() => teamAdd.isAdding = true}/></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            {:else}
                <Loader {error}/>
            {/if}
        </div>
    </Modal>
</template>