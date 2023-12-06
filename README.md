# gazetteer-kh

A JavaScript library for querying and filtering Cambodia's gazetteer.

## Installation

```sh
yarn add gazetteer-kh
```

```sh
npm install gazetteer-kh
```

## Usage

```typescript
import gazetteer from 'gazetteer-kh';

const children = gazetteer.getChildDivision('10010101');

//or
import { getFullDivision } from 'gazetteer-kh';

const fulldivision = getFullDivision('10010101');
```

## Division Usage

```typescript
import gazetteer from 'gazetteer-kh';

const allProvinces = gazetteer.provinces.all();

//or

import { districts } from 'gazetteer-kh';

const alldistricts = districts.all();
```

## Gazetteer

| Name                   | Description                                     | Type                                         |
| ---------------------- | ----------------------------------------------- | -------------------------------------------- |
| `provinces`            | Get provinces instance.                         | `Division`                                   |
| `districts`            | Get districts instance.                         | `Division`                                   |
| `communes`             | Get communes instance.                          | `Division`                                   |
| `villages`             | Get villages instance.                          | `Division`                                   |
| `getChildDivision`     | Get child divisions of provided code.           | `(code: string) => AdministrativeDivision[]` |
| `getFullDivision`      | Get division and group by level with full text. | `(code: string) => GetFullDivision`          |
| `getFullGroupDivision` | Get all divisions and group by level.           | `(code: string) => Partial<FullDivision>`    |

## Division

| Name             | Description                               | Type                                                   |
| ---------------- | ----------------------------------------- | ------------------------------------------------------ |
| `all`            | Get all divisions.                        | `() => AdministrativeDivision[]`                       |
| `findByAncestor` | Find divisions by its ancestor code.      | `(code:string) => AdministrativeDivision[]`            |
| `findByParent`   | Find divisions by its parent code.        | `(code:string) => AdministrativeDivision[]`            |
| `findOne`        | Find division by code.                    | `(code:string) => AdministrativeDivision \| undefined` |
| `searchName`     | Search division by either Khmer or Latin. | `(keyword: string) => AdministrativeDivision[]`        |

##Types

```typescript
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
```

## Data and Inspiration

- <a href="https://github.com/dwilkie/pumi">pumi</a>
- <a href="https://github.com/kruyvanna/node-pumi">pumi-node</a>
- <a href="https://github.com/seanghay/pumi-js">pumi-js</a>
