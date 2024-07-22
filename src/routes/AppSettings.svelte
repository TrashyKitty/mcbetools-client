<script lang="ts">
	import { getModalStore, Toast } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	// @ts-ignore
	import Identicon from 'identicon.js';
	import config from '../config';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
    let themeAttribute = writable('trashdev');
    onMount(()=>{
        themeAttribute.set(document.body.getAttribute('data-theme') ? document.body.getAttribute('data-theme') : 'trashdev');
    })
</script>

<div class="card bg-initial p-4 py-8">
    
    <nav class="list-nav">
        <!-- (optionally you can provide a label here) -->
        <ul>
            <li>
                <button on:click={()=>{
                    document.body.setAttribute('data-theme', 'trashdev');
                    localStorage.setItem('theme', 'trashdev');
                    themeAttribute.set('trashdev');
                }} class={$themeAttribute == 'trashdev' ? "bg-primary-500/10 text-primary-100" : ""}>
                    <span class="flex-auto">Default</span>
                </button>
                <button on:click={()=>{
                    document.body.setAttribute('data-theme', 'winter');
                    localStorage.setItem('theme', 'winter');
                    themeAttribute.set('winter');
                }} class={$themeAttribute == 'winter' ? "bg-primary-500/10 text-primary-100" : ""}>
                    <span class="flex-auto">Winter</span>
                </button>
                <button on:click={()=>{
                    document.body.setAttribute('data-theme', 'fall');
                    localStorage.setItem('theme', 'fall');
                    themeAttribute.set('fall');
                }} class={$themeAttribute == 'fall' ? "bg-primary-500/10 text-primary-100" : ""}>
                    <span class="flex-auto">Fall</span>
                </button>
            </li>
            <!-- ... -->
        </ul>
    </nav>

</div>