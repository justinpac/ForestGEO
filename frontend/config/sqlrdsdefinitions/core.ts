import { ColumnStates } from '@/config/macros';
import { createInitialObject, ResultType } from '@/config/utils';
import { FileRow, RowValidationErrors, ValidationFunction } from '@/config/macros/formdetails';

export type CoreMeasurementsRDS = {
  id?: number;
  coreMeasurementID?: number;
  censusID?: number;
  stemID?: number;
  isValidated?: boolean;
  measurementDate?: Date;
  measuredDBH?: number;
  dbhUnit?: string;
  measuredHOM?: number;
  homUnit?: string;
  description?: string;
  userDefinedFields?: string;
};
export type CoreMeasurementsResult = ResultType<CoreMeasurementsRDS>;
export const initialCoreMeasurementsRDSRow = createInitialObject<CoreMeasurementsRDS>();

export function getCoreMeasurementsHCs(): ColumnStates {
  return {
    censusID: false,
    description: false,
    userDefinedFields: false
  };
} // cmverrors custom data type
export type CMAttributesRDS = {
  id?: number;
  cmaID?: number;
  coreMeasurementID?: number;
  code?: string;
};
export type CMAttributesResult = ResultType<CMAttributesRDS>;
export type CMVErrorRDS = {
  id?: number;
  cmvErrorID?: number;
  coreMeasurementID?: number;
  validationErrorID?: number;
};
export type CMVErrorResult = ResultType<CMVErrorRDS>;
const ATTRIBUTES_CODE_LIMIT = 10;
export const validateAttributesRow: ValidationFunction = (row: FileRow) => {
  const errors: RowValidationErrors = {};

  if (row['code'] && row['code'].length > ATTRIBUTES_CODE_LIMIT) {
    errors['code'] = `Code exceeds ${ATTRIBUTES_CODE_LIMIT} characters.`;
  }
  // Allowing NULL for status, otherwise checking for valid values
  if (
    row['status'] !== null &&
    row['status'] !== undefined &&
    !['alive', 'alive-not measured', 'dead', 'stem dead', 'broken below', 'omitted', 'missing'].includes(row['status'])
  ) {
    errors['status'] = 'Invalid status value.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
export type AttributesRDS = {
  id?: number;
  code?: string;
  description?: string;
  status?: string;
};
export type AttributesResult = ResultType<AttributesRDS>;
export const initialAttributesRDSRow = createInitialObject<AttributesRDS>();
export const AttributeStatusOptions = ['alive', 'alive-not measured', 'dead', 'missing', 'broken below', 'stem dead'];
export const attributesFields = ['code', 'description', 'status'];
export type UnifiedChangelogRDS = {
  id?: number;
  changeID?: number;
  tableName?: string;
  recordID?: string;
  operation?: string;
  oldRowState?: Record<string, any>;
  newRowState?: Record<string, any>;
  changeTimestamp?: Date;
  changedBy?: string;
  plotID?: number;
  censusID?: number;
};
export type UnifiedChangelogResult = ResultType<UnifiedChangelogRDS>;