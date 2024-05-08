import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})

// Storage service to store data in the local storage
export class StorageService {
  private _storage: Storage | null = null;

  // Constructor to initialize the storage
  constructor(private storage: Storage) {
    this.init();
  }

  // Method to initialize the storage
  async init() {
    this._storage = await this.storage.create();
  }

  // Method to set a key-value pair in the storage
  public async set(key: string, value: any) {
    if (!this._storage) {
      await this.init();
    }
    let result = await this._storage?.set(key, value);
    console.log('Storage set()');
    console.log(result);
  }

  // Method to get the value of a key from the storage
  public async get(key: string) {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.get(key);
    console.log('Storage get()');
    console.log(value);
    return value;
  }

  // Method to remove a key-value pair from the storage
  public async remove(key: string) {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.remove(key);
  }

  // Method to clear the storage
  public async clear() {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.clear();
  }

  // Method to get all the keys from the storage
  public async keys() {
    if (!this._storage) {
      await this.init();
    }
    let value = await this._storage?.keys();
    return value;
  }
}
