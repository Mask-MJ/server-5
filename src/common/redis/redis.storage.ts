import {
  Injectable,
  Inject,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  @Inject(ConfigService)
  private configService: ConfigService;
  private redisClient: Redis;

  onApplicationBootstrap() {
    const host = this.configService.get('REDIS_HOST');
    const port = this.configService.get('REDIS_PORT');
    this.redisClient = new Redis({ host, port, lazyConnect: true });
  }

  // 当程序退出时, 关闭 redis 客户端
  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async getRedisInfo() {
    const rawInfo = await this.redisClient.info();
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    // 遍历每一行并分割键值对
    const parsedInfo = new Map<string, string>();
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        parsedInfo.set(key.trim(), value.trim());
      }
    });
    return parsedInfo;
  }

  /**
   * 分页查询缓存数据
   * @param data
   * @returns
   */
  async skipFind(data: { key: string; pageSize: number; pageNum: number }) {
    const rawInfo = await this.redisClient.lrange(
      data.key,
      (data.pageNum - 1) * data.pageSize,
      data.pageNum * data.pageSize,
    );
    return rawInfo;
  }
  /**
   * 缓存Key数量
   * @returns
   */
  async getDbSize() {
    return await this.redisClient.dbsize();
  }

  /**
   * 命令统计
   * @returns
   */
  async commandStats() {
    const rawInfo = await this.redisClient.info('commandstats');
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    const commandStats: { name: string; value: number }[] = [];
    // 遍历每一行并分割键值对
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        commandStats.push({
          name: key?.trim()?.replaceAll('cmdstat_', ''),
          value: +value?.trim()?.split(',')[0]?.split('=')[1],
        });
      }
    });
    return commandStats;
  }

  /**
   * 存储字符串
   * @param key
   * @param value
   * @param ttl
   */
  async setString(key: string, value: string, ttl?: number) {
    return await this.redisClient.set(key, value, 'EX', ttl);
  }
  /**
   * 获取字符串
   * @param key
   */
  async getString(key: string) {
    return await this.redisClient.get(key);
  }
  /**
   * 删除字符串
   * @param key
   */
  async delString(key: string) {
    return await this.redisClient.del(key);
  }
  /**
   * 存储对象
   * @param key
   * @param value
   * @param ttl
   */
  async setObject(key: string, value: Record<string, any>, ttl?: number) {
    return await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }
  /**
   * 获取对象
   * @param key
   */
  async getObject(key: string) {
    return JSON.parse(await this.redisClient.get(key));
  }
  /**
   * 批量获取对象
   * @param keys
   */
  async getObjects(keys: string[]) {
    const values = await this.redisClient.mget(keys);
    return values.map((value) => JSON.parse(value));
  }
  /**
   * 删除对象
   * @param key
   */
  async delObject(key: string) {
    return await this.redisClient.del(key);
  }
  /**
   * 批量删除对象
   * @param keys
   */
  async delObjects(keys: string[]) {
    return await this.redisClient.del(keys);
  }
  /**
   * 清除全部
   * @param key
   */
  async flushAll() {
    return await this.redisClient.flushall();
  }
}
