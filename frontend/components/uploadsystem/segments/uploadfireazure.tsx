'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReviewStates, UploadFireAzureProps } from '@/config/macros/uploadsystemmacros';
import { FileWithPath } from 'react-dropzone';
import { Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/joy';
import { LinearProgressWithLabel } from '@/components/client/clientmacros';
import { useOrgCensusContext, usePlotContext, useSiteContext } from '@/app/contexts/userselectionprovider';

const UploadFireAzure: React.FC<UploadFireAzureProps> = ({
  acceptedFiles,
  uploadForm,
  setIsDataUnsaved,
  user,
  setUploadError,
  setErrorComponent,
  setReviewState,
  allRowToCMID,
  cmErrors
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<string[]>([]);
  const [totalOperations, setTotalOperations] = useState(0);
  const [completedOperations, setCompletedOperations] = useState<number>(0);
  const [currentlyRunning, setCurrentlyRunning] = useState('');
  const [refreshError, setRefreshError] = useState<string | null>(null); // For tracking refresh errors
  const [continueDisabled, setContinueDisabled] = useState<boolean>(true); // To control the Continue button

  const hasUploaded = useRef(false);
  const currentPlot = usePlotContext();
  const currentCensus = useOrgCensusContext();
  const currentSite = useSiteContext();

  const mapCMErrorsToFileRowErrors = (fileName: string) => {
    return cmErrors
      .filter(error => allRowToCMID.some(row => row.fileName === fileName && row.coreMeasurementID === error.coreMeasurementID))
      .flatMap(error => {
        const relatedRow = allRowToCMID.find(row => row.coreMeasurementID === error.coreMeasurementID);
        return error.validationErrorIDs.map(validationErrorID => ({
          stemtag: relatedRow?.row.stemtag,
          tag: relatedRow?.row.tag,
          validationErrorID: validationErrorID
        }));
      });
  };

  const uploadToStorage = useCallback(
    async (file: FileWithPath) => {
      try {
        setCurrentlyRunning(`File ${file.name} uploading to Azure Storage...`);
        const formData = new FormData();
        formData.append(file.name, file);
        if (uploadForm === 'measurements') {
          const fileRowErrors = mapCMErrorsToFileRowErrors(file.name);
          formData.append('fileRowErrors', JSON.stringify(fileRowErrors)); // Append validation errors to formData
        }
        const response = await fetch(
          `/api/filehandlers/storageload?fileName=${file.name}&plot=${currentPlot?.plotName?.trim().toLowerCase()}&census=${currentCensus?.dateRanges[0].censusID ? currentCensus?.dateRanges[0].censusID.toString().trim() : 0}&user=${user}&formType=${uploadForm}`,
          {
            method: 'POST',
            body: formData
          }
        );
        setCompletedOperations(prevCompleted => prevCompleted + 1);
        return response.ok ? 'Storage load successful' : 'Storage load failed';
      } catch (error) {
        setUploadError(error);
        setErrorComponent('UploadFire');
        setReviewState(ReviewStates.ERRORS);
      }
    },
    [currentCensus?.dateRanges[0].censusID, currentPlot?.plotName, setErrorComponent, setReviewState, setUploadError, user, cmErrors, allRowToCMID]
  );

  const refreshViews = useCallback(
    async (fileName: string) => {
      try {
        const errorMessages: string[] = []; // Track errors

        // Refresh measurement summary view
        setCurrentlyRunning(`Refreshing measurement summary view for "${fileName}"...`);
        const refreshSummaryResponse = await fetch(`/api/refreshviews/measurementssummary/${currentSite?.schemaName}`, { method: 'POST' });
        if (!refreshSummaryResponse.ok) {
          errorMessages.push('Failed to refresh measurement summary view.');
        } else {
          setCompletedOperations(prevCompleted => prevCompleted + 1);
        }

        // Refresh full table view
        setCurrentlyRunning(`Refreshing full table view for "${fileName}"...`);
        const refreshViewResponse = await fetch(`/api/refreshviews/viewfulltable/${currentSite?.schemaName}`, { method: 'POST' });
        if (!refreshViewResponse.ok) {
          errorMessages.push('Failed to refresh full table view.');
        } else {
          setCompletedOperations(prevCompleted => prevCompleted + 1);
        }

        // If there are any errors, show them to the user and disable "Continue" until acknowledged
        if (errorMessages.length > 0) {
          setRefreshError(errorMessages.join(' '));
          setContinueDisabled(false);
        }
      } catch (error) {
        setUploadError(error);
        setErrorComponent('UploadFireAzure');
        setReviewState(ReviewStates.ERRORS);
      }
    },
    [currentSite?.schemaName, setUploadError, setErrorComponent, setReviewState]
  );

  useEffect(() => {
    const calculateTotalOperations = () => {
      let totalOps = acceptedFiles.length; // Count each file as 1 operation for uploading
      if (uploadForm === 'measurements') {
        totalOps += acceptedFiles.length * 2; // For measurements, add 2 more operations per file for the refresh views
      }
      setTotalOperations(totalOps);
    };

    const uploadFiles = async () => {
      const uploadResults: string[] = [];

      // Calculate the total number of operations
      calculateTotalOperations();

      for (const file of acceptedFiles) {
        const storageResult = await uploadToStorage(file);
        uploadResults.push(`File: ${file.name}, Storage: ${storageResult}`);

        if (uploadForm === 'measurements') {
          await refreshViews(file.name);
        }
      }

      setResults(uploadResults);
      setLoading(false);
      setIsDataUnsaved(false);
    };

    if (!hasUploaded.current) {
      uploadFiles().catch(console.error);
      hasUploaded.current = true;
    }
  }, [acceptedFiles, uploadToStorage, refreshViews, uploadForm, setIsDataUnsaved]);

  useEffect(() => {
    if (!loading && completedOperations === totalOperations && !refreshError) {
      setReviewState(ReviewStates.COMPLETE);
    }
  }, [loading, completedOperations, totalOperations, refreshError]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            mt: 4
          }}
        >
          <Stack direction={'column'}>
            <Typography variant="h6" gutterBottom>{`Total Operations: ${totalOperations}`}</Typography>
            <LinearProgressWithLabel variant={'determinate'} value={(completedOperations / totalOperations) * 100} currentlyrunningmsg={currentlyRunning} />
          </Stack>
        </Box>
      ) : refreshError ? (
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            mt: 4
          }}
        >
          <Stack direction={'column'} sx={{ display: 'inherit' }}>
            <Typography variant="h5" gutterBottom>
              Some errors occurred during refresh:
            </Typography>
            <Typography color="error">{refreshError}</Typography>
            <Button variant="contained" onClick={() => setRefreshError(null)} disabled={continueDisabled}>
              Continue
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            mt: 4
          }}
        >
          <Stack direction={'column'} sx={{ display: 'inherit' }}>
            <Typography variant="h5" gutterBottom>
              Upload Complete
            </Typography>
            {results.map(result => (
              <Typography key={result}>{result}</Typography>
            ))}
            <Typography>Azure upload complete! Finalizing changes...</Typography>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default UploadFireAzure;
