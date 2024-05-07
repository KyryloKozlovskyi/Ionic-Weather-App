import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any) {
    if (!this._storage) {
      await this.init();
    }
    let result = await this._storage?.set(key, value);
    console.log("Storage set()");
    console.log(result);
  }

  public async get(key: string) {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.get(key);
    console.log("Storage get()");
    console.log(value);
    return value;
  }

  public async remove(key: string) {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.remove(key);
  }

  public async clear() {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.clear();
  }

  public async keys() {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.keys();
    return value;
  }
}
