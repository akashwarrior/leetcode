import type { RedisClientType, SetOptions } from "redis";
import { createClient } from "redis";

// TODO: add proper types for values

export type RedisKey = `executions:${string}`;
export type RedisStreamKey = "code-executions";

class RedisService {
  private readonly client: RedisClientType;
  // '$' start from the message that arrives after the service starts
  // updating id from '$' to last id is required to move sequentially in stream
  private xReadId: string = '$';

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client
      .connect()
      .then(() => console.log("Connected to Redis"))
      .catch((err) => console.error("Error connecting to Redis", err));
  }

  async set(key: RedisKey, value: string, options?: SetOptions) {
    return this.client.set(key, value, options);
  }

  async get(key: RedisKey) {
    return this.client.get(key);
  }

  async xAdd(key: RedisStreamKey, message: Record<string, string>) {
    return this.client.xAdd(key, "*", message);
  }

  async xRead(key: RedisStreamKey) {
    try {
      const result = await this.client.xRead(
        {
          id: this.xReadId,
          key,
        },
        {
          COUNT: 1,
          BLOCK: 0,
        },
      );

      if (result !== null && result.length > 0) {
        this.xReadId = result.at(-1)?.messages.at(-1)?.id || "$";
      }

      return result;
    } catch {
      return null;
    }
  }
}

export const redisService = new RedisService();
