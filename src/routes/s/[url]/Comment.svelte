<script lang="ts">
	import axios from "axios";
	import { writable } from "svelte/store";
	import config from "../../../config";
	import { Avatar } from "@skeletonlabs/skeleton";
	import { getUserAvatar } from "../../AvatarRenderer";

    export let comment;

    let commentAuthor = writable(null);

    axios.get(`${config.apiEndpoint}/id-to-handle/${comment.author}`).then(res=>{
        axios.get(`${config.apiEndpoint}/user-profile/${res.data.handle}`).then(res=>{
            commentAuthor.set(res.data.userData);
        })
    })
</script>

{#if $commentAuthor}
    <div class="flex gap-4 h-fit">
        <img src={getUserAvatar($commentAuthor)} class="rounded-full w-12 h-12" />
        <div class="flex flex-col">
            <p class="text-xl font-bold p-0 m-0">{$commentAuthor.displayName} <span class="opacity-50">( @{$commentAuthor.handle} )</span></p>
            <p class="text-lg p-0 m-0">{comment.text}</p>
        </div>
    </div>
{/if}