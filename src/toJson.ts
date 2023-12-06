import { generateAllDivisions, writeDivisionToJsonFile } from './utils';

const writeAll = async () => {
  const data = await generateAllDivisions();

  Object.entries(data).map(
    async ([key, value]) => await writeDivisionToJsonFile(key, value),
  );
};

writeAll();
