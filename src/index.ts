import pumi from './gazetteer';

export {
  type AdministrativeDivision,
  type AdministrativeUnit,
  type LocalizedName,
  type GeoData,
} from './types';

export const {
  provinces,
  districts,
  communes,
  villages,
  getChildDivision,
  getFullDivision,
  getFullGroupDivision,
} = pumi;

export default pumi;
