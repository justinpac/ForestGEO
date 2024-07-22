// family custom data type
import {IDataMapper} from '../../datamapper';

export type FamilyRDS = {
  id?: number;
  familyID?: number;
  family?: string;
  referenceID?: number;
};

export interface FamilyResult {
  FamilyID: any;
  Family: any;
  ReferenceID: any;
}

export class FamilyMapper implements IDataMapper<FamilyResult, FamilyRDS> {
  mapData(results: FamilyResult[], indexOffset: number = 1): FamilyRDS[] {
    return results.map((item, index) => ({
      id: index + indexOffset,
      familyID: item.FamilyID != null ? Number(item.FamilyID) : undefined,
      family: item.Family != null ? String(item.Family) : undefined,
      referenceID: item.ReferenceID != null ? Number(item.ReferenceID) : undefined,
    }));
  }

  demapData(results: FamilyRDS[]): FamilyResult[] {
    return results.map((item) => ({
      FamilyID: item.familyID != undefined ? Number(item.familyID) : null,
      Family: item.family != undefined ? String(item.family) : null,
      ReferenceID: item.referenceID != undefined ? Number(item.referenceID) : null,
    }));
  }
}

