<script lang="ts">
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import NewProject from './NewProject.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import axios from 'axios';
	import config from '../../config';

	initializeStores();
    const modalStore = getModalStore();
    const projects:any = writable([]);

    onMount(()=>{
        axios.get(`${config.apiEndpoint}/get-my-projects`, {
            headers: {
                Authorization: localStorage.getItem('sessionToken')
            }
        }).then(res=>{
            if(!res.data.error) {
                projects.set(res.data.userProjects);
            }
        })
    })
</script>
<Modal />
<div class="w-full flex max-w-none flex-col">
	<div class="flex h-24 justify-center items-center w-full">
		<button class="btn btn-sm variant-filled-primary" on:click={()=>{
            modalStore.trigger({
                type: 'component',
                component: { ref: NewProject }
            })
        }}>New Project</button>


    </div>
    <div class="project-cards grid">
        {#each $projects as project}
            <div class="card bg-initial w-fit rounded-lg overflow-hidden">
                <div class="banner w-full max-w-56">
                    <img src={project.bannerURL ? `${config.apiEndpoint}${project.bannerURL}` : `/defaultbanner.png`}>
                </div>

                <section class="p-4">
                    <h3 class="h3 font-bold">{project.title}</h3>
                    <p class="opacity-75">{project.shortDescription}</p>
                    <button class="btn btn-sm w-full variant-soft-secondary" on:click={()=>{
                        location.pathname = `/projects/edit/${project.url}`
                    }}>Edit</button>
                    <div class="h-2"></div>
                    <button class="btn btn-sm w-full variant-soft-error">Delete</button>
                </section>
            </div>
        {/each}
    </div>
</div>
