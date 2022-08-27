<script lang="ts">
    import { colors } from "@/types/constants";

    export let value: string = "#000000";

    let panelOpen = false;
</script>

<template>
    <div class="flex flex-col gap-y-2 items-center w-40">
        <div class="w-4 h-4 hover:cursor-pointer" style={"background-color:" + value} on:click={() => panelOpen = !panelOpen}></div>
        <div class="flex gap-x-2 bg-slate-300 w-fit p-2 rounded-b-xl" class:hidden={!panelOpen}>
            {#each colors as color}
                <div class="w-4 h-4 hover:cursor-pointer" style={"background-color:" + color} on:click={() => { value = color; panelOpen = false; }}></div>
            {/each}
        </div>
    </div>
</template>