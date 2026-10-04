import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution, InstitutionDocument } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { v4 as uuidv4 } from 'uuid';
import { TenantsService } from '../../tenants/tenants.service';
import { User, UserSchema } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution.name) private institutionModel: Model<InstitutionDocument>,
    private tenantsService: TenantsService,
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {
    const existingInstitution = await this.institutionModel.findOne({ email: createInstitutionDto.email });
    if (existingInstitution) {
      throw new ConflictException('Institution with this email already exists');
    }

    // Generate unique slug
    let slug = createInstitutionDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingSlug = await this.institutionModel.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const tenantId = uuidv4();
    const dbName = slug.replace(/-/g, '_') + '_db';

    const createdInstitution = new this.institutionModel({
      ...createInstitutionDto,
      tenantId,
      slug,
      dbName,
    });

    const savedInstitution = await createdInstitution.save();

    // Provision the first Admin User in the new Tenant Database
    const tenantUserModel = await this.tenantsService.getTenantModel(
      dbName,
      User.name,
      UserSchema,
    );

    const hashedPassword = await bcrypt.hash(createInstitutionDto.password, 10);

    const newTenantAdmin = new tenantUserModel({
      name: createInstitutionDto.adminName,
      email: createInstitutionDto.email,
      password: hashedPassword,
      phone: createInstitutionDto.phone,
      userType: 'INSTITUTION_ADMIN',
      tenantId: tenantId,
      isActive: true,
    });

    await newTenantAdmin.save();

    return savedInstitution;
  }

  async findAll(): Promise<Institution[]> {
    return this.institutionModel.find().exec();
  }

  async findOne(id: string): Promise<Institution> {
    const institution = await this.institutionModel.findById(id).exec();
    if (!institution) {
      throw new NotFoundException(`Institution with ID ${id} not found`);
    }
    return institution;
  }

  async update(id: string, updateData: any): Promise<Institution> {
    const updated = await this.institutionModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Institution with ID ${id} not found`);
    }
    return updated;
  }

  async findByTenantId(tenantId: string): Promise<Institution | null> {
    return this.institutionModel.findOne({ tenantId }).exec();
  }
}
