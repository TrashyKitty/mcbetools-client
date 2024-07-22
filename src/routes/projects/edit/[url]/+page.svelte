<script lang="ts">
	import axios from 'axios';
	import { writable } from 'svelte/store';
	import config from '../../../../config';
	import { getModalStore, initializeStores, Modal } from '@skeletonlabs/skeleton';
	import AddFile from './AddFile.svelte';
	initializeStores();
    const modalStore = getModalStore();

    export let data;

	let project: any = writable({});

	axios.get(`${config.apiEndpoint}/get-project-by-url/${data.url}`).then((res) => {
		if (!res.data.error) {
			project.set(res.data.project);
		}
	});
</script>
<Modal/>
<div class="p-4">
	<h2 class="h2">Editing project: <span class="font-bold">{$project.title}</span></h2>
	<div class="h-4"></div>
	<button
		class="btn btn-sm variant-soft-primary"
		on:click={() => {
			location.pathname = `/projects/edit/${data.url}/description`;
		}}>Edit description</button
	>
	<button class="btn btn-sm variant-soft-tertiary" on:click={() => {
        modalStore.trigger({
            type: 'component',
            meta: {url:data.url},
            component: {ref: AddFile}
        })        
    }}>Add Download</button>
	<button class="btn btn-sm variant-soft-secondary" on:click={() => {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = ()=>{
            if(!fileInput.files || !fileInput.files.length) return;
            let fd = new FormData();
            fd.append('banner', fileInput.files[0], fileInput.files[0].name);
            fd.append('projectURL', data.url);
            axios({
                method: "POST",
                url: `${config.apiEndpoint}/project/update-banner`,
                data: fd,
                headers: {
                    Authorization: localStorage.getItem('sessionToken')
                }
            }).then(res=>{
                if(!res.data.error) {
                    location.pathname = `/projects`
                }
            })
        }
        fileInput.click();
    }}>Set banner</button>
</div>
