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
    function onClickFallback(e: Event, item: any) {
        console.warn('Using onClickFallback');
    }

    function checkImageSizeFallback(item: any) {
        console.warn('Using checkImageSizeFallback');
    }

    function loadReferenceTextFallback(item: any) {
        console.warn('Using loadReferenceTextFallback');
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="grid-{id}" class="contents-grid">
    <div class="contents-grid-row contents-grid-cols-3">
        {#each items as item}
            <!-- Grid items go here -->
            <div
                class="contents-grid-item-block contents-grid-item-block-base contents-link-ref"
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

                <div class="contents-grid-item-text-block" style:font-size="{$contentsFontSize}px">
                    <!-- Check for title -->
                    {#if features['show-titles'] === true}
                        <div class="contents-grid-item-title-block contents-grid-item-title">
                            {item.title[$language] ?? item.title.default ?? ''}
                        </div>
                    {/if}

                    <!-- Check for subtitles -->
                    {#if features['show-subtitles'] === true}
                        <div class="contents-grid-item-subtitle-block contents-grid-item-subtitle">
                            {item.subtitle[$language] ?? item.subtitle.default ?? ''}
                        </div>
                    {/if}

                    <!-- Check for references -->
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
