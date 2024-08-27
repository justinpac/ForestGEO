import { SpecialProcessingProps } from '@/components/processors/processormacros';
import { booleanToBit } from '@/config/macros';
import { FamilyResult, GenusResult, SpeciesResult } from '@/config/sqlrdsdefinitions/taxonomies';
import { createError, handleUpsert } from '@/config/utils';

function cleanInputData(data: any) {
  const cleanedData: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      cleanedData[key] = data[key] !== undefined ? data[key] : null;
    }
  }
  return cleanedData;
}

export async function processSpecies(props: Readonly<SpecialProcessingProps>): Promise<number | undefined> {
  const { connection, rowData, schema } = props;
  console.log('rowData: ', rowData);

  try {
    await connection.beginTransaction();

    // Handle Family insertion/updation
    let familyID: number | undefined;
    if (rowData.family) {
      familyID = await handleUpsert<FamilyResult>(connection, schema, 'family', { Family: rowData.family }, 'FamilyID');
    }

    // Handle Genus insertion/updation
    let genusID: number | undefined;
    if (rowData.genus) {
      genusID = await handleUpsert<GenusResult>(connection, schema, 'genus', { Genus: rowData.genus, FamilyID: familyID }, 'GenusID');
    }

    // Handle Species insertion/updation
    let speciesID: number | undefined;
    if (rowData.spcode) {
      const speciesData = {
        speciesCode: rowData.spcode,
        speciesName: rowData.species,
        subspeciesName: rowData.subspecies,
        idLevel: rowData.IDLevel,
        speciesAuthority: rowData.authority,
        subspeciesAuthority: rowData.subauthority,
        genusID: genusID,
        currentTaxonFlag: booleanToBit(true)
      };

      const cleanedSpeciesData = cleanInputData(speciesData);
      speciesID = await handleUpsert<SpeciesResult>(connection, schema, 'species', cleanedSpeciesData, 'SpeciesID');
    }

    await connection.commit();
    console.log('Upsert successful');
    return speciesID;
  } catch (error: any) {
    await connection.rollback();
    console.error('Upsert failed:', error.message);
    throw createError('Upsert failed', { error });
  }
}
