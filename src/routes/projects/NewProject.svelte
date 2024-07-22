<script lang="ts">
	import { getModalStore, Toast } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	// @ts-ignore
	import Identicon from 'identicon.js';
	import config from '../../config';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';

	const modalStore = getModalStore();
    const toastStore = getToastStore();
    const projects = writable([]);
    let title = "";
    let url = "";
    let shortDescription = "";
</script>
<Toast/>
<div class="card variant-filled-surface p-4 py-8">
    <h3 class="h3 font-bold">Create a project</h3>
    <div class="h-4"></div>
    <input type="text" placeholder="Title" class="input" bind:value={title}>
    <div class="h-1"></div>
    <input type="text" placeholder="Short description" class="input" bind:value={shortDescription}>
    <div class="h-1"></div>
    <input type="text" placeholder="URL" class="input" bind:value={url}>
    <div class="h-3"></div>
    <button class="w-full btn btn-sm variant-gradient-primary-secondary bg-gradient-to-br" on:click={()=>{
        let formData = new FormData();
        formData.append('title', title);
        formData.append('shortDescription', shortDescription);
        formData.append('url', url);
        axios({
            method: 'post',
            url: `${config.apiEndpoint}/create-project`,
            data: formData,
            headers: {
                Authorization: localStorage.getItem('sessionToken')
            }
        }).then(res=>{
            if(!res.data.error) {
                modalStore.close()
            } else {
                toastStore.trigger({
                    message: `ERROR: ${res.data.message}`,
                    timeout: 5000,
                    background: 'variant-filled-error'
                })
            }
        })
    }}>
        Create
    </button>
</div>