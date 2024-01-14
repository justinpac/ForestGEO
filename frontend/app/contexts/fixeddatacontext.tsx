"use client";

import React, {createContext, Dispatch, useContext, useReducer} from "react";
import {
  AttributesRDS,
  CensusRDS,
  CoreMeasurementsRDS,
  PersonnelRDS,
  PlotRDS,
  QuadratsRDS,
  SpeciesRDS,
  SubSpeciesRDS
} from "@/config/sqlmacros";

export const CoreMeasurementLoadContext = createContext<CoreMeasurementsRDS[] | null>(null);
export const AttributeLoadContext = createContext<AttributesRDS[] | null>(null);
export const CensusLoadContext = createContext<CensusRDS[] | null>(null);
export const PersonnelLoadContext = createContext<PersonnelRDS[] | null>(null);
export const QuadratsLoadContext = createContext<QuadratsRDS[] | null>(null);
export const SpeciesLoadContext = createContext<SpeciesRDS[] | null>(null);
export const SubSpeciesLoadContext = createContext<SubSpeciesRDS[] | null>(null);
export const PlotsLoadContext = createContext<PlotRDS[] | null>(null);
export const CoreMeasurementLoadDispatchContext = createContext<Dispatch<{
  coreMeasurementLoad: CoreMeasurementsRDS[] | null
}> | null>(null);
export const AttributeLoadDispatchContext = createContext<Dispatch<{
  attributeLoad: AttributesRDS[] | null
}> | null>(null);
export const CensusLoadDispatchContext = createContext<Dispatch<{
  censusLoad: CensusRDS[] | null
}> | null>(null);
export const PersonnelLoadDispatchContext = createContext<Dispatch<{
  personnelLoad: PersonnelRDS[] | null
}> | null>(null);
export const QuadratsLoadDispatchContext = createContext<Dispatch<{
  quadratsLoad: QuadratsRDS[] | null
}> | null>(null);
export const SpeciesLoadDispatchContext = createContext<Dispatch<{
  speciesLoad: SpeciesRDS[] | null
}> | null>(null);
export const SubSpeciesLoadDispatchContext = createContext<Dispatch<{
  subSpeciesLoad: SubSpeciesRDS[] | null
}> | null>(null);
export const PlotsLoadDispatchContext = createContext<Dispatch<{ plotsLoad: PlotRDS[] | null }> | null>(null);
export function FixedDataProvider({children}: { children: React.ReactNode }) {
  const [coreMeasurementLoad, coreMeasurementLoadDispatch] = useReducer(
    coreMeasurementLoadReducer,
    null
  )
  const [attributeLoad, attributeLoadDispatch] = useReducer(
    attributeLoadReducer,
    null
  )
  const [censusLoad, censusLoadDispatch] = useReducer(
    censusLoadReducer,
    null
  )
  const [personnelLoad, personnelLoadDispatch] = useReducer(
    personnelLoadReducer,
    null
  )
  const [quadratsLoad, quadratsLoadDispatch] = useReducer(
    quadratsLoadReducer,
    null
  )
  const [speciesLoad, speciesLoadDispatch] = useReducer(
    speciesLoadReducer,
    null
  )
  const [subSpeciesLoad, subSpeciesLoadDispatch] = useReducer(
    subSpeciesLoadReducer,
    null
  )
  const [plotsLoad, plotsLoadDispatch] = useReducer(
    plotsLoadReducer,
    null
  )

  return (
    <CoreMeasurementLoadContext.Provider value={coreMeasurementLoad}>
      <CoreMeasurementLoadDispatchContext.Provider value={coreMeasurementLoadDispatch}>
        <AttributeLoadContext.Provider value={attributeLoad}>
          <AttributeLoadDispatchContext.Provider value={attributeLoadDispatch}>
            <CensusLoadContext.Provider value={censusLoad}>
              <CensusLoadDispatchContext.Provider value={censusLoadDispatch}>
                <PersonnelLoadContext.Provider value={personnelLoad}>
                  <PersonnelLoadDispatchContext.Provider value={personnelLoadDispatch}>
                    <QuadratsLoadContext.Provider value={quadratsLoad}>
                      <QuadratsLoadDispatchContext.Provider value={quadratsLoadDispatch}>
                        <SpeciesLoadContext.Provider value={speciesLoad}>
                          <SpeciesLoadDispatchContext.Provider value={speciesLoadDispatch}>
                            <SubSpeciesLoadContext.Provider value={subSpeciesLoad}>
                              <SubSpeciesLoadDispatchContext.Provider value={subSpeciesLoadDispatch}>
                                <PlotsLoadContext.Provider value={plotsLoad}>
                                  <PlotsLoadDispatchContext.Provider value={plotsLoadDispatch}>
                                    {children}
                                  </PlotsLoadDispatchContext.Provider>
                                </PlotsLoadContext.Provider>
                              </SubSpeciesLoadDispatchContext.Provider>
                            </SubSpeciesLoadContext.Provider>
                          </SpeciesLoadDispatchContext.Provider>
                        </SpeciesLoadContext.Provider>
                      </QuadratsLoadDispatchContext.Provider>
                    </QuadratsLoadContext.Provider>
                  </PersonnelLoadDispatchContext.Provider>
                </PersonnelLoadContext.Provider>
              </CensusLoadDispatchContext.Provider>
            </CensusLoadContext.Provider>
          </AttributeLoadDispatchContext.Provider>
        </AttributeLoadContext.Provider>
      </CoreMeasurementLoadDispatchContext.Provider>
    </CoreMeasurementLoadContext.Provider>
  );
}

