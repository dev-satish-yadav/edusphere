import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution, InstitutionDocument } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution.name) private institutionModel: Model<InstitutionDocument>,
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

    return createdInstitution.save();
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

  async findByTenantId(tenantId: string): Promise<Institution | null> {
    return this.institutionModel.findOne({ tenantId }).exec();
  }
}
