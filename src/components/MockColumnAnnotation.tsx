import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
} from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Typography, Button } from '@mui/material';
import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import Joyride, { CallBackProps, STATUS, Step, EVENTS } from 'react-joyride';
import assessmentData from '../assets/default_config/assessment.json';

interface MockAssessmentTerm {
  id: string;
  label: string;
  abbreviation: string;
}
import { DataType } from '../utils/internal_types';
import MockColumnAnnotationCard from './MockColumnAnnotationCard';
import MockTaxonomySidebar, { TaxonomyNode } from './MockTaxonomySidebar';
import MockSearchFilter from './MockSearchFilter';

const ALL_TERMS = assessmentData.flatMap((vocab: any) =>
  vocab.terms.map((term: any) => ({
    id: term.id,
    label: term.name,
    abbreviation: term.abbreviation || term.name
      .split(' ')
      .map((w: any) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 4),
  }))
);

const TERM_BY_ID = new Map(ALL_TERMS.map((t: MockAssessmentTerm) => [t.id, t]));

// -- Mock Data Definitions --

const MOCK_COLUMNS: any = {
  "participant_id": {
    "id": "participant_id",
    "name": "participant_id",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "redcap_event_name": {
    "id": "redcap_event_name",
    "name": "redcap_event_name",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "sex": {
    "id": "sex",
    "name": "sex",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "diagnosis_group_for_analysis": {
    "id": "diagnosis_group_for_analysis",
    "name": "diagnosis_group_for_analysis",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Semantic Fluency Actions (Raw score)": {
    "id": "Semantic Fluency Actions (Raw score)",
    "name": "Semantic Fluency Actions (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Copy raw": {
    "id": "Copy raw",
    "name": "Copy raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Letter Fluency Total (Automatic Calculation)": {
    "id": "Letter Fluency Total (Automatic Calculation)",
    "name": "Letter Fluency Total (Automatic Calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Stroop Colour and Word test (Golden) administered?": {
    "id": "Was the Stroop Colour and Word test (Golden) administered?",
    "name": "Was the Stroop Colour and Word test (Golden) administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Letter Fluency test administered?": {
    "id": "Was the Letter Fluency test administered?",
    "name": "Was the Letter Fluency test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Delayed recall raw": {
    "id": "Delayed recall raw",
    "name": "Delayed recall raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trail A Errors raw score": {
    "id": "Trail A Errors raw score",
    "name": "Trail A Errors raw score",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trial total 1,2,3 (Raw score)": {
    "id": "Trial total 1,2,3 (Raw score)",
    "name": "Trial total 1,2,3 (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Letter Fluency A (Raw score)": {
    "id": "Letter Fluency A (Raw score)",
    "name": "Letter Fluency A (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.1: Total errors (Automatic Calculation)": {
    "id": "Stroop - D-Kefs - Cond.1: Total errors (Automatic Calculation)",
    "name": "Stroop - D-Kefs - Cond.1: Total errors (Automatic Calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs, Cond. 1 - COLORS : Time (sec) (Raw score)": {
    "id": "Stroop - D-Kefs, Cond. 1 - COLORS : Time (sec) (Raw score)",
    "name": "Stroop - D-Kefs, Cond. 1 - COLORS : Time (sec) (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Rey Complex Figure Test administered?": {
    "id": "Was the Rey Complex Figure Test administered?",
    "name": "Was the Rey Complex Figure Test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond. 3 - 1 (time) (Automatic Calculation)": {
    "id": "Stroop - D-Kefs - Cond. 3 - 1 (time) (Automatic Calculation)",
    "name": "Stroop - D-Kefs - Cond. 3 - 1 (time) (Automatic Calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Semantic Fluency Total (Automatic Calculation)": {
    "id": "Semantic Fluency Total (Automatic Calculation)",
    "name": "Semantic Fluency Total (Automatic Calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - cond. 1: self-corrected errors (Raw score)": {
    "id": "Stroop - D-Kefs - cond. 1: self-corrected errors (Raw score)",
    "name": "Stroop - D-Kefs - cond. 1: self-corrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trail B Errors raw score": {
    "id": "Trail B Errors raw score",
    "name": "Trail B Errors raw score",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond. 3 - 1 (time)": {
    "id": "Stroop - D-Kefs - Cond. 3 - 1 (time)",
    "name": "Stroop - D-Kefs - Cond. 3 - 1 (time)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trail A raw score (time in sec.)": {
    "id": "Trail A raw score (time in sec.)",
    "name": "Trail A raw score (time in sec.)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Immediate recall time (sec)": {
    "id": "Immediate recall time (sec)",
    "name": "Immediate recall time (sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Main dominante (30 sec)": {
    "id": "Main dominante (30 sec)",
    "name": "Main dominante (30 sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN: colors, uncorrected errors": {
    "id": "STROOP GOLDEN: colors, uncorrected errors",
    "name": "STROOP GOLDEN: colors, uncorrected errors",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the WAIS IV Digit Span test administered?": {
    "id": "Was the WAIS IV Digit Span test administered?",
    "name": "Was the WAIS IV Digit Span test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Copy Clock raw (max 10)": {
    "id": "Copy Clock raw (max 10)",
    "name": "Copy Clock raw (max 10)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop GOLDEN : ink, self-corrected errors (raw score)": {
    "id": "Stroop GOLDEN : ink, self-corrected errors (raw score)",
    "name": "Stroop GOLDEN : ink, self-corrected errors (raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.3: self-corrected errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.3: self-corrected errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.3: self-corrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Main non dominante (30 sec)": {
    "id": "Main non dominante (30 sec)",
    "name": "Main non dominante (30 sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trial 1 raw": {
    "id": "Trial 1 raw",
    "name": "Trial 1 raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Repetitions total 1,2,3 (Raw score)": {
    "id": "Repetitions total 1,2,3 (Raw score)",
    "name": "Repetitions total 1,2,3 (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN, words, uncorrected errors (raw score)": {
    "id": "STROOP GOLDEN, words, uncorrected errors (raw score)",
    "name": "STROOP GOLDEN, words, uncorrected errors (raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "BNT sans indice + IS": {
    "id": "BNT sans indice + IS",
    "name": "BNT sans indice + IS",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Command Clock raw (max 10)": {
    "id": "Command Clock raw (max 10)",
    "name": "Command Clock raw (max 10)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Total Set-Loss errors": {
    "id": "Total Set-Loss errors",
    "name": "Total Set-Loss errors",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.3: Total errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.3: Total errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.3: Total errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trial 4 delayed (Raw score)": {
    "id": "Trial 4 delayed (Raw score)",
    "name": "Trial 4 delayed (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "BNT sans indice + IS + IP": {
    "id": "BNT sans indice + IS + IP",
    "name": "BNT sans indice + IS + IP",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trial 2 raw": {
    "id": "Trial 2 raw",
    "name": "Trial 2 raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Digit span forward - longest correct serie (Raw score)": {
    "id": "Digit span forward - longest correct serie (Raw score)",
    "name": "Digit span forward - longest correct serie (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.3: Total errors (Automatic calculation)": {
    "id": "Stroop - D-Kefs - Cond.3: Total errors (Automatic calculation)",
    "name": "Stroop - D-Kefs - Cond.3: Total errors (Automatic calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trial 3 raw": {
    "id": "Trial 3 raw",
    "name": "Trial 3 raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN : COLORS Number of responses": {
    "id": "STROOP GOLDEN : COLORS Number of responses",
    "name": "STROOP GOLDEN : COLORS Number of responses",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the CDT test administered?": {
    "id": "Was the CDT test administered?",
    "name": "Was the CDT test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Letter Fluency Total (Raw score)": {
    "id": "Letter Fluency Total (Raw score)",
    "name": "Letter Fluency Total (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.3: Uncorrected errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.3: Uncorrected errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.3: Uncorrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.2 WORDS: Time (sec) (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.2 WORDS: Time (sec) (Raw score)",
    "name": "Stroop - D-Kefs - Cond.2 WORDS: Time (sec) (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop GOLDEN, ink, uncorrected errors (raw score)": {
    "id": "Stroop GOLDEN, ink, uncorrected errors (raw score)",
    "name": "Stroop GOLDEN, ink, uncorrected errors (raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Main non dominante (1 min)": {
    "id": "Main non dominante (1 min)",
    "name": "Main non dominante (1 min)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.1: Total errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.1: Total errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.1: Total errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Boston Naming test administered?": {
    "id": "Was the Boston Naming test administered?",
    "name": "Was the Boston Naming test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.2: total errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.2: total errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.2: total errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Brixton test administered?": {
    "id": "Was the Brixton test administered?",
    "name": "Was the Brixton test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Digit Span Forward - total correct (Raw score)": {
    "id": "Digit Span Forward - total correct (Raw score)",
    "name": "Digit Span Forward - total correct (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Letter Fluency S (Raw score)": {
    "id": "Letter Fluency S (Raw score)",
    "name": "Letter Fluency S (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Brixton raw score": {
    "id": "Brixton raw score",
    "name": "Brixton raw score",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN : colors, self-corrected errors (raw scores)": {
    "id": "STROOP GOLDEN : colors, self-corrected errors (raw scores)",
    "name": "STROOP GOLDEN : colors, self-corrected errors (raw scores)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Main dominante (1 min)": {
    "id": "Main dominante (1 min)",
    "name": "Main dominante (1 min)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Digit span backward - longest correct serie (Raw score)": {
    "id": "Digit span backward - longest correct serie (Raw score)",
    "name": "Digit span backward - longest correct serie (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Semantic Fluency test administered?": {
    "id": "Was the Semantic Fluency test administered?",
    "name": "Was the Semantic Fluency test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.2: total errors (Automatic Calculation)": {
    "id": "Stroop - D-Kefs - Cond.2: total errors (Automatic Calculation)",
    "name": "Stroop - D-Kefs - Cond.2: total errors (Automatic Calculation)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Deux mains (30 sec)": {
    "id": "Deux mains (30 sec)",
    "name": "Deux mains (30 sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN : WORDS, number of responses": {
    "id": "STROOP GOLDEN : WORDS, number of responses",
    "name": "STROOP GOLDEN : WORDS, number of responses",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Stroop Colour and Word (D-KEFS) test administered?": {
    "id": "Was the Stroop Colour and Word (D-KEFS) test administered?",
    "name": "Was the Stroop Colour and Word (D-KEFS) test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Semantic Fluency Animals (Raw score)": {
    "id": "Semantic Fluency Animals (Raw score)",
    "name": "Semantic Fluency Animals (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Purdue pegboard administered?": {
    "id": "Was the Purdue pegboard administered?",
    "name": "Was the Purdue pegboard administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Trail B raw score (time in sec.)": {
    "id": "Trail B raw score (time in sec.)",
    "name": "Trail B raw score (time in sec.)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Letter Fluency F (Raw score)": {
    "id": "Letter Fluency F (Raw score)",
    "name": "Letter Fluency F (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Total repetition errors": {
    "id": "Total repetition errors",
    "name": "Total repetition errors",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Digit Span Backward - total correct (Raw score)": {
    "id": "Digit Span Backward - total correct (Raw score)",
    "name": "Digit Span Backward - total correct (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs -  Cond.2: Self-corrected errors (Raw score)": {
    "id": "Stroop - D-Kefs -  Cond.2: Self-corrected errors (Raw score)",
    "name": "Stroop - D-Kefs -  Cond.2: Self-corrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Delayed recall time (sec)": {
    "id": "Delayed recall time (sec)",
    "name": "Delayed recall time (sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.2: uncorrected errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.2: uncorrected errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.2: uncorrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop GOLDEN: INK Number of Responses": {
    "id": "Stroop GOLDEN: INK Number of Responses",
    "name": "Stroop GOLDEN: INK Number of Responses",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.3 - INK: Time (sec) (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.3 - INK: Time (sec) (Raw score)",
    "name": "Stroop - D-Kefs - Cond.3 - INK: Time (sec) (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "STROOP GOLDEN : words, self-corrected errors (raw score)": {
    "id": "STROOP GOLDEN : words, self-corrected errors (raw score)",
    "name": "STROOP GOLDEN : words, self-corrected errors (raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Intrusions total 1,2,3 (Raw score)": {
    "id": "Intrusions total 1,2,3 (Raw score)",
    "name": "Intrusions total 1,2,3 (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Copy time (sec)": {
    "id": "Copy time (sec)",
    "name": "Copy time (sec)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Semantic Fluency Total (Raw score)": {
    "id": "Semantic Fluency Total (Raw score)",
    "name": "Semantic Fluency Total (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Trails A B test administered?": {
    "id": "Was the Trails A B test administered?",
    "name": "Was the Trails A B test administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Stroop - D-Kefs - Cond.1: Uncorrected errors (Raw score)": {
    "id": "Stroop - D-Kefs - Cond.1: Uncorrected errors (Raw score)",
    "name": "Stroop - D-Kefs - Cond.1: Uncorrected errors (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Was the Hopkins Verbal Learning Test Revised administered?": {
    "id": "Was the Hopkins Verbal Learning Test Revised administered?",
    "name": "Was the Hopkins Verbal Learning Test Revised administered?",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Immediate recall raw": {
    "id": "Immediate recall raw",
    "name": "Immediate recall raw",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Total Repetition errors": {
    "id": "Total Repetition errors",
    "name": "Total Repetition errors",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "BNT sans indice (Raw score)": {
    "id": "BNT sans indice (Raw score)",
    "name": "BNT sans indice (Raw score)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "neuropsy_age": {
    "id": "neuropsy_age",
    "name": "neuropsy_age",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "neuropsy_age_diff": {
    "id": "neuropsy_age_diff",
    "name": "neuropsy_age_diff",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "MoCA Total Score": {
    "id": "MoCA Total Score",
    "name": "MoCA Total Score",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "moca_age": {
    "id": "moca_age",
    "name": "moca_age",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "moca_age_diff": {
    "id": "moca_age_diff",
    "name": "moca_age_diff",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Part I: Non-Motor Aspects of Experiences of Daily Living (nM-EDL)": {
    "id": "Part I: Non-Motor Aspects of Experiences of Daily Living (nM-EDL)",
    "name": "Part I: Non-Motor Aspects of Experiences of Daily Living (nM-EDL)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Part II: Motor Aspects of Experiences of Daily Living (M-EDL)": {
    "id": "Part II: Motor Aspects of Experiences of Daily Living (M-EDL)",
    "name": "Part II: Motor Aspects of Experiences of Daily Living (M-EDL)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Part III: Motor Examination (harmonized)": {
    "id": "Part III: Motor Examination (harmonized)",
    "name": "Part III: Motor Examination (harmonized)",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "Part IV: Motor Complications": {
    "id": "Part IV: Motor Complications",
    "name": "Part IV: Motor Complications",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "updrs_age": {
    "id": "updrs_age",
    "name": "updrs_age",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  },
  "updrs_age_diff": {
    "id": "updrs_age_diff",
    "name": "updrs_age_diff",
    "description": null,
    "dataType": null,
    "isMapped": false,
    "standardizedVariable": null,
    "term": null
  }
};





const MOCK_STANDARDIZED_VARIABLES: any = {
  std_age: { id: 'std_age', name: 'Age', variable_type: 'Continuous' },
  std_sex: { id: 'std_sex', name: 'Sex', variable_type: 'Categorical' },
  std_diagnosis: { id: 'std_diagnosis', name: 'Diagnosis', variable_type: 'Categorical' },
  std_assessment: {
    id: 'std_assessment',
    name: 'Assessment Tool',
    variable_type: 'Categorical',
    is_multi_column_measure: true,
  },
};


function MockColumnAnnotation({ onToggleMock }: { onToggleMock?: () => void }) {
  // -- Local State instead of Store --
  const [columns, setColumns] = useState(MOCK_COLUMNS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeDragEvent, setActiveDragEvent] = useState<DragStartEvent | null>(null);

  // -- Tour State --
  const [runTour, setRunTour] = useState(false);

  const tourSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to Column Annotation',
      content: 'Column Annotation allows you to map your dataset columns to standardized variables and terms using an intuitive drag-and-drop interface.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="tour-demographics"]',
      title: 'Demographics',
      content: 'Quickly map common demographic variables like Age, Sex, or Diagnosis by dragging them directly onto your column cards.',
    },
    {
      target: '[data-tour="tour-assessment"]',
      title: 'Assessment Tools',
      content: 'Here you can browse available neurocognitive assessment tools. You can drag a specific tool directly onto a column card to map it.',
    },
    /*
    {
      target: '[data-tour="tour-datatypes"]',
      title: 'Data Types',
      content: 'Assign columns as Categorical or Continuous by dragging these data types onto a card, or dragging a card here.',
    },
    */
    {
      target: '[data-tour="tour-action-bar"]',
      title: 'Filtering & Sorting',
      content: 'Use this bar to search for columns, hide those you\'ve already mapped, and sort Column Annotation by name, status, or data type.',
    },
    {
      target: '[data-tour="tour-column-card-0"]',
      title: 'Column Cards',
      content: 'These represent the columns in your dataset. You can click to select multiple cards, and drag them to the sidebar to map them in bulk!',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
    }

    // Force element into the vertical center of its scrolling container 
    // to prevent it from being hidden behind sticky headers or clipped.
    if (type === EVENTS.STEP_BEFORE) {
      if (step && step.target && typeof step.target === 'string') {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }
    }
  };

  const columnsArray = Object.entries(columns);

  // -- DndKit Sensors --
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require a 5px drag intent to trigger (prevent accidental drags on click)
      },
    })
  );

  // -- Compute Taxonomy Nodes --
  const taxonomyNodes = useMemo(() => {
    // 1. Group 1: Demographics (std_age, std_sex, std_diagnosis)
    const demographicsNode: TaxonomyNode = {
      id: 'demographics',
      label: 'Demographics',
      count: 0,
      children: [],
    };

    ['std_age', 'std_sex', 'std_diagnosis'].forEach((varId) => {
      const varDef = MOCK_STANDARDIZED_VARIABLES[varId];
      if (varDef) {
        const count = columnsArray.filter(
          ([_, col]: any) => col.standardizedVariable === varId
        ).length;
        demographicsNode.children!.push({
          id: varId,
          label: varDef.name,
          count,
        });
        demographicsNode.count += count;
      }
    });

    // 2. Group 2: Dynamic (is_multi_column_measure)
    // For now, let's just do 'std_assessment'
    const assessmentsNode: TaxonomyNode = {
      id: 'std_assessment', // grouping folder id -> var id
      label: MOCK_STANDARDIZED_VARIABLES.std_assessment.name,
      count: 0,
      children: [],
      isMultiColumn: true,
    };

    const assessmentColumns = columnsArray.filter(
      ([_, col]: any) => col.standardizedVariable === 'std_assessment'
    );
    assessmentsNode.count = assessmentColumns.length;

    // Group assessment columns by term
    const groupedByTerm: Record<string, number> = {};
    let unassignedCount = 0;

    assessmentColumns.forEach(([_, col]: any) => {
      if (col.term) {
        groupedByTerm[col.term] = (groupedByTerm[col.term] || 0) + 1;
      } else {
        unassignedCount++;
      }
    });

    // Populate with ALL terms from the assessment vocabulary
    ALL_TERMS.forEach((term: MockAssessmentTerm) => {
      assessmentsNode.children!.push({
        id: term.id,
        label: term.label,
        count: groupedByTerm[term.id] || 0,
      });
    });

    if (unassignedCount > 0) {
      assessmentsNode.children!.unshift({
        id: 'unassigned_std_assessment',
        label: 'Unassigned',
        count: unassignedCount,
      });
    }

    // 3. Group 3: Data Types (Commented out per request)
    /*
    const dataTypesNode: TaxonomyNode = {
      id: 'data_types',
      label: 'Data Types',
      count: 0,
      children: [],
    };

    const categoricalCount = columnsArray.filter(
      ([_, col]: any) => col.dataType === DataType.categorical
    ).length;
    const continuousCount = columnsArray.filter(
      ([_, col]: any) => col.dataType === DataType.continuous
    ).length;

    dataTypesNode.children!.push({
      id: 'dt_categorical',
      label: 'Categorical',
      count: categoricalCount,
    });
    dataTypesNode.children!.push({
      id: 'dt_continuous',
      label: 'Continuous',
      count: continuousCount,
    });
    dataTypesNode.count = categoricalCount + continuousCount;
    */

    return [demographicsNode, assessmentsNode];
  }, [columnsArray]);

  // -- Filtered Data & Selection State --
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [sortOption, setSortOption] = useState<string>('default');

  const filteredColumnsArray = useMemo(() => {
    let result = columnsArray;

    // 1. Filter out annotated columns if showAnnotated is false
    if (!showAnnotated) {
      result = result.filter(([_, col]: [string, any]) => {
        const isDemographicsAnnotated = col.standardizedVariable && MOCK_STANDARDIZED_VARIABLES[col.standardizedVariable] && !MOCK_STANDARDIZED_VARIABLES[col.standardizedVariable].is_multi_column_measure;
        const isAssessmentAnnotated = col.term !== null;

        if (isDemographicsAnnotated || isAssessmentAnnotated) {
          return false;
        }
        return true;
      });
    }

    if (selectedNodeId) {
      result = result.filter(([_, column]: [string, any]) => {
        if (selectedNodeId === 'demographics') {
          const demoIds = ['std_age', 'std_sex', 'std_diagnosis'];
          return demoIds.includes(column.standardizedVariable);
        }
        if (selectedNodeId.startsWith('std_')) {
          // e.g. std_age, std_assessment
          return column.standardizedVariable === selectedNodeId;
        }
        if (selectedNodeId.startsWith('unassigned_')) {
          const varId = selectedNodeId.replace('unassigned_', '');
          return column.standardizedVariable === varId && !column.term;
        }
        // Must be a term ID
        return column.term === selectedNodeId;
      });
    }

    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        ([_, column]: [string, any]) =>
          column.name.toLowerCase().includes(lowerQuery) ||
          (column.description || '').toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Sort the filtered array
    result = [...result].sort((a: any, b: any) => {
      const [, colA] = a;
      const [, colB] = b;

      switch (sortOption) {
        case 'name_asc':
          return colA.name.localeCompare(colB.name);
        case 'name_desc':
          return colB.name.localeCompare(colA.name);
        case 'datatype':
          const typeA = colA.dataType || '';
          const typeB = colB.dataType || '';
          return typeA.localeCompare(typeB);
        case 'status':
          const isAnnotatedA = Boolean((colA.standardizedVariable && !colA.assessmentTool) || (colA.assessmentTool && colA.term));
          const isAnnotatedB = Boolean((colB.standardizedVariable && !colB.assessmentTool) || (colB.assessmentTool && colB.term));
          // false (unannotated) comes before true (annotated)
          return (isAnnotatedA === isAnnotatedB) ? 0 : (isAnnotatedA ? 1 : -1);
        case 'default':
        default:
          // In 'default' mode, we trust the original Object.entries order
          return 0;
      }
    });

    return result;
  }, [columnsArray, selectedNodeId, debouncedSearchQuery, showAnnotated, sortOption]);

  const [selectedColumnIds, setSelectedColumnIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Clear selection when filter changes to avoid weird state
  useMemo(() => {
    setSelectedColumnIds(new Set());
    setLastSelectedId(null);
  }, [selectedNodeId, debouncedSearchQuery]);

  const handleCardClick = (event: React.MouseEvent, columnId: string) => {
    const isMacCd =
      window.navigator.platform.includes('Mac') || window.navigator.platform.includes('macOS');
    const isMultiSelectModifier = isMacCd ? event.metaKey : event.ctrlKey;

    if (event.shiftKey && lastSelectedId) {
      // Find indices of last selected and currently clicked
      const currentIndex = filteredColumnsArray.findIndex(([id]) => id === columnId);
      const lastIndex = filteredColumnsArray.findIndex(([id]) => id === lastSelectedId);

      if (currentIndex !== -1 && lastIndex !== -1) {
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);

        const newSelection = new Set(selectedColumnIds);
        for (let i = start; i <= end; i++) {
          newSelection.add(filteredColumnsArray[i][0]);
        }
        setSelectedColumnIds(newSelection);
        return; // Don't update lastSelectedId on shift-click
      }
    } else if (isMultiSelectModifier) {
      // Toggle single item
      const newSelection = new Set(selectedColumnIds);
      if (newSelection.has(columnId)) {
        newSelection.delete(columnId);
      } else {
        newSelection.add(columnId);
      }
      setSelectedColumnIds(newSelection);
    } else {
      // Single select (or unselect if clicking the only selected item)
      if (selectedColumnIds.size === 1 && selectedColumnIds.has(columnId)) {
        setSelectedColumnIds(new Set());
        setLastSelectedId(null);
        return;
      }
      const newSelection = new Set<string>();
      newSelection.add(columnId);
      setSelectedColumnIds(newSelection);
    }
    setLastSelectedId(columnId);
  };

  // -- Handlers (Mocking Redux Actions) --

  const handleDescriptionChange = (columnId: string, description: string | null) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], description },
    }));
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    let dataType: DataType | null = null;
    if (newDataType === 'Categorical') dataType = DataType.categorical;
    else if (newDataType === 'Continuous') dataType = DataType.continuous;

    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], dataType },
    }));
  };

  const handleRemoveVariable = (columnId: string) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], standardizedVariable: null, term: null },
    }));
  };

  const handleRemoveTerm = (columnId: string) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], term: null },
    }));
  };

  // -- Bulk Actions --

  const handleClearSelection = () => {
    setSelectedColumnIds(new Set());
    setLastSelectedId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragEvent(event);
  };

  const handleDragCancel = () => {
    setActiveDragEvent(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragEvent(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    if (activeData.type === 'sidebar' && overData.type === 'card') {
      const sidebarId = activeData.id;
      const targetCardId = overData.id;

      // Ignore structural folders
      if (
        sidebarId === 'demographics' ||
        sidebarId === 'all_columns' ||
        sidebarId === 'unassigned_std_assessment' ||
        sidebarId === 'data_types'
      )
        return;

      // If targeted card is part of multi-selection, apply to ALL selected
      const isCardSelected = selectedColumnIds.has(targetCardId);
      const targetsToUpdate =
        isCardSelected && selectedColumnIds.size > 0
          ? Array.from(selectedColumnIds)
          : [targetCardId];

      if (sidebarId === 'dt_categorical' || sidebarId === 'dt_continuous') {
        // Data Type assignment
        const newDataType = sidebarId === 'dt_categorical' ? 'Categorical' : 'Continuous';
        targetsToUpdate.forEach((id) => handleDataTypeChange(id, newDataType));
      } else {
        // Variable assignment
        let applyVarId: string | null = null;
        let applyTermId: string | null = null;

        if (MOCK_STANDARDIZED_VARIABLES[sidebarId]) {
          applyVarId = sidebarId;
        } else if (TERM_BY_ID.has(sidebarId)) {
          applyVarId = 'std_assessment';
          applyTermId = sidebarId;
        }

        setColumns((prev: any) => {
          const updated = { ...prev };
          targetsToUpdate.forEach((id) => {
            updated[id] = { ...updated[id], standardizedVariable: applyVarId, term: applyTermId };
          });
          return updated;
        });
      }
    }

    // SCENARIO 2: Right to Left (Card to Sidebar item)
    if (activeData.type === 'card' && overData.type === 'sidebar') {
      const draggedCardId = activeData.id;
      const targetSidebarId = overData.id;

      // Ignore structural folders
      if (
        targetSidebarId === 'demographics' ||
        targetSidebarId === 'all_columns' ||
        targetSidebarId === 'unassigned_std_assessment' ||
        targetSidebarId === 'data_types'
      )
        return;

      // Apply to all dragged cards
      const isCardSelected = selectedColumnIds.has(draggedCardId);
      const targetsToUpdate =
        isCardSelected && selectedColumnIds.size > 0
          ? Array.from(selectedColumnIds)
          : [draggedCardId];

      if (targetSidebarId === 'dt_categorical' || targetSidebarId === 'dt_continuous') {
        // Data Type assignment
        const newDataType = targetSidebarId === 'dt_categorical' ? 'Categorical' : 'Continuous';
        targetsToUpdate.forEach((id) => handleDataTypeChange(id, newDataType));
      } else {
        // Variable assignment
        let applyVarId: string | null = null;
        let applyTermId: string | null = null;

        if (MOCK_STANDARDIZED_VARIABLES[targetSidebarId]) {
          applyVarId = targetSidebarId;
        } else if (TERM_BY_ID.has(targetSidebarId)) {
          applyVarId = 'std_assessment';
          applyTermId = targetSidebarId;
        }

        setColumns((prev: any) => {
          const updated = { ...prev };
          targetsToUpdate.forEach((id) => {
            updated[id] = { ...updated[id], standardizedVariable: applyVarId, term: applyTermId };
          });
          return updated;
        });
      }
    }
  };

  const columnCardData = filteredColumnsArray.map(([columnId, column]: [string, any]) => {
    const selectedStandardizedVariable = column.standardizedVariable
      ? MOCK_STANDARDIZED_VARIABLES[column.standardizedVariable]
      : undefined;

    const isDataTypeEditable =
      !column.standardizedVariable ||
      selectedStandardizedVariable?.is_multi_column_measure === true;

    const inferredDataTypeLabel = isDataTypeEditable
      ? null
      : selectedStandardizedVariable?.variable_type || column.dataType || null;

    return {
      columnId,
      name: column.name,
      description: column.description || null,
      dataType: column.dataType || null,
      standardizedVariableId: column.standardizedVariable || null,
      isDataTypeEditable,
      inferredDataTypeLabel,
      term: column.term,
      termLabel: column.term
        ? TERM_BY_ID.get(column.term)?.abbreviation || TERM_BY_ID.get(column.term)?.label
        : null,
      termTooltip: column.term ? TERM_BY_ID.get(column.term)?.label : null,
      standardizedVariableLabel: column.standardizedVariable
        ? MOCK_STANDARDIZED_VARIABLES[column.standardizedVariable]?.name
        : null,
    };
  });

  const renderDragOverlay = () => {
    if (!activeDragEvent || !activeDragEvent.active.data.current) return null;

    const data = activeDragEvent.active.data.current;

    if (data.type === 'sidebar') {
      const actualSidebarId = data.id as string;
      const labelText =
        actualSidebarId === 'dt_categorical' ? 'Categorical' :
          actualSidebarId === 'dt_continuous' ? 'Continuous' :
            MOCK_STANDARDIZED_VARIABLES[actualSidebarId]?.name ||
            TERM_BY_ID.get(actualSidebarId)?.label ||
            'Item';
      return (
        <Box
          sx={{
            py: 0.5,
            px: 1.5,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 8,
            boxShadow: 8,
            opacity: 0.95,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transform: 'rotate(2deg)',
            cursor: 'grabbing',
            width: 'max-content',
            maxWidth: 400,
          }}
        >
          <DragIndicatorIcon fontSize="small" sx={{ opacity: 0.7 }} />
          <Typography variant="body2" fontWeight="bold">
            {labelText}
          </Typography>
        </Box>
      );
    }

    if (data.type === 'card') {
      const actualCardId = data.id as string;
      const isMulti = selectedColumnIds.has(actualCardId) && selectedColumnIds.size > 1;
      const count = isMulti ? selectedColumnIds.size : 1;
      const cardData = columns[actualCardId];

      return (
        <Box
          sx={{
            py: 0.5,
            px: 1.5,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #e0e0e0',
            opacity: 0.95,
            transform: 'rotate(-2deg)',
            cursor: 'grabbing',
            width: 'max-content',
            maxWidth: 400,
          }}
        >
          <DragIndicatorIcon fontSize="small" color="disabled" />
          <Typography
            variant="body2"
            fontWeight="bold"
          >
            {cardData?.name || 'Column'}
          </Typography>
          {isMulti && (
            <Box
              sx={{
                ml: 0.5,
                px: 1,
                py: 0.25,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              +{count - 1} more
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
    >
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        disableScrolling={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#1976d2', // MUI primary color
            zIndex: 10000,
          },
        }}
      />
      <div
        className="flex flex-col gap-6 h-[70vh] overflow-hidden relative"
        data-cy="column-annotation-container"
      >
        {onToggleMock && (
          <div className="absolute top-0 right-4 z-50">

          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* -- TAXONOMY SIDEBAR -- */}
          <MockTaxonomySidebar
            nodes={taxonomyNodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
          />

          <div className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full">
            <div className="flex justify-end pt-2 px-4 shrink-0">
              <Button variant="outlined" size="small" onClick={() => setRunTour(true)}>Take UI Tour</Button>
            </div>
            <div className="px-4 pt-2 shrink-0 flex flex-col gap-3" data-tour="tour-action-bar">
              <MockSearchFilter
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showingCount={filteredColumnsArray.length}
                totalCount={columnsArray.length}
                hasActiveFilters={searchQuery.length > 0 || selectedNodeId !== null}
                onClearAll={() => {
                  setSearchQuery('');
                  setSelectedNodeId(null);
                }}
                selectedCount={selectedColumnIds.size}
                onClearSelection={handleClearSelection}
                showAnnotated={showAnnotated}
                onShowAnnotatedChange={setShowAnnotated}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4" data-cy="scrollable-container">
              {/* Global Header Row - Sticky */}
              <div className="sticky top-0 z-10 mb-4 border border-gray-200 shadow-sm rounded-t-lg backdrop-blur-sm bg-opacity-95 bg-gray-100 flex items-center gap-4 justify-between px-4 pt-3 pb-2 min-w-[768px]">
                <div className="min-w-[200px] w-1/4 px-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Column
                  </span>
                </div>
                <div className="flex-1 min-w-[200px] px-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </span>
                </div>
                <div className="min-w-[200px] w-1/3 text-right pr-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Mapped Variable & Data Type
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Flat rendering flow with paperpile-style chips */}
                {columnCardData.map((columnData, index) => (
                  <div key={columnData.columnId} className="w-full" data-tour={index === 0 ? "tour-column-card-0" : undefined}>
                    <MockColumnAnnotationCard
                      id={columnData.columnId}
                      name={columnData.name}
                      description={columnData.description}
                      dataType={columnData.dataType}
                      standardizedVariableId={columnData.standardizedVariableId}
                      isDataTypeEditable={columnData.isDataTypeEditable}
                      inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                      term={columnData.term}
                      termLabel={columnData.termLabel}
                      termTooltip={columnData.termTooltip}
                      standardizedVariableLabel={columnData.standardizedVariableLabel}
                      selected={selectedColumnIds.has(columnData.columnId)}
                      onChipClick={setSelectedNodeId}
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleCardClick(e as any, columnData.columnId)}
                      onDescriptionChange={handleDescriptionChange}
                      onDataTypeChange={handleDataTypeChange}
                      onRemoveVariable={handleRemoveVariable}
                      onRemoveTerm={handleRemoveTerm}
                    />
                  </div>
                ))}

                {filteredColumnsArray.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Typography>No columns match the selected filter.</Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{renderDragOverlay()}</DragOverlay>
    </DndContext>
  );
}

export default MockColumnAnnotation;
