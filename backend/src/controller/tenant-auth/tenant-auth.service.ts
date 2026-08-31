import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TenantsService } from '../../tenants/tenants.service';
import { Institution, InstitutionDocument } from '../institutions/entities/institution.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { TenantLoginDto } from './dto/tenant-login.dto';

@Injectable()
export class TenantAuthService {
  constructor(
    @InjectModel(Institution.name) private institutionModel: Model<InstitutionDocument>,
    private tenantsService: TenantsService,
  ) {}

  async login(loginDto: TenantLoginDto) {
    // 1. Find the institution by slug
    const institution = await this.institutionModel.findOne({ slug: loginDto.slug, isActive: true }).exec();
    
    if (!institution) {
      throw new NotFoundException('Institution not found or inactive');
    }

    // 2. Connect to the tenant database
    const tenantUserModel = await this.tenantsService.getTenantModel(
      institution.dbName,
      User.name,
      UserSchema,
    );

    // 3. Find user by email (selecting password)
    const user = await tenantUserModel.findOne({ email: loginDto.email, isActive: true }).select('+password').exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Generate JWT Token
    // We include tenantId in the token so that the frontend can pass it in the x-tenant-id header for future requests
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.userType,
        tenantId: institution.tenantId,
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' },
    );

    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.userType,
          tenantId: institution.tenantId,
        },
        institution: {
          name: institution.name,
          slug: institution.slug,
          type: institution.type
        }
      },
    };
  }
}
