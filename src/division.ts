import { AdministrativeDivision } from './types';
import { validateCodeLength } from './utils';

export default class Division {
  public data: AdministrativeDivision[];
  public parentCodeLength: number;

  constructor(data: any, parentCodeLength: number) {
    this.data = data;
    this.parentCodeLength = parentCodeLength;
  }

  /**
   * The function returns all the administrative divisions.
   * @returns An array of AdministrativeDivision objects.
   */
  public all(): AdministrativeDivision[] {
    return this.data;
  }

  /**
   * The function findByAncestor filters an array of AdministrativeDivision objects based on a given
   * code.
   * @param {string} code - The `code` parameter is a string that represents the code of an
   * administrative division.
   * @returns The method `findByAncestor` returns an array of `AdministrativeDivision` objects.
   */
  public findByAncestor(code: string): AdministrativeDivision[] {
    validateCodeLength(code, this.parentCodeLength);

    return this.data.filter((item) => item.code.startsWith(code)) || [];
  }

  /**
   * The function findByParent takes a code as input and returns an array of AdministrativeDivision
   * objects that have the input code as their parent code.
   * @param {string} code - The `code` parameter is a string that represents the parent code of an
   * administrative division.
   * @returns The method `findByParent` returns an array of `AdministrativeDivision` objects.
   */
  public findByParent(code: string): AdministrativeDivision[] {
    const regex = new RegExp(`^([0-9]{${this.parentCodeLength}})$`);

    if (!regex.test(code)) {
      throw new Error(
        `Parent code lenght must be equal to ${this.parentCodeLength}`,
      );
    }
    return this.findByAncestor(code) || [];
  }

  /**
   * The function findOne takes a code as input and returns an AdministrativeDivision object from the
   * data array that matches the code, or undefined if no match is found.
   * @param {string} code - The code parameter is a string that represents the code of an
   * administrative division.
   * @returns an object of type AdministrativeDivision or undefined.
   */
  public findOne(code: string): AdministrativeDivision | undefined {
    return this.data.find((item) => item.code === code);
  }

  /**
   * The searchName function filters an array of AdministrativeDivision objects based on a keyword,
   * returning only the objects whose name (in either Khmer or Latin script) contains the keyword.
   * @param {string} keyword - The keyword parameter is a string that represents the search term or
   * keyword that you want to use to search for administrative divisions.
   * @returns an array of AdministrativeDivision objects that match the given keyword.
   */
  public searchName(keyword: string): AdministrativeDivision[] {
    return this.data.filter(
      (item) =>
        item.name.km.indexOf(keyword) !== -1 ||
        item.name.latin.indexOf(keyword) !== -1,
    );
  }
}
