<script lang="ts">
    import { base } from '$app/paths';
    import type { CarouselOpts } from '$lib/data/carouselOpts';
    import { convertStyle, language, s } from '$lib/data/stores';
    import Siema from 'siema';
    import { onMount } from 'svelte';

    let {
        id,
        items,
        imageFolder,
        onClick,
        checkImageSize,
        perPage, // TODO: Check that this value is even being passed to the content.xml
        loop,
        startIndex,
        draggable,
        multipleDrag,
        threshold,
        rtl,
        selector
    } = $props();

    const onClickCallback = onClick ?? onClickFallback;
    const checkImageSizeCallback = checkImageSize ?? checkImageSizeFallback;

    // Check for defined Siema values if non put default values
    if (perPage === undefined || perPage > 5) perPage = 3;
    if (loop === undefined) loop = false;
    if (startIndex === undefined) startIndex = 0;
    if (draggable === undefined) draggable = true;
    if (multipleDrag === undefined) multipleDrag = false;
    if (threshold === undefined || threshold <= 0) threshold = 20; // Siema default in the documentation
    if (rtl === undefined) rtl = false;
    if (selector === undefined || selector === null) selector = `content-carousel-${id.toString()}`;

    console.log(`selector: ${selector}`);
    function onClickFallback(event: Event, item: any) {
        console.warn('USING THE onClickFallback');
    }

    function checkImageSizeFallback(item: any) {
        console.warn('USING checkImageSizeFallback');
    }

    onMount(() => {
        let contentCarousel = new Siema({
            perPage: perPage,
            loop: loop,
            startIndex: startIndex,
            draggable: draggable,
            multipleDrag: multipleDrag,
            threshold: threshold,
            rtl: rtl,
            selector: '.' + selector
        });
    });

    console.log(typeof onClickCallback);
</script>

<div class="carousel-contents">
    <div class="{selector} dy-carousel">
        {#each items as item}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->

            <div
                class="dy-carousel-item contents-carousel-item-block contents-carousel-item-block-base"
                id={item.id}
                onclick={(event) => onClickCallback(event, item)}
            >
                {#if item.imageFilename}
                    <div
                        style="{convertStyle(
                            $s['div.contents-image-block']
                        )}{checkImageSizeCallback(item)}"
                    >
                        <img
                            src="{base}/{imageFolder}/{item.imageFilename}"
                            alt={item.imageFilename}
                        />
                    </div>
                {/if}

                {item.title[$language] ?? item.title.default ?? ''}
            </div>
        {/each}
    </div>
</div>
