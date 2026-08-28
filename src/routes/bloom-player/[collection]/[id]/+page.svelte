<script lang="ts">
    import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
    import { scriptureConfig } from '$assets/config';
    import contents from '$assets/contents';
    import type { ScriptureConfig } from '$config';
    import BloomPlayerElement from '$lib/components/BloomPlayerElement.svelte';
    import BookSelector from '$lib/components/BookSelector.svelte';
    import BottomNavigationBar from '$lib/components/BottomNavigationBar.svelte';
    import ChapterSelector from '$lib/components/ChapterSelector.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import {
        actionBarColor,
        bodyFontSize,
        bodyLineHeight,
        contentsStack,
        convertStyle,
        language,
        modal,
        ModalType,
        moreThanOneCollection,
        NAVBAR_HEIGHT,
        s,
        showCollection,
        t
    } from '$lib/data/stores';
    import { refs } from '$lib/data/stores/scripture';
    import { compareVersions } from '$lib/scripts/stringUtils';
    import { resolve } from '$lib/utils/paths';
    import { onDestroy, onMount } from 'svelte';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';
    import type { PageData } from './$types';

    interface Props {
        showBackButton?: boolean;
        start?: Snippet;
        center?: Snippet;
        end?: Snippet;
        backNavigation?: (e: Event, routeId: string) => void;
    }

    // let scrollingUp = $state(true);
    // let savedScrollPosition = 0;
    // let lastChangeTime = 0;
    //
    // function saveScrollPosition() {
    //     const now = Date.now();
    //     const oldSavedScroll     scrollingDiv.scrollTop;
    //     const newScrollin
    // }

    let showOverlowMenu = $state(false);
    function handleMenuClick() {
        showOverlowMenu = false;
    }

    const book = $derived(
        scriptureConfig?.bookCollections
            ?.find((x) => x.id === $refs.collection)
            ?.books.find((x) => x.id === $refs.book)
    );

    const bookType = $derived(book?.type);
    $effect(() => {
        if (bookType === 'bloom-player') {
            console.log('Bloom book!');
        }
    });

    function backNavigation() {
        if ($contentsStack.length > 0) {
            const menuId = contentsStack.popItem();
            goto(resolve(`/contents/${menuId}`));
        }
    }

    const showBackButton = $derived(
        contents?.features?.['navigation-type'] === 'up' && $contentsStack.length > 0
    );

    let player;
</script>

<div class="grid grid-rows-[auto_1fr_auto]" style="height:auto; height:auto">
    <BloomPlayerElement
        bind:this={player}
        playerUrl="/src/gen-assets/bloom-player/bloomplayer.htm"
        lang="book.language,"
        bookUrl="/collections/C03/B001/Poem - The Moon.htm"
    />
</div>
