export type Divisions = 'provinces' | 'districts' | 'communes' | 'villages';

export enum GeoLevel {
  'provinces',
  'districts',
  'communes',
  'villages',
}

export interface LocalizedName {
  km: string;
  latin: string;
}

export interface AdministrativeUnit extends LocalizedName {
  en: string;
}

export interface GeoData {
  lat: string;
  long: string;
}

export interface AdministrativeDivision {
  code: string;
  name: LocalizedName;
  administrative_unit: AdministrativeUnit;
  parent?: string;
  ancestor?: any;
  geodata?: GeoData;
}

export interface FullDivision {
  provinces: AdministrativeDivision;
  districts: AdministrativeDivision;
  communes: AdministrativeDivision;
  villages: AdministrativeDivision;
}

export interface FullText extends Partial<LocalizedName> {}

export interface GetFullDivision extends Partial<FullDivision> {
  text: FullText;
}
