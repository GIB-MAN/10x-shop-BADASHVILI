export class StorageService<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(defaultValue: T): T {
    try {
      const storedData = localStorage.getItem(this.key);

      if (storedData === null) {
        return defaultValue;
      }

      return JSON.parse(storedData) as T;
    } catch (error) {
      console.error(
        `Failed to read "${this.key}" from localStorage:`,
        error
      );

      return defaultValue;
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save "${this.key}":`, error);
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Failed to remove "${this.key}":`, error);
    }
  }
}