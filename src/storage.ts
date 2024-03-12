import {IStorage} from "@tonconnect/sdk";


// TODO Should be redis/db/other permanent storage
export class Storage implements IStorage {
    private map = new Map<string, string>();
    async getItem(key: string): Promise<string | null> {
        return this.map.get(key) || null;
    }

    async removeItem(key: string): Promise<void> {
        this.map.delete(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        this.map.set(key, value);
    }
}

export const storage = new Storage();
