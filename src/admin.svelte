<script lang="ts">
    //Framework
    import Router from 'svelte-spa-router';

    // Routes
    import Home from '@/routes/home.svelte';
    import Poules from '@/routes/poules.svelte';
    import Schema from './routes/schema.svelte';
    import PouleStats from '@/routes/poule_stats.svelte';

    // Components
    import NavButton from '@/components/nav-button.svelte';

    // Assets
    import logo from "@/assets/logo_lq.webp";
    import home_icon from "@/assets/icons/house.svg";
    import poules_icon from "@/assets/icons/basketball.svg";
    import schedule_icon from "@/assets/icons/newspaper.svg";

    const routes = {
        '/': Home,
        '/schema': Schema,
        '/poules': Poules,
        '/poules/:id': PouleStats,
    };

    const icon_color = '#ffffff';
</script>

<main>
    <!-- Navigation bar -->
    <div class="fixed bottom-0 w-full m-0 p-0 sm:top-0 sm:bottom-auto z-10">
        <nav class="flex h-[82px] justify-evenly flex-wrap sm:justify-start bg-primary text-white py-4 sm:p3">
            <a href="#/" class="hidden h-12 w-12 mx-4 sm:block"><img src={logo} alt="Svelte Logo"/></a>
            <a href="#/" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Home" icon={home_icon} color={icon_color}/></a>
            <a href="#/poules" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Poules" icon={poules_icon} color={icon_color}/></a>
            <a href="#/schema" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Dagschema" icon={schedule_icon} color={icon_color}/></a>
        </nav>
    </div>
    
    <!-- Main content -->
    <div class="p-1 absolute w-full top-0 bottom-[78px] sm:top-[78px] overflow-y-scroll sm:bottom-0"><Router {routes}/></div>
</main>
