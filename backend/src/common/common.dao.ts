import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

const SORT = { createdAt: -1 };
const perPage = 10;

export interface ListParam {
  page?: number;
  limit?: number;
  match?: Record<string, any>;
  sort?: Record<string, any>;
}

/** Every module DAO extends this: all model access lives behind it. */
export abstract class DAO<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: Partial<T>) {
    return this.model.create(doc);
  }

  async find(filter: FilterQuery<T> = {}, options?: QueryOptions) {
    return this.model.find(filter, null, options).exec();
  }

  async findOne(filter: FilterQuery<T>, projection?: Record<string, any>) {
    return this.model.findOne(filter, projection).exec();
  }

  async findById(id: string, projection?: Record<string, any>) {
    return this.model.findById(id, projection).exec();
  }

  async countDocuments(filter: FilterQuery<T> = {}) {
    return this.model.countDocuments(filter).exec();
  }

  async findByIdAndUpdate(id: string, update: UpdateQuery<T>, options?: QueryOptions) {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true, ...options })
      .exec();
  }

  async findByIdAndDelete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: FilterQuery<T>) {
    return this.model.deleteMany(filter).exec();
  }

  /** Shared list + count, so no module repeats the skip/limit arithmetic. */
  async paginate({ page = 1, limit = perPage, match = {}, sort = SORT }: ListParam) {
    const [items, total] = await Promise.all([
      this.model
        .find(match)
        .sort(sort as any)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.countDocuments(match),
    ]);
    return { items, total, page, limit };
  }
}
