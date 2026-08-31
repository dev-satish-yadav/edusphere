import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class TenantsService {
  private connections: { [key: string]: mongoose.Connection } = {};

  async getTenantConnection(dbName: string): Promise<mongoose.Connection> {
    if (this.connections[dbName]) {
      return this.connections[dbName];
    }

    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusphere';
    
    // Parse the base URI to replace the database name
    const url = new URL(uri);
    url.pathname = `/${dbName}`;
    const tenantUri = url.toString();

    const connection = mongoose.createConnection(tenantUri);

    this.connections[dbName] = connection;
    return connection;
  }

  async getTenantModel(
    dbName: string,
    modelName: string,
    schema: mongoose.Schema,
  ): Promise<any> {
    const connection = await this.getTenantConnection(dbName);
    return connection.model(modelName, schema);
  }
}
