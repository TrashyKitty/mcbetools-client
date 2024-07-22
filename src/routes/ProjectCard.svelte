<script lang="ts">
	import { getContext } from "svelte";
	import config from "../config";
	import axios from "axios";
	import { writable } from "svelte/store";
    import { initializeStores, Modal } from '@skeletonlabs/skeleton';
    import { getModalStore } from '@skeletonlabs/skeleton';
	import { getUserAvatar } from "./AvatarRenderer";
			
    initializeStores();
    const modalStore = getModalStore();
    export let project:any;

    let project2 = writable(project)
    let uploader = writable(null);
    axios.get(`${config.apiEndpoint}/id-to-handle/${project.author}`).then(res=>{
        axios.get(`${config.apiEndpoint}/user-profile/${res.data.handle}`).then(res=>{
            uploader.set(res.data.userData);
        })
    })
    let loggedInUser:any = getContext("loggedInUser");
</script>
<Modal />
<a href={`/s/${$project2.url}`} class="mt-4 card bg-initial card-hover md:w-fit rounded-lg overflow-hidden w-96 sm:w-full flex flex-col">
    <div class="banner w-full">
        <img
            src={$project2.bannerURL
                ? `${config.apiEndpoint}${$project2.bannerURL}`
                : `/defaultbanner.png`}
            style="object-fit:cover;width:100%;aspect-ratio:16/9;"
        />
    </div>

    <section class="p-4 flex-auto">
        <h3 class="h3 font-bold">{$project2.title}</h3>
        <div class="border-solid border-b border-surface-200/10 w-full h-3"></div>
        <div class="h-2"></div>
        <p class="opacity-75 max-w-96">{$project2.shortDescription}</p>
        <p class="opacity-50 italic text-sm">{$project2.files.length} file(s)</p>
    </section>

    <div class="actions p-4">
        {#if $uploader}
            <div class="h-2"></div>
            <div class="flex cursor-default w-full items-center gap-1" on:click={(e)=>{
                e.preventDefault();
            }}>
                <img src={getUserAvatar($uploader)} class="w-8 h-8 object-cover rounded-full"/>
                <a href={`/profiles/${$uploader.handle}`} on:click={(e)=>{
                    location.pathname = `/profiles/${$uploader.handle}`
                }} class="text-xl hover:underline p-0 m-0 no-underline opacity-50 italic">@{$uploader.handle}</a>
            </div>
            <div class="h-2"></div>
        {/if}

        {#if $loggedInUser && $loggedInUser.role >= 1}
        {#if $project2.verified}
            <button class="btn btn-sm variant-soft-primary w-full" on:click={(e)=>{
                e.preventDefault()
                let fd = new FormData();
                fd.append("url", $project2.url);
                axios({
                    method: "POST",
                    url: `${config.apiEndpoint}/mod/deny`,
                    data: fd,
                    headers: {
                        Authorization: localStorage.getItem('sessionToken')
                    }
                }).then(res=>{
                    if(!res.data.error) {
                        project2.set(res.data.project);
                    }
                })
            }}>Unverify</button>
        {:else}
            <button class="btn btn-sm variant-soft-primary w-full" on:click={(e)=>{
                e.preventDefault();
                let fd = new FormData();
                fd.append("url", $project2.url);
                axios({
                    method: "POST",
                    url: `${config.apiEndpoint}/mod/accept`,
                    data: fd,
                    headers: {
                        Authorization: localStorage.getItem('sessionToken')
                    }
                }).then(res=>{
                    if(!res.data.error) {
                        project2.set(res.data.project);
                    }
                })
            }}>Verify</button>
        {/if}
        {#if $loggedInUser && $loggedInUser.role >= 3}
            <div class="h-4"></div>
            <button class="btn btn-sm variant-soft-error w-full" on:click={(e)=>{
                e.preventDefault();
                
                const modal = {
                    type: 'confirm',
                    // Data
                    title: 'Please Confirm',
                    body: 'Are you sure you wish to proceed?',
                    // TRUE if confirm pressed, FALSE if cancel pressed
                    // @ts-ignore
                    response: (r) => {
                        if(r) {
                            let fd = new FormData();
                fd.append("url", $project2.url);
                axios({
                    method: "POST",
                    url: `${config.apiEndpoint}/mod/delete`,
                    data: fd,
                    headers: {
                        Authorization: localStorage.getItem('sessionToken')
                    }
                }).then(res=>{
                    if(!res.data.error) {
                        project2.set(res.data.project);
                    }
                })

                        }
                    },
                };
                // @ts-ignore
                modalStore.trigger(modal);

            }}>Delete</button>
        {/if}
    {/if}

    </div>

</a>