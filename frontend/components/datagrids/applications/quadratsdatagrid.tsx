"use client";
import {GridColDef, GridRowId, GridRowModes, GridRowModesModel, GridRowsProp} from "@mui/x-data-grid";
import {AlertProps} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {QuadratsGridColumns as BaseQuadratsGridColumns, Quadrat} from '@/config/sqlrdsdefinitions/tables/quadratrds';
import {
  useOrgCensusContext,
  usePlotContext,
  useQuadratDispatch,
} from "@/app/contexts/userselectionprovider";
import {randomId} from "@mui/x-data-grid-generator";
import DataGridCommons from "@/components/datagrids/datagridcommons";
import {Box, Button, IconButton, Modal, ModalDialog, Stack, Typography} from "@mui/joy";
import {useSession} from "next-auth/react";
import UploadParentModal from "@/components/uploadsystemhelpers/uploadparentmodal";

export default function QuadratsDataGrid() {
  const initialRows: GridRowsProp = [
    {
      id: 0,
      quadratID: 0,
      plotID: 0,
      censusID: 0,
      quadratName: '',
      dimensionX: 0,
      dimensionY: 0,
      area: 0,
      unit: '',
      quadratShape: '',
    },
  ];
  const [rows, setRows] = React.useState(initialRows);
  const [rowCount, setRowCount] = useState(0);  // total number of rows
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [locked, setLocked] = useState(false);
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isNewRowAdded, setIsNewRowAdded] = useState<boolean>(false);
  const [shouldAddRowAfterFetch, setShouldAddRowAfterFetch] = useState(false);
  // const [censusOptions, setCensusOptions] = useState<GridSelections[]>([]);
  const {data: session} = useSession();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormType, setUploadFormType] = useState<'quadrats' | 'subquadrats'>('quadrats');

  let currentPlot = usePlotContext();
  let currentCensus = useOrgCensusContext();
  let quadratDispatch = useQuadratDispatch();

  useEffect(() => {
    if (currentCensus !== undefined) {
      setLocked(currentCensus.dateRanges[0].endDate !== undefined); // if the end date is not undefined, then grid should be locked
    }
  }, [currentCensus]);

  const handleSelectQuadrat = useCallback((quadratID: number | null) => {
    // we want to select a quadrat contextually when using this grid FOR subquadrats selection
    // however, this information should not be retained, as the user might select a different quadrat or change quadrat information
    // thus, we add the `| null` to the function and ensure that the context is properly reset when the user is done making changes or cancels their changes.
    if (quadratID === null) quadratDispatch && quadratDispatch({quadrat: undefined}).catch(console.error); // dispatches are asynchronous
    else {
      const selectedQuadrat = rows.find(row => row.quadratID === quadratID) as Quadrat; // GridValidRowModel needs to be cast to Quadrat
      if (selectedQuadrat && quadratDispatch) quadratDispatch({quadrat: selectedQuadrat}).catch(console.error);
    }
  }, [rows, quadratDispatch]);

  const addNewRowToGrid = () => {
    const id = randomId();
    const nextQuadratID = (rows.length > 0
      ? rows.reduce((max, row) => Math.max(row.quadratID, max), 0)
      : 0) + 1;
    const newRow = {
      id: id,
      quadratID: nextQuadratID,
      plotID: currentPlot ? currentPlot.id : 0,
      censusID: currentCensus ? currentCensus.dateRanges[0].censusID : 0,
      quadratName: '',
      dimensionX: 0,
      dimensionY: 0,
      area: 0,
      unit: '',
      quadratShape: '',
      isNew: true,
    };
    // Add the new row to the state
    setRows(oldRows => [...oldRows, newRow]);
    // Set editing mode for the new row
    setRowModesModel(oldModel => ({
      ...oldModel,
      [id]: {mode: GridRowModes.Edit, fieldToFocus: 'quadratName'},
    }));
  };
  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 3, width: '100%'}}>
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'warning.main',
          borderRadius: '4px',
          p: 2
        }}>
          <Box sx={{flexGrow: 1}}>
            {session?.user.isAdmin && (
              <Typography level={"title-lg"} sx={{color: "#ffa726"}}>
                Note: ADMINISTRATOR VIEW
              </Typography>
            )}
            <Typography level={"title-md"} sx={{color: "#ffa726"}}>
              Note: This is a locked view and will not allow modification.
            </Typography>
            <Typography level={"body-md"} sx={{color: "#ffa726"}}>
              Please use this view as a way to confirm changes made to measurements.
            </Typography>
          </Box>

          {/* Upload Button */}
          <Button onClick={() => {
            setIsUploadModalOpen(true);
            setUploadFormType('quadrats');
          }} color={'primary'}>
            Upload Quadrats
          </Button>
          {/* <Button onClick={() => {
            setIsUploadModalOpen(true);
            setUploadFormType('subquadrats');
          }} color={'neutral'}>
            Upload Subquadrats
          </Button> */}
        </Box>
      </Box>
      <UploadParentModal isUploadModalOpen={isUploadModalOpen} handleCloseUploadModal={() => {
        setIsUploadModalOpen(false);
        setRefresh(true);
      }} formType={uploadFormType}/>
      <DataGridCommons
        locked={locked}
        gridType="quadrats"
        gridColumns={BaseQuadratsGridColumns}
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
        handleSelectQuadrat={handleSelectQuadrat}
      />
    </>
  );
}