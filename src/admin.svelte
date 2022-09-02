<script lang="ts">
    //Framework
    import Router from 'svelte-spa-router';

    // Routes
    import Poules from '@/routes/poules.svelte';
    import Schema from './routes/schema.svelte';
    import PouleStats from '@/routes/poule_stats.svelte';
    import Courts from '@/routes/courts.svelte';

    // Components
    import SVG from 'svelte-inline-svg';
    import NavButton from '@/components/nav-button.svelte';

    // Assets
    import logo from "@/assets/logo.svg";
    import court_icon from "@/assets/icons/court.svg";
    import poules_icon from "@/assets/icons/basketball.svg";
    import schedule_icon from "@/assets/icons/newspaper.svg";
    import logout_icon from "@/assets/icons/logout.svg";


    const routes = {
        '/': Schema,
        '/poules': Poules,
        '/poules/:id': PouleStats,
        '/courts': Courts
    };

    const icon_color = '#ffffff';
</script>

<main>
    <!-- Navigation bar -->
    <div class="fixed bottom-0 w-full m-0 p-0 sm:top-0 sm:bottom-auto z-10">
        <nav class="flex h-[82px] justify-evenly flex-wrap sm:justify-start bg-primary text-white py-4 sm:p3">
            <a href="#/" class="hidden h-12 w-12 mx-4 sm:block"><img src={logo} alt="Svelte Logo"/></a>
            <a href="#/" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Schema" icon={schedule_icon} color={icon_color}/></a>
            <a href="#/poules" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Poules" icon={poules_icon} color={icon_color}/></a>
            <a href="#/courts" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Velden" icon={court_icon} color={icon_color}/></a>
            <!-- <a href="#/schema" class="w-24 sm:py-3 sm:px-4 sm:w-auto"><NavButton label="Dagschema" icon={schedule_icon} color={icon_color}/></a> -->
            <a href="logout" class="hidden mr-0 ml-auto py-3 px-4 w-auto sm:flex gap-2 items-center"><NavButton label="Uitloggen"/><SVG src={logout_icon} class="w-5 h-5 hover:cursor-pointer fill-white" /></a>
        </nav>
    </div>
    
    <!-- Main content -->
    <div class="p-1 absolute w-full top-0 bottom-[78px] sm:top-[78px] overflow-y-scroll sm:bottom-0">
        <div class="font-bold text-center">Admin modus</div>
        <a href="logout" class="flex absolute gap-2 items-center top-1 right-2 sm:hidden"><span>Uitloggen</span> <SVG src={logout_icon} class="w-5 h-5  fill-slate-700" /></a>
        <Router {routes}/>
    </div>
</main>
