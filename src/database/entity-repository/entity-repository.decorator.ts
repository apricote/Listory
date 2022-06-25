import { SetMetadata } from "@nestjs/common";

export const TYPEORM_ENTITY_REPOSITORY = "TYPEORM_ENTITY_REPOSITORY";

export function EntityRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_ENTITY_REPOSITORY, entity);
}
