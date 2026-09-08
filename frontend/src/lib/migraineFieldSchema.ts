/**
 * Centralized schema configuration for the 23 clinical input features of the Kaggle Migraine Dataset.
 * Note: 'Type' is the target classification output variable and is strictly excluded from inputs.
 * 
 * Dropdown choices and category labels are verified against the 400-record clinical dataset and
 * ICHD-3 clinical migraine classification benchmarks. Numerical codes are preserved faithfully for model inference.
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
    description: 'Attack duration scale (1: 4–24 hrs, 2: 24–48 hrs, 3: 48–72 hrs).',
    inputType: 'select',
    options: [
      { encodedValue: 1, displayValue: '1 = Short: 4 to 24 hours (< 1 day)' },
      { encodedValue: 2, displayValue: '2 = Medium: 24 to 48 hours (1 to 2 days)' },
      { encodedValue: 3, displayValue: '3 = Long: 48 to 72 hours (> 2 days)' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Frequency',
    displayLabel: 'Frequency',
    description: 'Reported headache attack frequency in episodes per month (1 to 8+ attacks/month).',
    inputType: 'select',
    options: [
      { encodedValue: 1, displayValue: '1 = 1 attack / month' },
      { encodedValue: 2, displayValue: '2 = 2 attacks / month' },
      { encodedValue: 3, displayValue: '3 = 3 attacks / month' },
      { encodedValue: 4, displayValue: '4 = 4 attacks / month' },
      { encodedValue: 5, displayValue: '5 = 5 attacks / month' },
      { encodedValue: 6, displayValue: '6 = 6 attacks / month' },
      { encodedValue: 7, displayValue: '7 = 7 attacks / month' },
      { encodedValue: 8, displayValue: '8 = 8+ attacks / month (High Frequency / Chronic)' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 5,
  },
  {
    key: 'Location',
    displayLabel: 'Location',
    description: 'Cranial pain localization (0: None/Aura only, 1: Unilateral, 2: Bilateral/Diffuse).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = None / No Headache Pain (Aura Only)' },
      { encodedValue: 1, displayValue: '1 = Unilateral: One-sided head pain (Classic Migraine)' },
      { encodedValue: 2, displayValue: '2 = Bilateral / Diffuse: Both sides or generalized head pain' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Character',
    displayLabel: 'Character',
    description: 'Pain sensation quality (0: None, 1: Pulsating/Throbbing, 2: Pressing/Dull).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = None / No Pain Character (Silent Aura)' },
      { encodedValue: 1, displayValue: '1 = Pulsating / Throbbing (Classic Migraine Pain)' },
      { encodedValue: 2, displayValue: '2 = Pressing / Tightening / Constant Dull Ache (Atypical / Non-pulsatile)' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 1,
  },
  {
    key: 'Intensity',
    displayLabel: 'Intensity',
    description: 'Pain severity rating (0: None, 1: Mild, 2: Moderate, 3: Severe).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = None: 0/10 Pain (Painless Aura)' },
      { encodedValue: 1, displayValue: '1 = Mild: 1–3/10 (Noticeable, does not restrict daily activity)' },
      { encodedValue: 2, displayValue: '2 = Moderate: 4–6/10 (Substantially impairs work/school activity)' },
      { encodedValue: 3, displayValue: '3 = Severe: 7–10/10 (Incapacitating, bed rest & dark room required)' },
    ],
    required: true,
    group: 'demographics_dynamics',
    defaultValue: 2,
  },

  // --- Group 2: Autonomic & Sensory Sensitivity ---
  {
    key: 'Nausea',
    displayLabel: 'Nausea',
    description: 'Presence of gastrointestinal nausea during attack (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Normal stomach / No nausea' },
      { encodedValue: 1, displayValue: '1 = Present: Stomach upset or nausea reported' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 1,
  },
  {
    key: 'Vomit',
    displayLabel: 'Vomit',
    description: 'Active emesis/vomiting during attack (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: No vomiting' },
      { encodedValue: 1, displayValue: '1 = Present: Active vomiting / emesis during attack' },
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
      { encodedValue: 0, displayValue: '0 = Absent: Normal sound tolerance' },
      { encodedValue: 1, displayValue: '1 = Present: Hypersensitivity to sound (normal sounds hurt)' },
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
      { encodedValue: 0, displayValue: '0 = Absent: Normal light tolerance' },
      { encodedValue: 1, displayValue: '1 = Present: Hypersensitivity to light (glare/fluorescents hurt)' },
    ],
    required: true,
    group: 'autonomic',
    defaultValue: 1,
  },

  // --- Group 3: Neurological Aura & Focal Symptoms ---
  {
    key: 'Visual',
    displayLabel: 'Visual',
    description: 'Visual aura disturbance type and complexity (0: None, 1: Photopsia, 2: Teichopsia, 3: Scotoma, 4: Complex).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = None: No visual aura' },
      { encodedValue: 1, displayValue: '1 = Photopsia: Flashing lights / shimmering spots' },
      { encodedValue: 2, displayValue: '2 = Teichopsia: Zig-zag jagged lines / fortification spectra' },
      { encodedValue: 3, displayValue: '3 = Scotoma: Blind spots / partial patchy vision loss' },
      { encodedValue: 4, displayValue: '4 = Complex / Tunnel Vision: Extensive visual field loss or distorted vision' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 1,
  },
  {
    key: 'Sensory',
    displayLabel: 'Sensory',
    description: 'Somatosensory aura severity (0: None, 1: Mild/Tingling paresthesia, 2: Severe/Numbness deficit).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = None: No tingling or sensory loss' },
      { encodedValue: 1, displayValue: '1 = Mild / Tingling: Unilateral pins-and-needles / paresthesia (hand/face)' },
      { encodedValue: 2, displayValue: '2 = Severe / Numbness: Actual loss of feeling or spreading bilateral deficit' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 2,
  },
  {
    key: 'Dysphasia',
    displayLabel: 'Dysphasia',
    description: 'Transient language or word-finding difficulty during attack (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Normal speech flow' },
      { encodedValue: 1, displayValue: '1 = Present: Transient word-finding difficulty or speech arrest' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Dysarthria',
    displayLabel: 'Dysarthria',
    description: 'Motor speech articulation impairment or slurring (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Clear articulation' },
      { encodedValue: 1, displayValue: '1 = Present: Slurred, thick, or impaired motor articulation' },
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
      { encodedValue: 0, displayValue: '0 = Absent: Normal vestibular balance' },
      { encodedValue: 1, displayValue: '1 = Present: Vestibular rotational room-spinning sensation' },
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
      { encodedValue: 0, displayValue: '0 = Absent: No abnormal ear sounds' },
      { encodedValue: 1, displayValue: '1 = Present: Ringing, buzzing, or hissing in ears' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Hypoacusis',
    displayLabel: 'Hypoacusis',
    description: 'Decreased auditory acuity or hearing muffling (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Normal hearing level' },
      { encodedValue: 1, displayValue: '1 = Present: Temporary muffled hearing / decreased acuity' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Diplopia',
    displayLabel: 'Diplopia',
    description: 'Double vision symptom during attack (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Normal single vision' },
      { encodedValue: 1, displayValue: '1 = Present: True double vision during attack' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Defect',
    displayLabel: 'Defect',
    description: 'Visual field cut or homonymous hemianopic defect (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Intact visual field' },
      { encodedValue: 1, displayValue: '1 = Present: Persistent visual field cut / hemianopic defect' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Ataxia',
    displayLabel: 'Ataxia',
    description: 'Impaired coordination or unsteady gait (0: Absent, 1: Present - clinical 400 set is 0).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: Normal coordination and balance' },
      { encodedValue: 1, displayValue: '1 = Present: Clumsiness, unsteady gait, or limb incoordination' },
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
      { encodedValue: 0, displayValue: '0 = Absent: Fully alert and oriented' },
      { encodedValue: 1, displayValue: '1 = Present: Altered consciousness, syncope, or fainting' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'Paresthesia',
    displayLabel: 'Paresthesia',
    description: 'Spontaneous burning, prickling, or crawling skin sensations (0: Absent, 1: Present).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Absent: No spontaneous paresthesias' },
      { encodedValue: 1, displayValue: '1 = Present: Spontaneous burning, prickling, or crawling skin sensations' },
    ],
    required: true,
    group: 'neurological_aura',
    defaultValue: 0,
  },
  {
    key: 'DPF',
    displayLabel: 'DPF',
    description: 'Defecto Primario Familiar / family history of migraine in first-degree relatives (0: Negative, 1: Positive).',
    inputType: 'select',
    options: [
      { encodedValue: 0, displayValue: '0 = Negative: No immediate family members with migraine' },
      { encodedValue: 1, displayValue: '1 = Positive: Direct family history (parent, sibling, child has migraine)' },
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
