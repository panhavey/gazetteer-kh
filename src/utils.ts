import { AdministrativeDivision, Divisions, GeoLevel } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';
const fetch = require('node-fetch');

/**
 * The function `getDivisionObject` reads a YAML file based on the provided division name and returns
 * an array of objects with additional properties.
 * @param {Divisions} division - The `division` parameter is of type `Divisions`. It represents the
 * specific division for which you want to retrieve data.
 * @returns The function `getDivisionObject` returns a Promise that resolves to an array of objects.
 * Each object in the array represents an administrative division and contains the properties from the
 * `AdministrativeDivision` interface, as well as a `code` property which represents the division's
 * code.
 */
const getDivisionObject = async (division: Divisions): Promise<any> => {
  try {
    const file = readFileSync(`./src/data/yaml/${division}.yml`, 'utf8');
    const doc: any = load(file);
    const ids = Object.keys(doc[division]);
    return ids.map((id) => {
      const values = doc[division][id] as AdministrativeDivision;
      return {
        ...values,
        code: id,
      };
    });
  } catch (err) {
    throw err;
  }
};

/**
 * The function "addAncestor" takes an array of AdministrativeDivision objects and an optional array of
 * parent AdministrativeDivision objects, and adds the ancestor property to each object in the data
 * array based on the parent data.
 * @param {AdministrativeDivision[]} data - An array of objects representing administrative divisions.
 * Each object has a `code` property representing the code of the division, and other properties
 * representing additional data about the division.
 * @param {AdministrativeDivision[]} [parentData] - An optional array of AdministrativeDivision objects
 * representing the parent divisions of the data array.
 * @returns The function `addAncestor` returns an array of objects. Each object in the array has the
 * properties `code`, `parent`, `ancestor`, and any other properties from the original `data` array.
 */
const addAncestor = (
  data: AdministrativeDivision[],
  parentData?: AdministrativeDivision[],
) => {
  return data?.map(({ code, ...rest }) => {
    const parent = code.slice(0, -2);
    const parentAncestor =
      parentData?.find((value) => value.code === parent)?.ancestor ?? [];
    return {
      code,
      parent,
      ancestor: [...(parentData ? parentAncestor : []), parent],
      ...rest,
    };
  });
};

/**
 * The function generates all divisions (provinces, districts, communes, villages) and organizes them
 * by their respective ancestors.
 * @returns The function `generateAllDivisions` is returning an object with four properties:
 * `provinces`, `districts`, `communes`, and `villages`.
 */
export const generateAllDivisions = async () => {
  const [provinces, districts, communes, villages] = await Promise.all([
    getDivisionObject('provinces'),
    getDivisionObject('districts'),
    getDivisionObject('communes'),
    getDivisionObject('villages'),
  ]);

  const districtsByProvince = addAncestor(districts, provinces);
  const communesByDistrict = addAncestor(communes, districtsByProvince);
  const villagesByCommune = addAncestor(villages, communesByDistrict);

  return {
    provinces,
    districts: districtsByProvince,
    communes: communesByDistrict,
    villages: villagesByCommune,
  };
};

/**
 * The function writes an array of AdministrativeDivision objects to a JSON file with the given
 * division name.
 * @param {string} division - The `division` parameter is a string that represents the name or
 * identifier of the administrative division. It is used to generate the file name for the JSON file
 * that will be written.
 * @param {AdministrativeDivision[]} data - The `data` parameter is an array of
 * `AdministrativeDivision` objects.
 */
export async function writeDivisionToJsonFile(
  division: string,
  data: AdministrativeDivision[],
) {
  const fileName = `${division}.json`;
  const filePath = join('./src/data/json', fileName);
  writeFileSync(filePath, JSON.stringify(data));
}

/**
 * The `syncYaml` function fetches YAML data from a GitHub repository and writes it to local files.
 */
export async function syncYaml() {
  const rawGithubUrl =
    'https://raw.githubusercontent.com/dwilkie/pumi/master/data';
  const divisions = Object.values(GeoLevel).filter((v) => isNaN(Number(v)));

  const fetchAndWrite = async (division: any) => {
    const fileName = `${division}.yml`;
    const filePath = join('./src/data/yaml', fileName);
    const response = await fetch(`${rawGithubUrl}/${division}.yml`);
    const data = await response.text();
    writeFileSync(filePath, data);
  };

  await Promise.all(divisions.map(fetchAndWrite));
}

export function extractDivisions(code: string) {
  const result = [];
  for (let i = 2; i <= code.length; i += 2) {
    result.push(code.substring(0, i));
  }
  return result;
}

/**
 * The function `validateCodeLength` checks if a given code string has a length between 2 and a
 * specified maximum length.
 * @param {string} code - The `code` parameter is a string that represents the code that needs to be
 * validated.
 * @param [maxLength=8] - The `maxLength` parameter is an optional parameter that specifies the maximum
 * length allowed for the `code` string. If no value is provided for `maxLength`, it defaults to 8.
 */
export function validateCodeLength(code: string, maxLength = 8) {
  const regex = new RegExp(`^([0-9]{2,${maxLength}})$`);

  if (!regex.test(code)) {
    throw new Error(`Code length must be between 2 and ${maxLength}`);
  }
}
