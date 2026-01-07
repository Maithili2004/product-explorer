import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check() {
    try {
      const isConnected = this.dataSource.isInitialized;
      const uptime = process.uptime();

      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        database: isConnected ? 'connected' : 'disconnected',
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: msg,
      };
    }
  }

  async readiness() {
    try {
      await this.dataSource.query('SELECT 1');
      return { ready: true };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return { ready: false, error: msg };
    }
  }
}
