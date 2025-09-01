import axios from "axios";
import type { AxiosInstance } from "axios";
import { Result, ok, err  } from "neverthrow";

const SECRET_KEY = "kzqU4XhfCaY6B6JTHODeq5";
const OAuthToken = localStorage.oauth ? "OAuth " + JSON.parse(localStorage.oauth).value : null;

export enum QualityEnum {
  LOSSLESS = "lossless",
  NQ = "nq",
  LQ = "lq",
}

const headers = {
  "X-Yandex-Music-Client": "YandexMusicDesktopAppWindows/" + window.VERSION,
  "X-Yandex-Music-Frontend": "new",
  "X-Yandex-Music-Without-Invocation-Info": "1",
  Authorization: OAuthToken,
};

// Create axios client with common headers
const yandexMusicClient: AxiosInstance = axios.create({
  baseURL: "https://api.music.yandex.net",
  headers: headers,
  // Prevent axios from throwing on HTTP error status codes
  validateStatus: () => true,
});

// HMAC sign function
export async function getSign(params: { secretKey: string; data: string }): Promise<Result<string, string>> {
  try {
    const { secretKey, data } = params;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      {
        name: "HMAC",
        hash: {
          name: "SHA-256",
        },
      },
      true,
      ["sign", "verify"],
    );

    const messageData = encoder.encode(data);
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature))).slice(0, -1);

    return ok(base64Signature);
  } catch (error) {
    return err(`Failed to generate HMAC signature: ${error}`);
  }
}

// Получить прямую ссылку на трек
export async function getTrackUrl(trackId: string, quality: QualityEnum): Promise<Result<any, string>> {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const audioСodecs = ["flac", "aac", "he-aac", "mp3", "flac-mp4", "aac-mp4", "he-aac-mp4"];
    const transports = "encraw";

    const signResult = await getSign({
      data: `${ts}${trackId}${quality}${audioСodecs.join("")}${transports}`,
      secretKey: SECRET_KEY,
    });

    if (signResult.isErr()) {
      return err(signResult.error);
    }

    for (let i = 0; i < 5; i++) {
      const response = await yandexMusicClient.get(
        `/get-file-info?ts=${ts}&trackId=${trackId}&quality=${quality}&codecs=${encodeURIComponent(audioСodecs.join(","))}&transports=${transports}&sign=${encodeURIComponent(signResult.value)}`,
      );

      if (response.status !== 200) {
        return err(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (response.data.downloadInfo.trackId !== trackId) {
        console.warn("[downloader] Track id mismatch :", response.data.downloadInfo.trackId, trackId);
        await new Promise((resolve) => setTimeout(resolve, 150));
        continue;
      }

      return ok(response.data.downloadInfo);
    }

    return err(`Failed to get track URL: too many requests`);
  } catch (error) {
    return err(`Failed to get track URL: ${error}`);
  }
}

// Получить треки по айди
export async function getTracksInfo(trackIds: string[], skipAuth = false): Promise<Result<Array<any>, string>> {
  try {
    const queryTracks = trackIds.join(",");

    const response = await yandexMusicClient.get(
      `/tracks?trackIds=${queryTracks}&removeDuplicates=false&withProgress=true`,
      {
        headers: {
          ...headers,
          Authorization: skipAuth ? undefined : OAuthToken,
        },
      },
    );

    if (response.status !== 200) {
      return err(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!Array.isArray(response.data)) {
      return err("Invalid response format: expected array");
    }

    return ok(response.data);
  } catch (error) {
    return err(`Failed to get tracks info: ${error}`);
  }
}
