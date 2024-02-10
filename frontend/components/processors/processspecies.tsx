import {booleanToBit, FileRow} from "@/config/macros";
import {PoolConnection} from 'mysql2/promise';
import {runQuery} from "@/components/processors/processormacros";

export async function processSpecies(connection: PoolConnection, rowData: FileRow, plotKey: string, censusID: string, fullName: string) {
  const schema = process.env.AZURE_SQL_SCHEMA;
  if (!schema) throw new Error("Environmental variable extraction for schema failed");

  try {
    const genusResult = await runQuery(connection, `
      SELECT GenusID FROM ${schema}.Genus WHERE Genus = ?;
    `, [rowData.genus]);

    const genusID = genusResult[0].GenusID;

    /**
     *       "spcode": "Species.SpeciesCode",
     *       "genus": "Genus.GenusName",
     *       "species": "Species.SpeciesName",
     *       "IDLevel": "Species.IDLevel",
     *       "family": "Species.Family",
     *       "authority": "Species.Authority"
     */

    // Insert or update Species
    await runQuery(connection, `
      INSERT INTO ${schema}.Species (GenusID, SpeciesCode, CurrentTaxonFlag, ObsoleteTaxonFlag, SpeciesName, IDLevel, Authority, FieldFamily, Description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      GenusID = VALUES(GenusID),
      SpeciesCode = VALUES(SpeciesCode),
      CurrentTaxonFlag = VALUES(CurrentTaxonFlag),
      ObsoleteTaxonFlag = VALUES(ObsoleteTaxonFlag),
      SpeciesName = VALUES(SpeciesName),
      IDLevel = VALUES(IDLevel),
      Authority = VALUES(Authority)
      FieldFamily = VALUES(FieldFamily)
      Description = VALUES(Description);
    `, [genusID,
      rowData.spcode,
      booleanToBit(true),
      booleanToBit(false),
      rowData.species,
      rowData.IDLevel,
      rowData.authority,
      rowData.family,
      null]);
  } catch (error: any) {
    console.error('Error processing species:', error.message);
    throw error;
  }
}