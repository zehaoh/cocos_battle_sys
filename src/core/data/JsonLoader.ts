import { readFileSync } from 'node:fs';

export class JsonLoader {
  public static load<T>(path: string): T {
    return JSON.parse(readFileSync(path, 'utf-8')) as T;
  }
}
