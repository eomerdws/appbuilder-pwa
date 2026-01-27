import contents from '$lib/data/contents';

export async function load({ params }) {
    const id = Number(params.id);
    const menu = contents.screens.find((x) => x.id === id);
    const nestedItems = contents.nestedItems;
    const features = contents.features;
    const title = contents.title;

    // ISSUE: Need to find a way to be sure that the visible-items feature is showing up, but per caraousel as each carousel could have different visible-items
    const items = [];
    for (const item of menu.items) {
        let found;
        if (!nestedItems) {
            found = contents.items.find((x) => x.id === item.id);
        } else {
            // NOTE: If the item is the upper level container it has an id but no contentContainerId
            const curContainerId = contents.items.find((x) => x.id === item.id)?.id;
            if (curContainerId !== undefined || curContainerId !== null) {
                found = contents.items.filter(
                    (x) =>
                        x.contentContainerId === curContainerId &&
                        x.linkType !== 'none' &&
                        !x.contentItemContainer
                );
            } else {
                console.warn('No container items were loaded.');
            }
        }
        if (found) {
            items.push(found);
        }
    }

    return { menu, items, features, title, nestedItems };
}