function coreMeasurementLoadReducer(currentCoreMeasurementLoad: any, action: {
  coreMeasurementLoad: CoreMeasurementsRDS[] | null
}) {
  return action.coreMeasurementLoad;
}

function attributeLoadReducer(currentAttributeLoad: any, action: { attributeLoad: AttributesRDS[] | null }) {
  return action.attributeLoad;
}

function censusLoadReducer(currentCensusLoad: any, action: { censusLoad: CensusRDS[] | null }) {
  return action.censusLoad;
}

function personnelLoadReducer(currentPersonnelLoad: any, action: { personnelLoad: PersonnelRDS[] | null }) {
  return action.personnelLoad;
}

function quadratsLoadReducer(currentQuadratsLoad: any, action: { quadratsLoad: QuadratsRDS[] | null }) {
  return action.quadratsLoad;
}

function speciesLoadReducer(currentSpeciesLoad: any, action: { speciesLoad: SpeciesRDS[] | null }) {
  return action.speciesLoad;
}

function subSpeciesLoadReducer(currentSpeciesLoad: any, action: { subSpeciesLoad: SubSpeciesRDS[] | null }) {
  return action.subSpeciesLoad;
}

function plotsLoadReducer(currentPlotsLoad: any, action: { plotsLoad: PlotRDS[] | null }) {
  return action.plotsLoad;
}


export function useCoreMeasurementLoadContext() {
  return useContext(CoreMeasurementLoadContext);
}

export function useCoreMeasurementLoadDispatch() {
  return useContext(CoreMeasurementLoadDispatchContext);
}

export function useAttributeLoadContext() {
  return useContext(AttributeLoadContext);
}

export function useAttributeLoadDispatch() {
  return useContext(AttributeLoadDispatchContext);
}

export function useCensusLoadContext() {
  return useContext(CensusLoadContext);
}

export function useCensusLoadDispatch() {
  return useContext(CensusLoadDispatchContext);
}

export function usePersonnelLoadContext() {
  return useContext(PersonnelLoadContext);
}

export function usePersonnelLoadDispatch() {
  return useContext(PersonnelLoadDispatchContext);
}

export function useQuadratsLoadContext() {
  return useContext(QuadratsLoadContext);
}

export function useQuadratsLoadDispatch() {
  return useContext(QuadratsLoadDispatchContext);
}

export function useSpeciesLoadContext() {
  return useContext(SpeciesLoadContext);
}

export function useSpeciesLoadDispatch() {
  return useContext(SpeciesLoadDispatchContext);
}

export function useSubSpeciesLoadContext() {
  return useContext(SubSpeciesLoadContext);
}

export function useSubSpeciesLoadDispatch() {
  return useContext(SubSpeciesLoadDispatchContext);
}

export function usePlotsLoadContext() {
  return useContext(PlotsLoadContext);
}

export function usePlotsLoadDispatch() {
  return useContext(PlotsLoadDispatchContext);
}