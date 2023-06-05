<script lang="ts">
    // Framework
    import { onMount } from "svelte";

    // Types
    import type { Poule } from "@/types/types";
    import { colors } from "@/types/constants";

    // Components
    import Loader from "@/components/load-ball.svelte";
    import SVG from 'svelte-inline-svg';
    import ColorPicker from "@/components/color_picker.svelte";

    // Assets
    import PlusIcon from "@/assets/icons/plus.svg";
    import MinusIcon from "@/assets/icons/minus.svg";
    import EditIcon from "@/assets/icons/edit.svg";
    import CheckIcon from "@/assets/icons/check.svg";
    import CancelIcon from "@/assets/icons/cancel.svg";


    interface Edit {
        id: number;
        name: string;
        color: string;
        isEditing: boolean;
    }

    let poules: Array<Poule> = [];
    let poulesEdit: Array<Edit> = [];
    let pouleAdd: {isAdding: boolean, name: string, color: string} = {isAdding: false, name: "", color: colors[0]};

    let error = false;
    let loaded = false;

    async function loadPoules() {
        const server = import.meta.env.VITE_API_URL;

        // Get poules from server
        try {
            const response = await fetch(server + "poules");
            poules = await response.json();

            poulesEdit = [];
            poules.forEach(poule => {
                poulesEdit.push({
                    id: poule.id,
                    name: poule.name,
                    color: poule.color,
                    isEditing: false
                });
            });

            loaded = true;
        } catch (err) {
            error = true;
            console.error(err);
        }
    }

    async function pushAdd() {
        if (pouleAdd.isAdding) {
            const server = import.meta.env.VITE_ADMIN_API_URL;

            // Make PUT request to server
            try {
                await fetch(server + "poules", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: pouleAdd.name,
                        color: pouleAdd.color
                    })
                });
            } catch (err) {
                console.error(err);
            }

            await loadPoules();

            pouleAdd = {isAdding: false, name: "", color: colors[0]};
        }        
    }

    async function pushEdit(index: number) {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        // Make PATCH request to server
        try {
            await fetch(server + "poules", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: poulesEdit[index].id,
                    name: poulesEdit[index].name,
                    color: poulesEdit[index].color
                })
            });
        } catch (err) {
            console.error(err);
        }

        poulesEdit[index].isEditing = false;

        await loadPoules();
    }

    async function pushDelete(index: number) {
        const server = import.meta.env.VITE_ADMIN_API_URL;

        if (confirm("Weet je zeker dat je deze poule wilt verwijderen? Bij deze actie worden alle teams en wedstrijden in deze poule ook verwijderd.")) {
            // Make DELETE request to server
            try {
                await fetch(server + "poules", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: poules[index].id
                    })
                });
            } catch (err) {
                console.error(err);
            }
        }

        await loadPoules();
    }

    onMount(async () => {
        await loadPoules();
    });
</script>

<template>
    <div class="flex flex-col items-center m-4 gap-y-8">
        <!-- Title -->
        <div class="my-2 flex flex-row items-center"><span class="font-light text-5xl">Poules</span><span class:hidden={pouleAdd.isAdding}><SVG src={PlusIcon} class="mt-2 mx-4 w-8 h-8 hover:cursor-pointer fill-teal-600" on:click={() => {pouleAdd.isAdding = true; pouleAdd.name = ""}}/></span></div>

        <!-- Poule list -->
        {#each poules as poule, index}
            <div class="text-center">
                <a class="text-2xl font-bold underline underline-offset-4" style={"text-decoration-color:" + poule.color} class:hidden={poulesEdit[index].isEditing} href="#/poules/{poule.id}">{poule.name}</a>
                <input class="text-2xl font-bold text-center bg-slate-50 border border-gray-400 rounded accent-primary" class:hidden={!poulesEdit[index].isEditing} type="text" bind:value={poulesEdit[index].name} />
                <div class="mt-2 w-full flex justify-center" class:hidden={!poulesEdit[index].isEditing}>
                    <ColorPicker bind:value={poulesEdit[index].color} />
                </div>
                <div class="mt-2 flex flex-row items-center justify-center" class:hidden={poulesEdit[index].isEditing}>
                    <SVG src={EditIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-slate-600" on:click={() => poulesEdit[index].isEditing = true}/>
                    <SVG src={MinusIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-rose-600" on:click={() => pushDelete(index)} />
                </div>
                <div class="mt-2 flex flex-row items-center justify-center" class:hidden={!poulesEdit[index].isEditing}>
                    <SVG src={CheckIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-teal-600" on:click={() => {pushEdit(index)}}/>
                    <SVG src={CancelIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-rose-600" on:click={() => {poulesEdit[index].isEditing = false; poulesEdit[index].name = poules[index].name;}}/>
                </div>
                
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

        <!-- Add poule -->
        {#if pouleAdd.isAdding}
            <div>
                <input class="text-2xl font-bold text-center bg-slate-50 border border-gray-400 rounded accent-primary" type="text" bind:value={pouleAdd.name} placeholder="POULE NAAM" />
                <div class="mt-2 w-full flex justify-center">
                    <ColorPicker bind:value={pouleAdd.color} />
                </div>
                <div class="mt-2 flex flex-row items-center justify-center">
                    <SVG src={CheckIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-teal-600" on:click={() => pushAdd()} />
                    <SVG src={CancelIcon} class="mx-2 w-5 h-5 hover:cursor-pointer fill-rose-600" on:click={() => {pouleAdd.isAdding = false; pouleAdd.name = ""}} />
                </div>
            </div>
        {/if}
    </div>
</template>