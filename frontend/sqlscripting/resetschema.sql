set
foreign_key_checks = 0;
truncate attributes;
truncate census;
truncate cmattributes;
truncate cmverrors;
truncate coremeasurements;
truncate family;
truncate genus;
truncate personnel;
truncate plots;
truncate quadratpersonnel;
truncate quadrats;
truncate reference;
truncate roles;
truncate species;
truncate specieslimits;
truncate specimens;
truncate stems;
truncate subquadrats;
truncate unifiedchangelog;
truncate validationchangelog;
DROP VIEW IF EXISTS `alltaxonomiesview`;
DROP VIEW IF EXISTS `measurementssummaryview`;
DROP VIEW IF EXISTS `stemtaxonomiesview`;
DROP VIEW IF EXISTS `viewfulltableview`;
DROP PROCEDURE IF EXISTS `UpdateValidationStatus`;
DROP PROCEDURE IF EXISTS `ValidateDBHGrowthExceedsMax`;
DROP PROCEDURE IF EXISTS `ValidateDBHShrinkageExceedsMax`;
DROP PROCEDURE IF EXISTS `ValidateFindAllInvalidSpeciesCodes`;
DROP PROCEDURE IF EXISTS `ValidateFindDuplicatedQuadratsByName`;
DROP PROCEDURE IF EXISTS `ValidateFindDuplicateStemTreeTagCombinationsPerCensus`;
DROP PROCEDURE IF EXISTS `ValidateFindMeasurementsOutsideCensusDateBoundsGroupByQuadrat`;
DROP PROCEDURE IF EXISTS `ValidateFindStemsInTreeWithDifferentSpecies`;
DROP PROCEDURE IF EXISTS `ValidateFindStemsOutsidePlots`;
DROP PROCEDURE IF EXISTS `ValidateFindTreeStemsInDifferentQuadrats`;
DROP PROCEDURE IF EXISTS `ValidateHOMUpperAndLowerBounds`;
DROP PROCEDURE IF EXISTS `ValidateScreenMeasuredDiameterMinMax`;
DROP PROCEDURE IF EXISTS `ValidateScreenStemsWithMeasurementsButDeadAttributes`;
set
foreign_key_checks = 1;