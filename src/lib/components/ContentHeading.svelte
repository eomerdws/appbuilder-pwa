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
    {#snippet img(item)}
        <div
            class="contents-image-block"
            style="{convertStyle($s['div.contents-image-block'])}{checkImageSizeCallback(item)}"
        >
            <img
                class="contents-image"
                style={convertStyle($s['div.contents-image'])}
                src="{base}/{imageFolder}/{item.imageFilename}"
                alt={item.imageFilename}
            />
        </div>
    {/snippet}

    {#snippet text(item)}
        <div
            class="contents-text-block contents-text-block-base"
            style:font-size="{$contentsFontSize}px"
        >
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
    {/snippet}

    {#each items as item}
        <!-- Heading items go here -->

        <div id={item.id}>
            {#if item.imageFilename}
                {#if item.features['layout'] === 'image-left-text-right'}
                    <div class="contents-layout-horizontal">
                        {@render img(item)}
                        {@render text(item)}
                    </div>
                {:else}
                    {@render img(item)}
                {/if}
            {/if}

            {#if item.features['layout'] !== 'image-left-text-right'}
                {@render text(item)}
            {/if}
        </div>
    {/each}
</div>
