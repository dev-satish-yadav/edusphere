import { isValidObjectId } from 'mongoose';

/** True when the string can be cast to an ObjectId, so a bad id never reaches Mongo. */
export function isValidId(id: string): boolean {
  return isValidObjectId(id);
}
