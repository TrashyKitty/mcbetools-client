<script lang="ts">
	import { getModalStore, Toast } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import axios from 'axios';
	// @ts-ignore
	import Identicon from 'identicon.js';
	import config from '../../../../config';
    import { getToastStore } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';

	const modalStore = getModalStore();
    const toastStore = getToastStore();
    let title = "";
    let url = "";
    let shortDescription = "";
    let file:any = writable(null);
    let fileTitle = "";
</script>
<Toast/>
<div class="card bg-initial p-4 py-8">
    <h3 class="h3 font-bold">File Title</h3>
    <div class="h-2"></div>
    <input type="text" placeholder="Type a title for your file" class="input" bind:value={fileTitle}>
    <div class="h-4"></div>
    <h3 class="h3 font-bold">Upload the file</h3>
    <div class="h-2"></div>
    <button class="btn btn-sm w-full variant-filled-primary" on:click={()=>{
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = function() {
            if(fileInput.files && fileInput.files.length) {
                file.set(fileInput.files[0]);
            }
        }
        fileInput.click();
    }}>Upload file</button>
    {#if $file}
        <p>{$file.name}</p>
    {/if}
    <div class="h-6"></div>
    <div class="w-full bg-surface-500" style="height:1px;"></div>
    <div class="h-6"></div>
    <button class="btn btn-sm w-full variant-filled-tertiary" on:click={()=>{
        let fd = new FormData();
        fd.append('projectURL', $modalStore[0].meta.url);
        fd.append('fileTitle', fileTitle);
        fd.append('file', $file, $file.name);
        axios({
            method: "POST",
            url: `${config.apiEndpoint}/project/add-file`,
            data: fd,
            headers: {
                Authorization: localStorage.getItem('sessionToken')
            }
        }).then(res=>{
            if(!res.data.error) {
                location.pathname = `/s/${$modalStore[0].meta.url}`
            }
        })
    }}>Create</button>
</div>