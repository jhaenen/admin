<script lang="ts">
    import SVG from 'svelte-inline-svg';

    import CancelIcon from "@/assets/icons/cancel.svg";

    export let title = "NO_TITLE";

    export let hidden = false;
</script>

<template>
    <div class="fixed bg-white border-2 border-slate-400 rounded-lg p-10 w-full z-20 text-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[800px] sm:text-left" class:hidden>
        <div class="absolute top-4 right-6"><SVG src={CancelIcon} class="w-7 h-7 hover:cursor-pointer fill-slate-600" on:click={() => hidden = true}/></div>
        <h1 class="font-light text-4xl">{title}</h1>
        <div class="p-5">
            <slot></slot>
        </div>
    </div>
    <div class="fixed top-0 left-0 w-full h-full bg-black z-10 opacity-60 hover:cursor-pointer" class:hidden on:click={() => hidden = true}></div>
</template>