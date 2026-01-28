<script lang="ts">
    import { base } from '$app/paths';
    import { convertStyle, language, s } from '$lib/data/stores';

    let {
        id,
        items,
        imageFolder,
        onClick,
        checkImageSize,
        loadReferenceText,
        contentsFontSize,
        features
    } = $props();

    const onClickCallback = onClick ?? onClickFallback;
    const checkImageSizeCallback = checkImageSize ?? checkImageSizeFallback;
    const loadReferenceTextCallback = loadReferenceText ?? loadReferenceTextFallback;

    function onClickFallback(event: Event, item: any) {
        console.warn('USING the onClickFallback');
    }

    function checkImageSizeFallback(item: any) {
        console.warn('USING checkImageSizeFallback');
    }

    function loadReferenceTextFallback(item: any) {
        console.warn('USING loadReferenceTextFallback');
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="heading-{id}">
    {#each items as item}
        <!-- GBrid items go here -->
        <div id={item.id}>
            {#if item.imageFilename}
                <div
                    style="{convertStyle($s['div.contents-image-block'])}{checkImageSizeCallback(
                        item
                    )}"
                >
                    <img src="{base}/{imageFolder}/{item.imageFilename}" alt={item.imageFilename} />
                </div>
            {/if}

            <div class="contents-grid-item-text-block" style:font-size="{$contentsFontSize}px">
                <!-- Check for title -->
                {#if features['show-titles'] === true}
                    <div class="contents-heading-title">
                        {item.title[$language] ?? item.title.default ?? ''}
                    </div>
                {/if}

                <!-- Check for subtitles -->
                {#if features['show-subtitles'] === true}
                    <div class="contents-heading-subtitle">
                        {item.subtitle[$language] ?? item.subtitle.default ?? ''}
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>
