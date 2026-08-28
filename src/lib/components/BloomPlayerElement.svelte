<svelte:options
    customElement={{
        tag: 'bloom-player',
        shadow: 'none'
    }}
/>

<script lang="ts">
    // Svelte wrapper around bloom-player's iframe embedding protocol.
    //
    // bloom-player is NOT a custom element itself - it's a React app served as
    // bloomplayer.htm, configured via URL query params and controlled via
    // window.postMessage. This component owns the iframe and translates its
    // postMessage protocol into Svelte props/events, and (via <svelte:options
    // customElement>) can also be compiled into a real <bloom-player> custom
    // element for use outside Svelte.
    //
    // Protocol reference: bloom-player's src/externalContext.ts and
    // src/bloom-player-controls.tsx (BloomPlayerProps / handleControlMessage).
    // This is an internal, unversioned contract - re-check those files when
    // upgrading the bloom-player version you point `playerUrl` at.

    import { createEventDispatcher, onDestroy, onMount } from 'svelte';

    export type AutoPlayType = 'yes' | 'no' | 'motion';

    // --- Props -------------------------------------------------------------

    /** Base URL of the bloom-player build, e.g. "/src/gen-assets/bloom-player/bloomplayer.htm" */
    export let playerUrl: string;
    /** URL of the book folder to load. */
    export let bookUrl: string;
    /** BCP-47 code of the language to display initially. */
    export let lang: string | undefined = undefined;
    export let paused = false;
    export let autoplay: AutoPlayType = 'motion';
    export let startPage: number | undefined = undefined;
    export let allowToggleAppBar = true;
    export let initiallyShowAppBar = false;
    export let showBackButton = false;
    export let hideFullScreenButton = false;
    export let centerVertically = true;
    export let useOriginalPageSize = false;
    export let skipActivities = false;
    export let hideNavButtons = false;
    export let videoPreviewMode = false;
    export let reportSoundLog = false;

    // --- Events --------------------------------------------------------
    // Used only when this file is consumed as a plain Svelte component
    // (import BloomPlayer from ".../BloomPlayer.svelte"). When compiled as a
    // custom element, Svelte automatically re-dispatches these as CustomEvents
    // on the host element (e.g. document.querySelector("bloom-player")
    // .addEventListener("playbackComplete", ...)).
    const dispatch = createEventDispatcher<{
        playbackComplete: any;
        reportBookProperties: any;
        sendAnalytics: any;
        updateBookProgressReport: any;
        backButtonClicked: any;
        showNavBar: any;
        hideNavBar: any;
        logError: any;
        storePageData: any;
        capabilities: any;
    }>();

    let iframeEl: HTMLIFrameElement;

    function buildSrc(): string {
        const params = new URLSearchParams();
        params.set('url', bookUrl);
        if (lang) params.set('lang', lang);
        params.set('paused', String(paused));
        params.set('autoplay', autoplay);
        if (startPage !== undefined) params.set('start-page', String(startPage));
        params.set('allowToggleAppBar', String(allowToggleAppBar));
        params.set('initiallyShowAppBar', String(initiallyShowAppBar));
        params.set('showBackButton', String(showBackButton));
        params.set('hideFullScreenButton', String(hideFullScreenButton));
        params.set('centerVertically', String(centerVertically));
        params.set('useOriginalPageSize', String(useOriginalPageSize));
        params.set('skipActivities', String(skipActivities));
        params.set('hideNavButtons', String(hideNavButtons));
        params.set('videoPreviewMode', String(videoPreviewMode));
        params.set('reportSoundLog', String(reportSoundLog));
        return `${playerUrl}?${params.toString()}`;
    }

    // Rebuild src only when the base identifying props change; runtime
    // controls (pause/resume/play/reset) should go through postMessage
    // (see the exported methods below) rather than by reloading the iframe.
    $: src = buildSrc();

    function postToPlayer(message: Record<string, unknown>) {
        iframeEl?.contentWindow?.postMessage(JSON.stringify(message), '*');
    }

    /** Pause playback/narration in the player. */
    export function pause() {
        postToPlayer({ messageType: 'control', pause: true });
    }

    /** Resume playback if the player was paused by an external pause() call. */
    export function resume() {
        postToPlayer({ messageType: 'control', resume: true });
    }

    /** Start/restart playing, optionally overriding the autoplay mode. */
    export function play(playAutoplay?: AutoPlayType) {
        postToPlayer({
            messageType: 'control',
            play: true,
            ...(playAutoplay ? { autoplay: playAutoplay } : {})
        });
    }

    /** Reset to the configured start page. */
    export function reset() {
        postToPlayer({ messageType: 'control', reset: true });
    }

    /** Send a raw controlAction string (see bloom-player's handleControlMessage). */
    export function controlAction(action: string) {
        postToPlayer({ messageType: 'control', controlAction: action });
    }

    function handleWindowMessage(event: MessageEvent) {
        // Only handle messages from our own iframe.
        if (!iframeEl || event.source !== iframeEl.contentWindow) return;
        if (!event.data || typeof event.data !== 'string') return;

        let message: any;
        try {
            message = JSON.parse(event.data);
        } catch {
            return;
        }

        const { messageType, ...detail } = message ?? {};
        if (!messageType) return;

        dispatch(messageType as any, detail);
    }

    onMount(() => {
        window.addEventListener('message', handleWindowMessage);
    });

    onDestroy(() => {
        pause();
        window.removeEventListener('message', handleWindowMessage);
    });
</script>

<iframe
    bind:this={iframeEl}
    {src}
    title="Bloom Player"
    style="width: 100%; height: 100%; border: none;"
    allow="autoplay"
/>
