/**
 * Centralized schema configuration for the 23 clinical input features of the Kaggle Migraine Dataset.
 * Note: 'Type' is the target classification output variable and is strictly excluded from inputs.
 * 
 * IMPORTANT: In accordance with clinical data governance and instructions, no unverified categorical
 * text labels (e.g. '0 = unilateral') are invented. Numerical codes are presented faithfully as recorded.
 */

export interface FieldOption {
  encodedValue: number;
  displayValue: string;
}

export type FieldGroup = 'demographics_dynamics' | 'autonomic' | 'neurological_aura';

export interface MigraineFieldConfig {
  key: string;
  displayLabel: string;
  description: string;
  inputType: 'number' | 'select' | 'radio' | 'toggle';
  options?: FieldOption[];
  validation?: {
    min?: number;
    max?: number;
    step?: number;
  };
  required: boolean;
  group: FieldGroup;
  defaultValue: number;
}

export const MIGRAINE_FIELD_GROUPS: { key: FieldGroup; title: string; subtitle: string }[] = [
  {
    key: 'demographics_dynamics',
    title: '1. Demographics & Core Attack Dynamics',
    subtitle: 'Patient age, episode duration, frequency, pain site, character, and severity',
  },
  {
    key: 'autonomic',
    title: '2. Autonomic & Sensory Sensitivity',
    subtitle: 'Gastrointestinal manifestations, sound sensitivity, and light sensitivity',
  },
  {
    key: 'neurological_aura',
    title: '3. Neurological Aura & Focal Symptoms',
    subtitle: 'Visual, sensory, motor speech, cranial nerve, cerebellar, and family history features',
  },
];

export const MIGRAINE_FIELD_SCHEMA: MigraineFieldConfig[] = [
  // --- Group 1: Demographics & Dynamics ---
  {
    key: 'Age',
    displayLabel: 'Age',
    description: 'Patient age in years (observed dataset range: 15–77).',
    inputType: 'number',
    validation: { min: 15, max: 95, step: 1 },
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 30,
  },
  {
    key: 'Duration',
    displayLabel: 'Duration',
    description: 'Encoded attack duration scale (observed dataset range: 1–3).',
    inputType: 'select',
    options: [
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
      { encodedValue: 3, displayValue: 'Code 3' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Frequency',
    displayLabel: 'Frequency',
    description: 'Reported headache attack frequency score (observed dataset range: 1–8).',
    inputType: 'select',
    options: [
      { encodedValue: 1, displayValue: '1' },
      { encodedValue: 2, displayValue: '2' },
      { encodedValue: 3, displayValue: '3' },
      { encodedValue: 4, displayValue: '4' },
      { encodedValue: 5, displayValue: '5' },
      { encodedValue: 6, displayValue: '6' },
      { encodedValue: 7, displayValue: '7' },
      { encodedValue: 8, displayValue: '8' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 5,
  },
  {
    key: 'Location',
    displayLabel: 'Location',
    description: 'Cranial headache location classification code (observed dataset range: 0–2).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: 'Code 0' },
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Character',
    displayLabel: 'Character',
    description: 'Pain quality / sensation classification code (observed dataset range: 0–2).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: 'Code 0' },
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Intensity',
    displayLabel: 'Intensity',
    description: 'Pain severity score rating (observed dataset range: 0–3).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: 'Code 0' },
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
      { encodedValue: 3, displayValue: 'Code 3' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 2,
  },

  // --- Group 2: Autonomic & Sensory Sensitivity ---
  {
    key: 'Nausea',
    displayLabel: 'Nausea',
    description: 'Presence of gastrointestinal nausea (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 1,
  },
  {
    key: 'Vomit',
    displayLabel: 'Vomit',
    description: 'Presence of active emesis/vomiting (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 0,
  },
  {
    key: 'Phonophobia',
    displayLabel: 'Phonophobia',
    description: 'Abnormal hypersensitivity to sound (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 1,
  },
  {
    key: 'Photophobia',
    displayLabel: 'Photophobia',
    description: 'Abnormal hypersensitivity to light (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 1,
  },

  // --- Group 3: Neurological Aura & Focal Symptoms ---
  {
    key: 'Visual',
    displayLabel: 'Visual',
    description: 'Visual aura disturbance classification code (observed dataset range: 0–4).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: 'Code 0' },
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
      { encodedValue: 3, displayValue: 'Code 3' },
      { encodedValue: 4, displayValue: 'Code 4' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 1,
  },
  {
    key: 'Sensory',
    displayLabel: 'Sensory',
    description: 'Somatosensory aura disturbance code (observed dataset range: 0–2).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: 'Code 0' },
      { encodedValue: 1, displayValue: 'Code 1' },
      { encodedValue: 2, displayValue: 'Code 2' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 2,
  },
  {
    key: 'Dysphasia',
    displayLabel: 'Dysphasia',
    description: 'Transient language / expressive speech disturbance (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Dysarthria',
    displayLabel: 'Dysarthria',
    description: 'Motor speech articulatory impairment / slurring (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Vertigo',
    displayLabel: 'Vertigo',
    description: 'Vestibular rotational spinning sensation (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Tinnitus',
    displayLabel: 'Tinnitus',
    description: 'Subjective auditory ringing or humming in ears (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Hypoacusis',
    displayLabel: 'Hypoacusis',
    description: 'Decreased auditory acuity / hearing reduction (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Diplopia',
    displayLabel: 'Diplopia',
    description: 'Double vision symptom (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Defect',
    displayLabel: 'Defect',
    description: 'Visual field defect or scotomatous loss (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Ataxia',
    displayLabel: 'Ataxia',
    description: 'Impaired coordination of voluntary movements (observed dataset range: 0).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Conscience',
    displayLabel: 'Conscience',
    description: 'Altered level of consciousness or syncope (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Paresthesia',
    displayLabel: 'Paresthesia',
    description: 'Spontaneous prickling or tingling sensations (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'DPF',
    displayLabel: 'DPF',
    description: 'Defecto Primario Familiar / family history of migraine (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 (Absent)' },
      { encodedValue: 1, displayValue: '1 (Present)' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
];

/**
 * Observed diagnostic classes from the dataset target column 'Type'.
 */
export const OBSERVED_MIGRAINE_TYPES = [
  'Typical aura with migraine',
  'Migraine without aura',
  'Basilar-type aura',
  'Sporadic hemiplegic migraine',
  'Familial hemiplegic migraine',
  'Typical aura without migraine',
  'Other',
] as const;

export type ObservedMigraineType = (typeof OBSERVED_MIGRAINE_TYPES)[number];
