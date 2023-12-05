"use client";
import React, {createContext, Dispatch, useContext, useReducer} from 'react';
import {allCensus, allQuadrats, Plot, plots} from "@/config/macros";
import {GridRowProps, GridValidRowModel} from "@mui/x-data-grid";
import {json} from "stream/consumers";

export const PlotsContext = createContext<Plot | null>(null);
export const CensusContext = createContext<number | null>(null);
export const QuadratContext = createContext<number | null>(null);
export const FirstLoadContext = createContext<boolean | null>(null);
export const AttributeLoadContext = createContext<GridValidRowModel[] | null>(null);
export const CensusLoadContext = createContext<GridValidRowModel[] | null>(null);
export const PlotsDispatchContext = createContext<Dispatch<{ plotKey: string | null }> | null>(null);
export const CensusDispatchContext = createContext<Dispatch<{ census: number | null }> | null>(null);
export const QuadratDispatchContext = createContext<Dispatch<{ quadrat: number | null }> | null>(null);
export const FirstLoadDispatchContext = createContext<Dispatch<{ firstLoad: boolean }> | null>(null);
export const AttributeLoadDispatchContext = createContext<Dispatch<{attributeLoad: GridValidRowModel[] | null}> | null>(null);
export const CensusLoadDispatchContext = createContext<Dispatch<{censusLoad: GridValidRowModel[] | null}> | null>(null);

export function ContextsProvider({children}: { children: React.ReactNode }) {
  const [plot, plotDispatch] = useReducer(
    plotsReducer,
    null
  );
  const [census, censusDispatch] = useReducer(
    censusReducer,
    null
  );
  const [quadrat, quadratDispatch] = useReducer(
    quadratReducer,
    null
  )
  const [firstLoad, firstLoadDispatch] = useReducer(
    firstLoadReducer,
    true
  )
  const [attributeLoad, attributeLoadDispatch] = useReducer(
    attributeLoadReducer,
    null
  )
  
  const [censusLoad, censusLoadDispatch] = useReducer(
    censusLoadReducer,
    null
  )
  
  
  return (
    <PlotsContext.Provider value={plot}>
      <PlotsDispatchContext.Provider value={plotDispatch}>
        <CensusContext.Provider value={census}>
          <CensusDispatchContext.Provider value={censusDispatch}>
            <QuadratContext.Provider value={quadrat}>
              <QuadratDispatchContext.Provider value={quadratDispatch}>
                <FirstLoadContext.Provider value={firstLoad}>
                  <FirstLoadDispatchContext.Provider value={firstLoadDispatch}>
                    <AttributeLoadContext.Provider value={attributeLoad}>
                      <AttributeLoadDispatchContext.Provider value={attributeLoadDispatch}>
                        <CensusLoadContext.Provider value={censusLoad}>
                          <CensusLoadDispatchContext.Provider value={censusLoadDispatch}>
                            {children}
                          </CensusLoadDispatchContext.Provider>
                        </CensusLoadContext.Provider>
                      </AttributeLoadDispatchContext.Provider>
                    </AttributeLoadContext.Provider>
                  </FirstLoadDispatchContext.Provider>
                </FirstLoadContext.Provider>
              </QuadratDispatchContext.Provider>
            </QuadratContext.Provider>
          </CensusDispatchContext.Provider>
        </CensusContext.Provider>
      </PlotsDispatchContext.Provider>
    </PlotsContext.Provider>
  );
}

function plotsReducer(currentPlot: any, action: { plotKey: string | null }) {
  if (action.plotKey == null) return null;
  else if (plots.find((p) => p.key == action.plotKey)) return plots.find((p) => p.key == action.plotKey);
  else return currentPlot;
}

function censusReducer(currentCensus: any, action: { census: number | null }) {
  if (action.census == null) return null;
  else if (allCensus.includes(action.census)) return action.census;
  else return currentCensus;
}

function quadratReducer(currentQuadrat: any, action: { quadrat: number | null }) {
  if (action.quadrat == null) return null;
  else if (allQuadrats.includes(action.quadrat)) return action.quadrat;
  else return currentQuadrat;
}

function firstLoadReducer(currentState: any, action: { firstLoad: boolean | null }) {
  if (action.firstLoad == false && currentState) return action.firstLoad;
  else return currentState;
}

function attributeLoadReducer(currentAttributeLoad: any, action: { attributeLoad: GridValidRowModel[] | null}) {
  return action.attributeLoad;
}

function censusLoadReducer(currentCensusLoad: any, action: { censusLoad: GridValidRowModel[] | null}) {
  return action.censusLoad;
}

export function usePlotContext() {
  return useContext(PlotsContext);
}

export function usePlotDispatch() {
  return useContext(PlotsDispatchContext);
}

export function useCensusContext() {
  return useContext(CensusContext);
}

export function useCensusDispatch() {
  return useContext(CensusDispatchContext);
}

export function useQuadratContext() {
  return useContext(QuadratContext);
}

export function useQuadratDispatch() {
  return useContext(QuadratDispatchContext);
}

export function useFirstLoadContext() {
  return useContext(FirstLoadContext);
}

export function useFirstLoadDispatch() {
  return useContext(FirstLoadDispatchContext);
}

export function useAttributeLoadContext() {
  return useContext(AttributeLoadContext);
}

export function useAttributeLoadDispatch() {
  return useContext(AttributeLoadDispatchContext);
}