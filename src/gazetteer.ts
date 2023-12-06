import {
  AdministrativeDivision,
  Divisions,
  FullDivision,
  FullText,
  GeoLevel,
  GetFullDivision,
} from './types';
import { extractDivisions, validateCodeLength } from './utils';
import villageJson from './data/json/villages.json';
import communeJson from './data/json/communes.json';
import districtJson from './data/json/districts.json';
import provinceJson from './data/json/provinces.json';
import Division from './division';

export class Gazetteer {
  private static instance: Gazetteer;

  public readonly provinces: Division;
  public readonly districts: Division;
  public readonly communes: Division;
  public readonly villages: Division;

  constructor() {
    this.provinces = new Division(provinceJson, 6);
    this.districts = new Division(districtJson, 4);
    this.communes = new Division(communeJson, 2);
    this.villages = new Division(villageJson, 0);
  }

  static getInstance(): Gazetteer {
    if (!Gazetteer.instance) {
      Gazetteer.instance = new Gazetteer();
    }
    return Gazetteer.instance;
  }

  /**
   * The function `getFullText` takes in a partial object of `FullDivision` and returns a `FullText`
   * object containing concatenated text values from the input object.
   * @param divisions - The `divisions` parameter is an object of type `Partial<FullDivision>`. It
   * represents a collection of administrative divisions, where each division has properties such as
   * `administrative_unit`, `km`, and `latin`. The `Partial` type indicates that some or all of these
   * properties may be
   * @returns an object with two properties: "km" and "latin". The values of these properties are
   * concatenated strings based on the input "divisions".
   */
  private getFullText(divisions: Partial<FullDivision>): FullText {
    const concatText = (
      value: AdministrativeDivision,
      type: keyof FullText,
      key: Divisions,
    ) => {
      return (
        value?.administrative_unit?.[type] +
        `${type === 'latin' ? ' ' : ''}` +
        value?.name?.[type] +
        `${key === GeoLevel[3] ? '' : ' '}`
      );
    };

    return Object?.entries(divisions)?.reduce(
      (result, [key, value]) => {
        result.km += concatText(value, 'km', key as Divisions);
        result.latin += concatText(value, 'latin', key as Divisions);
        return result;
      },
      { km: '', latin: '' },
    );
  }

  /**
   * The function `getFullDivision` takes a code as input, extracts divisions from the code, retrieves
   * data for each division, generates a full text description, and returns an object containing the
   * division data and the full text description.
   * @param {string} code - The `code` parameter is a string that represents the code of a division.
   * @returns an object of type `GetFullDivision`, which includes the `data` object and a `text`
   * property.
   */
  public getFullDivision(code: string): GetFullDivision {
    const divisions = extractDivisions(code);

    const data = divisions.reduce((result, code, index) => {
      if (!result) {
        result = {};
      }

      const key = GeoLevel[index];

      Object.assign(result, {
        //@ts-ignore
        [key]: this[key].find(code),
      });

      return result;
    }, {} as Partial<FullDivision>);

    const text = this.getFullText(data);

    return { ...data, text };
  }

  public getFullGroupDivision(code: string, includeProvinces?: boolean) {
    const divisions = extractDivisions(code);

    const data: Partial<FullDivision> = {};

    for (let index = 1; index < divisions.length; index++) {
      const key = GeoLevel[index];
      const parentCode = divisions[index - 1];
      //@ts-ignore
      Object.assign(data, { [key]: this[key].findByParent(parentCode) });
    }

    if (includeProvinces) {
      Object.assign(data, { provinces: this.provinces });
    }

    return data;
  }

  /**
   * The function `getChildDivision` takes a code as input and returns the child divisions based on the
   * length of the code.
   * @param {string} code - The `code` parameter is a string that represents a division code. The
   * length of the code determines the level of the division.
   * @returns The function `getChildDivision` returns an array of child divisions based on the provided
   * code. The specific child divisions returned depend on the length of the code:
   */
  public getChildDivision(code: string) {
    validateCodeLength(code);

    switch (code?.length) {
      case 2:
        return this.districts.findByAncestor(code);
      case 4:
        return this.communes.findByAncestor(code);
      case 6:
        return this.villages.findByAncestor(code);
      default:
        return [];
    }
  }
}
export default Gazetteer.getInstance();
