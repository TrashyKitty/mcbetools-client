import { error } from '@sveltejs/kit';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        url: params.url,
    }
}