export type Tree = {
  Type: string;
  CensusId: number;
  PlotId: number;
  SiteId: 0;
  Tag: string;
  Subquadrat: number;
  SpCode: string;
  StemTag: string;
  DBH: number;
  Htmeas: number;
  Codes: string;
  Comments: string;
  Errors?: CloudValidationError[]; // Errors resulting from cloud-side validation when POST'ing the tree.
};

export type CloudValidationError = {
  ErrorCode: number
  Column: string
  Message: string
}
