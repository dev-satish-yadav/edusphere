import { Injectable, NestMiddleware, NotFoundException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InstitutionsService } from '../../controller/institutions/institutions.service';

export interface TenantRequest extends Request {
  tenantDb?: string;
  tenantId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly institutionsService: InstitutionsService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    // 1. Extract tenant identifier from headers (or subdomain)
    const tenantId = req.headers['x-tenant-id'] as string;

    // For Super Admin routes or generic routes that don't need a tenant, we might bypass this.
    // But for demonstration, if it's missing, we either fail or just continue.
    // We can conditionally require it based on routes, or just attach it if present.
    if (!tenantId) {
      return next(); 
    }

    // 2. Find the institution in the master database
    let institution;
    try {
      institution = await this.institutionsService.findByTenantId(tenantId);
    } catch (error) {
      throw new BadRequestException('Error validating tenant');
    }

    if (!institution) {
      throw new NotFoundException('Tenant not found');
    }

    // 3. Attach the database name to the request object
    req.tenantDb = institution.dbName;
    req.tenantId = institution.tenantId;

    next();
  }
}
