<script lang="ts">
	import { Avatar, Tab, TabGroup } from "@skeletonlabs/skeleton";
	import axios from "axios";
    // @ts-ignore
	import config from "../../../config";
	import { writable } from "svelte/store";
	import { Carta } from "carta-md";
	import { getUserAvatar } from "../../AvatarRenderer";
	import Comment from "./Comment.svelte";

    export let data;
    let tab = 0;
    let readme = writable("");
    //@ts-ignore
    const carta = new Carta({
        theme: 'github-dark'
    });
    axios.get(`${config.apiEndpoint}/readme/${data.url}`).then(res=>{
        carta.render(res.data).then(res=>{
            readme.set(res);
        })
    })
    let latestFile = writable("");
    let comments = writable(null);
    let proj:any = writable(null)
    let user:any = writable(null);
    let commentText = "";
    axios.get(`${config.apiEndpoint}/get-comments/${data.url}`).then(res=>{
        comments.set(res.data.comments)
    })
    axios.get(`${config.apiEndpoint}/proj/${data.url}`).then(res=>{
        if(!res.data.error) {
            proj.set(res.data.project);
            if(res.data.project && res.data.project.files && res.data.project.files.length) {
                latestFile.set(res.data.project.latestFile)
            }
            axios.get(`${config.apiEndpoint}/id-to-handle/${res.data.project.author}`).then(res=>{
                if(!res.data.error) {
                    axios.get(`${config.apiEndpoint}/user-profile/${res.data.handle}`).then(res=>{
                        if(!res.data.error) {
                            user.set(res.data.userData);
                        }
                    })
                }
            })
        }
    })
    // axios.get(`${config.apiEndpoint}/add-view/${data.url}`).then(res=>{})
</script>
<div class="thing w-full h-full">
    {#if tab === 0}
    {#if $proj}
    <div class="container2 flex h-full w-full justify-center" style={`background:url(${config.apiEndpoint}${$proj.bannerURL});background-size:cover;background-position:center;background-attachment:fixed;`}>
        <div class="overlay bg-gradient-to-b from-surface-700 to-surface-900/50 w-full flex justify-center backdrop-blur-sm h-full max-w-none">

        <article class="prose prose-invert px-12 w-full min-w-lg max-w-3xl bg-surface-900">
                <TabGroup>
                    <Tab name="tab1" value={0} bind:group={tab}>Overview</Tab>
                    <Tab name="tab2" value={1} bind:group={tab}>Comments</Tab>
                    <Tab name="tab3" value={2} bind:group={tab}>Files</Tab>
                </TabGroup>
                <div class="h-6"></div>
                <h3 class="h3 font-bold p-0 m-0">{$proj.title}</h3>
                {#if $user}
                    <div class="h-2"></div>
                    <div class="flex gap-4 p-0">
                        <Avatar src={getUserAvatar($user)} width="w-16" class="m-0 p-0 w-12" />
                        <div class="flex flex-col justify-center">
                            <p class="text-2xl font-bold m-0">{$user.displayName}</p>
                            <a href={`/profiles/${$user.handle}`} class="opacity-50 underline m-0">@{$user.handle}</a>
                        </div>
                    </div>
                {/if}
                <p class="opacity-50 text-white">{$proj.shortDescription}</p>
                <div class="w-full bg-surface-500" style="height:1px;"></div>
                {@html $readme}
                <div class="h-4"></div>
                {#if $proj.files && $proj.files.length}

                    <p class="opacity-80 text-md p-0 m-0">Select your version</p>
                    <select class="select" value={$latestFile} on:change={(e)=>{
                        latestFile.set(e.target.value)
                    }}>
                        {#each $proj.files.reverse() as file}
                            <option value={file.file}>{file.title}</option>
                        {/each}
                    </select>
                    <div class="h-2"></div> 
                    <button class="btn btn-sm w-full variant-ringed-primary hover:variant-filled-primary text-white" on:click={()=>{
                        let fileTitle = $proj.files.find(_=>_.file == $latestFile).title;
                        let fileExt = $latestFile.split('.')[$latestFile.split('.').length - 1];
                        let fileName = `${fileTitle}.${fileExt}`;

                        fetch(`${config.apiEndpoint}/uploads/${$latestFile}`).then(res=>res.blob()).then(res=>{
                            let blobUrl = URL.createObjectURL(res);
                            let a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = fileName;
                            a.click();

                        })
                    }}>
                        Download {$proj.files.find(_=>_.file == $latestFile).title}
                    </button>

                {/if}
                <div class="h-6"></div>
        </article>
    </div>
    </div>
    {/if}
    {:else if tab === 1}
        {#if $proj}
            <div class="container2 flex w-full h-full justify-center" style={`background:url(${config.apiEndpoint}${$proj.bannerURL});background-size:cover;background-position:center;background-attachment:fixed;`}>
                <div class="h-full overlay bg-gradient-to-b from-surface-700 to-surface-900/50 w-full flex justify-center backdrop-blur-sm">
                    <div class="min-w-lg max-w-3xl px-12 w-full bg-surface-900 h-full">
                        <TabGroup>
                            <Tab name="tab1" value={0} bind:group={tab}>Overview</Tab>
                            <Tab name="tab2" value={1} bind:group={tab}>Comments</Tab>
                            <Tab name="tab3" value={2} bind:group={tab}>Files</Tab>
                        </TabGroup>
                        <div class="comment-area">
                            <div class="h-4"></div>
                            <div class="flex gap-4 p-4">
                                <input type="text" class="input w-3xl" placeholder="Type a comment..." bind:value={commentText} />
                                <button class="btn variant-filled-primary text-black" on:click={()=>{
                                    let fd = new FormData();
                                    fd.append("text", commentText);
                                    fd.append("url", data.url);
                                    axios({
                                        method: "POST",
                                        url: `${config.apiEndpoint}/make-comment`,
                                        data: fd,
                                        headers: {
                                            Authorization: localStorage.getItem('sessionToken')
                                        }
                                    })
                                }}>Send</button>
                            </div>
                        </div>
                        <div class="h-6"></div>
                        {#if $comments}
                            {#each $comments as comment}
                                <div class="h-2"></div>
                                <Comment comment={comment} />
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

        {/if}
    {:else if tab === 2}
    (tab panel 3 contents)
{/if}

</div>
<style lang="postcss" global>
    .prose {
        --tw-prose-headings: #fff;
    }
    .prose {
        margin: 0 !important;
    }
    .prose h1 {
        @apply h1 font-bold;
    }
    .prose h6 {
        @apply h6 text-white opacity-50;
    }
    .prose h5 {
        @apply h5 text-white opacity-50;
    }
    .prose * {
        @apply text-white;
        color: white !important;
    }
    .prose button {
        color: white !important;
    }
    .prose button:hover {
        color: black !important;
    }
    .prose button.text-black {
        color: black !important;
    }
</style>