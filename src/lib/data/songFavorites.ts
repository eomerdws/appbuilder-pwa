import { openDB, type DBSchema } from 'idb';

export interface SongFavoriteItem {
    date: number;
    docSet: string;
    collection: string;
    book: string;
    title: string;
    bookIndex: number;
}

interface SongFavorites extends DBSchema {
    songFavorites: {
        key: number;
        value: SongFavoriteItem;
        indexes: {
            'collection, book, title': string[];
        };
    };
}

let songFavoritesDB: Awaited<ReturnType<typeof openDB<SongFavorites>>> | null = null;

async function openSongFavorites() {
    if (!songFavoritesDB) {
        songFavoritesDB = await openDB<SongFavorites>('songFavorites', 1, {
            upgrade(db) {
                const favoriteStore = db.createObjectStore('songFavorites', { keyPath: 'date' });

                favoriteStore.createIndex('collection, book, title', [
                    'collection',
                    'book',
                    'chapter'
                ]);
            }
        });
    }

    return songFavoritesDB;
}

export async function addSongFavorite() {
    console.warn('To be implemented');
}

export async function removeSongFavorite() {
    console.warn('To be implemented');
}

export async function getSongFavorites(): Promise<SongFavoriteItem[]> {
    const favorites = await openSongFavorites();
    return await favorites.getAll('songFavorites');
}
