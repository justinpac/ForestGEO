// attributes datagrid
"use client";
import { GridRowsProp } from "@mui/x-data-grid";
import { AlertProps } from "@mui/material";
import React, { useState } from "react";
import { randomId } from "@mui/x-data-grid-generator";
import DataGridCommons from "@/components/datagrids/datagridcommons";
import { Box, Button, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import UploadParentModal from "@/components/uploadsystemhelpers/uploadparentmodal";
import { AllTaxonomiesViewGridColumns } from "@/config/sqlrdsdefinitions/views/alltaxonomyviewrds";

export default function AllTaxonomiesViewDataGrid() {
  const initialRows: GridRowsProp = [
    {
      id: 0,
      speciesID: 0,
      speciesCode: '',
      familyID: 0,
      family: '',
      genusID: 0,
      genus: '',
      genusAuthority: '',
      speciesName: '',
      subspeciesName: '',
      speciesIDLevel: '',
      speciesAuthority: '',
      subspeciesAuthority: '',
      currentTaxonFlag: null,
      obsoleteTaxonFlag: null,
      fieldFamily: '',
      speciesDescription: '',
      referenceID: 0,
      publicationTitle: '',
      dateOfPublication: null,
      citation: '',
    }
  ];
  const [rows, setRows] = useState(initialRows);
  const [rowCount, setRowCount] = useState(0);
  const [rowModesModel, setRowModesModel] = useState({});
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isNewRowAdded, setIsNewRowAdded] = useState(false);
  const [shouldAddRowAfterFetch, setShouldAddRowAfterFetch] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();

  const addNewRowToGrid = () => {
    const id = randomId();
    const newRow = {
      id,
      speciesID: 0,
      speciesCode: '',
      familyID: 0,
      family: '',
      genusID: 0,
      genus: '',
      genusAuthority: '',
      speciesName: '',
      subspeciesName: '',
      speciesIDLevel: '',
      speciesAuthority: '',
      subspeciesAuthority: '',
      currentTaxonFlag: null,
      obsoleteTaxonFlag: null,
      fieldFamily: '',
      speciesDescription: '',
      referenceID: 0,
      publicationTitle: '',
      dateOfPublication: null,
      citation: '',
      isNew: true,
    };
    setRows(oldRows => [...oldRows ?? [], newRow]);
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: { mode: 'edit', fieldToFocus: 'code' },
    }));
    console.log('attributes addnewrowtogrid triggered');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%' }}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'warning.main',
          borderRadius: '4px',
          p: 2
        }}>
          <Box sx={{ flexGrow: 1 }}>
            {session?.user.isAdmin && (
              <Typography level={"title-lg"} sx={{ color: "#ffa726" }}>
                Note: ADMINISTRATOR VIEW
              </Typography>
            )}
          </Box>


          {/* Upload Button */}
          <Button onClick={() => setIsUploadModalOpen(true)} variant="solid" color="primary">Upload</Button>
        </Box>
      </Box>

      <UploadParentModal isUploadModalOpen={isUploadModalOpen} handleCloseUploadModal={() => {
        setIsUploadModalOpen(false);
        setRefresh(true);
      }} formType={"species"} />

      <DataGridCommons
        gridType="alltaxonomiesview"
        gridColumns={AllTaxonomiesViewGridColumns}
        rows={rows}
        setRows={setRows}
        rowCount={rowCount}
        setRowCount={setRowCount}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        refresh={refresh}
        setRefresh={setRefresh}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        isNewRowAdded={isNewRowAdded}
        setIsNewRowAdded={setIsNewRowAdded}
        shouldAddRowAfterFetch={shouldAddRowAfterFetch}
        setShouldAddRowAfterFetch={setShouldAddRowAfterFetch}
        addNewRowToGrid={addNewRowToGrid}
      />
    </>
  );
}