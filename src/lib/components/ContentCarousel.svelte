<script lang="ts">
    import { base } from '$app/paths';
    import { convertStyle, language, s } from '$lib/data/stores';
    import { onMount } from 'svelte';

    let {
        id,
        items,
        imageFolder,
        onClick,
        checkImageSize,
        loadReferenceText,
        contentsFontSize,
        perPage, // TODO: Check that this value is even being passed to the content.xml
        startIndex, // TODO: Determine if this is needed
        rtl, // TODO: Determine if this is needed
        features
    } = $props();

    const onClickCallback = onClick ?? onClickFallback;
    const checkImageSizeCallback = checkImageSize ?? checkImageSizeFallback;
    const loadReferenceTextCallback = loadReferenceText ?? loadReferenceTextFallback;
    const carouselId = `contents-carousel-${id}`;
    let curIdx: number = 0;

    // Check for defined Siema values if non put default values
    if (perPage === undefined || perPage > 5) perPage = 3;
    if (startIndex === undefined) startIndex = 0;
    if (typeof startIndex === 'string') startIndex = Number(startIndex);
    if (rtl === undefined) rtl = false;

    function onClickFallback(event: Event, item: any) {
        console.warn('USING THE onClickFallback');
    }

    function checkImageSizeFallback(item: any) {
        console.warn('USING checkImageSizeFallback');
    }

    function loadReferenceTextFallback(item: any) {
        console.warn('USING loadReferenceFallback');
    }

    function carouselOnClickHandler(e: Event, item: any) {
        onClickCallback(e, item);
    }

    onMount(() => {
        const carousel: HTMLElement = document.getElementById(carouselId);
        const carouselScroll: HTMLElement = carousel.querySelector('.contents-carousel-row');

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let isScrolling = false;

        carouselScroll.addEventListener('mousedown', (e: MouseEvent) => {
            isDown = true;
            startX = e.pageX - carouselScroll.offsetLeft;
            scrollLeft = carouselScroll.scrollLeft;
        });

        carouselScroll.addEventListener('mouseleave', (e: MouseEvent) => {
            isDown = false;
            isScrolling = false;
        });

        carouselScroll.addEventListener('mouseup', (e: MouseEvent) => {
            if (!isScrolling) {
                // register onclick event
                let itemUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
                if (
                    itemUnderMouse.id === undefined ||
                    itemUnderMouse.id === '' ||
                    itemUnderMouse.id === null
                )
                    itemUnderMouse = itemUnderMouse.parentElement.parentElement; // Handle clicks on iamges
                const curItem = items.find((x) => x.id === Number(itemUnderMouse.id));
                carouselOnClickHandler(e, curItem);
            }

            // finish
            isScrolling = false;
            isDown = false;
        });

        carouselScroll.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isDown) return;

            isScrolling = true;
            e.preventDefault();
            const x = e.pageX - carouselScroll.offsetLeft;
            const walk = (x - startX) * 3; //NOTE: this may need to be evaluated based on perPage options
            carouselScroll.scrollLeft = scrollLeft - walk;
        });
    });
</script>

<div id={carouselId} class="contents-carousel no-select">
    <div class="contents-carousel-row" style="overscroll-behavior: auto contain">
        <div class="contents-carousel-inner n2">
            {#each items as item}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->

                <div
                    class="contents-carousel-item-block contents-carousel-item-block-base"
                    id={item.id}
                    style="scroll-snap-type: center;"
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
                                draggable="false"
                            />
                        </div>
                    {/if}

                    <div
                        class="contents-carousel-item-text-block"
                        style:font-size="{$contentsFontSize}px"
                    >
                        <!-- check for title -->
                        {#if features['show-titles'] === true}
                            <div
                                class="contents-carousel-item-title-block contents-carousel-item-title"
                            >
                                {item.title[$language] ?? item.title.default ?? ''}
                            </div>
                        {/if}

                        <!-- Check for subtitles -->
                        {#if features['show-subtitles'] === true}
                            <div
                                class="contents-caoursel-item-subtitle-block contents-carousel-item-subtitle"
                            >
                                {item.subtitle[$language] ?? item.subtitle.default ?? ''}
                            </div>
                        {/if}

                        <!-- Check for reference -->
                        {#if features['show-references'] === true}
                            {#if item.linkType === 'reference'}
                                {#await loadReferenceTextCallback(item)}
                                    <div class="contents-ref"></div>
                                {:then referenceText}
                                    <div class="contents-ref" style="text-align:center;">
                                        {referenceText}
                                    </div>
                                {:catch error}
                                    <div class="contents-ref"></div>
                                {/await}
                            {/if}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .no-select {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>
