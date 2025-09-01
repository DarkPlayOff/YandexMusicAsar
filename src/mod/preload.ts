import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("yandexMusicMod", {
  getStorageValue: (key: string) => ipcRenderer.invoke("yandexMusicMod.getStorageValue", key),
  setStorageValue: (key: string, value: any) =>
    ipcRenderer.send("yandexMusicMod.setStorageValue", key, value),
  onStorageChanged: (cb: Function) => {
    const listener = (_e: any, key: any, value: any) => cb(key, value);
    ipcRenderer.on("yandexMusicMod.storageValueUpdated", listener);
    return () => ipcRenderer.removeListener("yandexMusicMod.storageValueUpdated", listener);
  }
});
