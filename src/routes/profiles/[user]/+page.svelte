<script lang="ts">
    import axios from 'axios';
    import { Avatar } from '@skeletonlabs/skeleton';
    // @ts-ignore
    import Identicon from 'identicon.js';
	import { writable } from 'svelte/store';
	import config from '../../../config.js';
	import { onMount } from 'svelte';
    import { initializeStores, Modal } from '@skeletonlabs/skeleton';
    import { getModalStore } from '@skeletonlabs/skeleton';
	import EditProfile from './EditProfile.svelte';
	import ProjectCard from '../../ProjectCard.svelte';
	import MessageModal from '../../MessageModal.svelte';
			
    initializeStores();
    const modalStore = getModalStore();
    export let data;
    let profileData:any = writable({})
    let profileFinished:any = writable(false);
    let projects = writable([]);
    onMount(()=>{
        axios.get(`${config.apiEndpoint}/user-profile/${data.user}`, {
            headers: {
                Authorization: localStorage.getItem('sessionToken')
            }
        }).then(res=>{
            if(!res.data.error) {
                profileData.update((val:any)=>res.data.userData);
                profileFinished.update((val:any)=>true);
                axios.get(`${config.apiEndpoint}/get-projects/${res.data.userData.handle}`).then(res=>{
                    if(!res.data.error) {
                        projects.set(res.data.userProjects)
                    }
                })
            }
        })
    })
    function textToHex(text: string) {
        let hex = text.split('').map(_=>{
            return _.charCodeAt(0).toString(16)
        }).join('')
        if(hex.length < 15) {
            return `5cedaf0abc4a5a9efd0126a9${hex}`
        } else {
            return `${hex}`
        }
    }
</script>
<Modal />
<div class="container h-full h-full flex p-0 max-w-none">
    {#if $profileFinished}
        <div class="profile-display w-full">
            {#if $profileData.bannerURL}
                <div class="banner w-full h-52" style={`background-image:url(${config.apiEndpoint}${$profileData.bannerURL});background-size:cover;background-position:center;`}></div>
            {:else}
                <div class="banner w-full h-52" style={`background-image:url(/defaultbanner.png);background-size:cover;background-position:center;`}></div>
            {/if}
            <div class="h-3"></div>
            <div class="pl-4 flex gap-5">
                <div class="avatar">
                    <Avatar src={$profileData.avatarURL ? `${config.apiEndpoint}${$profileData.avatarURL}` : `data:image/png;base64,${new Identicon(textToHex($profileData.handle)).toString()}`} rounded="rounded-full" width="w-16"/>
                </div>
                <div class="user-info">
                    <div class="flex items-center gap-2">
                        <h1 class="text-4xl font-bold m-0 p-0">{$profileData.displayName}</h1>
                        {#if $profileData.role > 0}
                            <span class="badge variant-filled-primary h-fit">{$profileData.role == 1 ? "MODERATOR" : $profileData.role == 2 ? "ADMIN" : $profileData.role == 3 ? "CO-OWNER" : $profileData.role == 4 ? "OWNER" : "MODERATOR"}</span>
                        {/if}
                    </div>
                    <p class="opacity-75">@{$profileData.handle}</p>
                    {#if $profileData.bio}
                        <p class="opacity-80">{$profileData.bio}</p>
                    {/if}
                </div>
            </div>
            <div class="h-2"></div>
            <div class="flex gap-2 h-fit">
                {#if $profileData.status}
                    <div class="ml-24 w-fit h-fit card px-4 py-1 variant-soft-primary">
                        <p>{$profileData.status}</p>
                    </div>
                {/if}

                <button class="btn btn-sm variant-filled-primary" on:click={()=>{
                    modalStore.trigger({
                        type: 'component',
                        component: {ref: MessageModal},
                        meta: {user: $profileData.handle}
                    })
                }}>
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                    <span>Message</span>
                </button>
            </div>
            <div class="h-10"></div>
            <div class="flex items-center justify-center">
                {#if $profileData.isCurrentUser}
                <button class="btn btn-sm w-full max-w-96 variant-ghost-surface" on:click={()=>{
                    modalStore.trigger({
                        type: 'component',
                        component: {
                            ref: EditProfile
                        },
                        meta: { profileData: profileData, user: data.user }
                    })
                }}>Edit Profile</button>
            {/if}

            </div>
            {#if $projects.length}
                <div class="p-4">
                    <h3 class="h3">My projects</h3>
                </div>
                <div class="h-4"></div>
                <div class="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-5 w-full p-4 gap-4">
                    {#each $projects as project}
                    <ProjectCard project={project} />
                {/each}

                </div>
            {/if}
        </div>
    {/if}
</div>