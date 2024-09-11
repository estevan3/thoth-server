import { EntityTarget, ObjectLiteral } from "typeorm";
import appDataSource from "../config/dataSource.js";

const Service = <T extends ObjectLiteral>(Entity: EntityTarget<T>) => {
  return appDataSource.getRepository(Entity);
};

export default Service;
