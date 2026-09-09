/**
 * IHS Visual Aura Table & Patient Progression Metadata
 * Grounded in:
 * - Viana et al. "Visual migraine aura iconography: A multicentre, cross-sectional study of individuals with migraine with aura"
 *   Cephalalgia 2024; 44(2). DOI: 10.1177/03331024241234809
 * - International Headache Society (IHS) Visual Aura Table (Images by Michele Viana & NorHead)
 * - Migraine Trust community observational records (#1852374303544643655)
 */

export interface AuraPhenomenon {
  id: number;
  numberLabel: string;
  name: string;
  category: 'baseline' | 'positive' | 'negative' | 'distortion' | 'atypical';
  categoryLabel: string;
  description: string;
  clinicalSignificance: string;
  imagePath: string;
}

export interface PatientAuraExperience {
  patientLabel: string;
  sequence: number[];
  sequenceDisplay: string;
  quote: string;
  clinicalInsight: string;
}

export const AURA_PHENOMENA: AuraPhenomenon[] = [
  {
    id: 0,
    numberLabel: '#0',
    name: 'Normal Visual Field (Control Baseline)',
    category: 'baseline',
    categoryLabel: 'Baseline',
    description: 'Unimpaired field of vision: Two hot air balloons over a green meadow under a clear blue sky.',
    clinicalSignificance: 'Standard reference point used to evaluate baseline visual acuity without aura disturbances.',
    imagePath: '/aura_images/aura_0.png',
  },
  {
    id: 1,
    numberLabel: '#1',
    name: 'Central Photopsia / Flashing Core',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Bright white/yellow glowing core or shimmering flash in central vision.',
    clinicalSignificance: 'Elementary positive symptom indicating initial focal depolarization in the occipital pole.',
    imagePath: '/aura_images/aura_1.png',
  },
  {
    id: 2,
    numberLabel: '#2',
    name: 'Diffuse Foggy Blur',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Loss of sharpness, hazy out-of-focus vision, or foggy veil obscuring detail.',
    clinicalSignificance: 'Common resolution-phase or prodromal blur accompanying spreading cortical depression.',
    imagePath: '/aura_images/aura_2.png',
  },
  {
    id: 3,
    numberLabel: '#3',
    name: 'Scintillating Fortification Spectrum (Teichopsia)',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Classic multicolored jagged, zig-zag fortification lines radiating or shimmering on one side.',
    clinicalSignificance: 'Pathognomonic hallmark of migraine aura, reflecting slow retinotopic propagation across visual cortex.',
    imagePath: '/aura_images/aura_3.png',
  },
  {
    id: 4,
    numberLabel: '#4',
    name: 'Central Scotoma (Blind Spot)',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Dark, opaque circular blind spot obscuring the center of the visual field.',
    clinicalSignificance: 'Negative visual deficit. If sudden (<5 min) and isolated without positive shimmer, mandates acute stroke triage.',
    imagePath: '/aura_images/aura_4.png',
  },
  {
    id: 5,
    numberLabel: '#5',
    name: 'Multiple Punctate Scotomas',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Scattered small dark, blank, or missing spots distributed across the visual field.',
    clinicalSignificance: 'Frequently experienced as missing letters while reading before coalescing into a larger crescent.',
    imagePath: '/aura_images/aura_5.png',
  },
  {
    id: 6,
    numberLabel: '#6',
    name: 'Shimmering Stars / Phosphenes',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Scattered bright sparkles, glitter, or dancing sparks of light resembling fireworks.',
    clinicalSignificance: 'Diffuse positive retinal or striate cortical excitation.',
    imagePath: '/aura_images/aura_6.png',
  },
  {
    id: 7,
    numberLabel: '#7',
    name: 'White Shimmering Patches',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Cloudy white flickering spots or patches oscillating in brightness.',
    clinicalSignificance: 'Frequent early manifestation preceding expanding fortification arcs.',
    imagePath: '/aura_images/aura_7.png',
  },
  {
    id: 8,
    numberLabel: '#8',
    name: 'Polychromatic Colored Blobs / Orbs',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Vibrant multi-colored floating luminous disks or circular spots (red, yellow, green, violet).',
    clinicalSignificance: 'Often cited as the very first sign of an aura attack before linear geometric crystallization.',
    imagePath: '/aura_images/aura_8.png',
  },
  {
    id: 9,
    numberLabel: '#9',
    name: 'Dynamic Streaks & Shooting Flashes',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Linear streaks of colored light shooting rapidly across the visual plane.',
    clinicalSignificance: 'Rapid transient positive phenomenon; must be differentiated from vitreous traction or retinal tear.',
    imagePath: '/aura_images/aura_9.png',
  },
  {
    id: 10,
    numberLabel: '#10',
    name: 'Kaleidoscopic / Prism Facets',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Geometric polygonal multi-colored fractured planes resembling looking through a kaleidoscope.',
    clinicalSignificance: 'Higher-order associative visual cortex involvement (V2/V3/V4 area synchronization).',
    imagePath: '/aura_images/aura_10.png',
  },
  {
    id: 11,
    numberLabel: '#11',
    name: 'Visual Snow / Continuous Static',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Grainy TV-static or fine flickering dots pervading the entire field of vision.',
    clinicalSignificance: 'Characteristic of thalamocortical dysrhythmia; common comorbidity in chronic migraineurs.',
    imagePath: '/aura_images/aura_11.png',
  },
  {
    id: 12,
    numberLabel: '#12',
    name: 'Heat Haze / Water Ripple Effect',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Shimmering wavy air, hot-road mirage, or looking through running water.',
    clinicalSignificance: 'Smooth wave propagation altering spatial phase perception.',
    imagePath: '/aura_images/aura_12.png',
  },
  {
    id: 13,
    numberLabel: '#13',
    name: 'Arcuate Scintillating Crescent',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'C-shaped curved multicolored jagged ring or arc expanding toward the visual periphery.',
    clinicalSignificance: 'Classic evolving morphology as cortical spreading depression travels along the calcarine fissure.',
    imagePath: '/aura_images/aura_13.png',
  },
  {
    id: 14,
    numberLabel: '#14',
    name: 'Hemianopia (Half-Field Blindness)',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Complete black loss of either the left or right half of the visual field.',
    clinicalSignificance: 'Retrochiasmal unilateral pathway inhibition. Must be evaluated for gradual march vs sudden vascular onset.',
    imagePath: '/aura_images/aura_14.png',
  },
  {
    id: 15,
    numberLabel: '#15',
    name: 'Quadrantanopia / Diagonal Cut',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Loss or darkening of a specific quadrant (upper or lower, left or right).',
    clinicalSignificance: 'Focal deficit along Meyer\'s loop or parietal optic radiations.',
    imagePath: '/aura_images/aura_15.png',
  },
  {
    id: 16,
    numberLabel: '#16',
    name: 'Concentric Constriction (Tunnel Vision)',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Progressive peripheral darkening with preserved central tubular sight.',
    clinicalSignificance: 'Bilateral peripheral cortical suppression; often accompanies severe pre-headache autonomic surge.',
    imagePath: '/aura_images/aura_16.png',
  },
  {
    id: 17,
    numberLabel: '#17',
    name: 'Micropsia (Objects Appearing Tiny)',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Objects appear significantly smaller and more distant than their true physical dimensions.',
    clinicalSignificance: 'Dorsal visual stream perceptual scaling alteration (Alice in Wonderland variant).',
    imagePath: '/aura_images/aura_17.png',
  },
  {
    id: 18,
    numberLabel: '#18',
    name: 'Mosaicism / Blocky Pixelation',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Visual scene broken down into chunky, cubist, or polygonal pixel tiles.',
    clinicalSignificance: 'Loss of visual spatial integration across adjacent receptive fields.',
    imagePath: '/aura_images/aura_18.png',
  },
  {
    id: 19,
    numberLabel: '#19',
    name: 'Fractured / Shattered Glass Effect',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Perception of looking through a fractured mirror or cracked car windshield.',
    clinicalSignificance: 'Severe discontinuity in retinotopic mapping during acute phase.',
    imagePath: '/aura_images/aura_19.png',
  },
  {
    id: 20,
    numberLabel: '#20',
    name: 'Corona / Luminescent Halos',
    category: 'positive',
    categoryLabel: 'Positive Phenomenon',
    description: 'Glowing borders, luminescent outlines, or glowing halos radiating around people and objects.',
    clinicalSignificance: 'Border enhancement caused by hyperexcitable lateral inhibition in early visual cortex.',
    imagePath: '/aura_images/aura_20.png',
  },
  {
    id: 21,
    numberLabel: '#21',
    name: 'Transient Amaurosis (Complete Darkness)',
    category: 'negative',
    categoryLabel: 'Negative Deficit',
    description: 'Total temporary blackout or dark void across the entire binocular field.',
    clinicalSignificance: 'Transient bilateral visual cortex suppression; SNOOP4 emergency red flag if sudden or persistent.',
    imagePath: '/aura_images/aura_21.png',
  },
  {
    id: 22,
    numberLabel: '#22',
    name: 'Teleopsia (Receding Distance Alteration)',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Visual perspective distortion where surroundings appear far away in a tunnel or recess.',
    clinicalSignificance: 'Parieto-occipital depth perception disruption.',
    imagePath: '/aura_images/aura_22.png',
  },
  {
    id: 23,
    numberLabel: '#23',
    name: 'Macropsia (Objects Abnormally Large)',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Objects appear looming, gigantic, or abnormally close up.',
    clinicalSignificance: 'Receptive field magnification alteration in ventral visual stream.',
    imagePath: '/aura_images/aura_23.png',
  },
  {
    id: 24,
    numberLabel: '#24',
    name: 'Dyschromatopsia (Color Inversion)',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Unnatural color palette shift, inverted hues (e.g. orange sky, blue vegetation).',
    clinicalSignificance: 'Cortical color processing disruption in visual area V4.',
    imagePath: '/aura_images/aura_24.png',
  },
  {
    id: 25,
    numberLabel: '#25',
    name: 'Alice in Wonderland Syndrome / Metamorphopsia',
    category: 'atypical',
    categoryLabel: 'Complex / Metamorphopsia',
    description: 'Complex surreal distortions of body image, object contours, time perception, and proportions.',
    clinicalSignificance: 'Temporoparietal junction integration anomaly; frequent in pediatric and adolescent migraine.',
    imagePath: '/aura_images/aura_25.png',
  },
  {
    id: 26,
    numberLabel: '#26',
    name: 'Palinopsia (Visual Trailing / Afterimages)',
    category: 'distortion',
    categoryLabel: 'Distorted Vision',
    description: 'Persistent afterimages or trailing multiple silhouettes behind moving objects.',
    clinicalSignificance: 'Prolonged visual persistence caused by cortical disinhibition.',
    imagePath: '/aura_images/aura_26.png',
  },
  {
    id: 27,
    numberLabel: '#27',
    name: 'Grayscale Fortification Spectrum (Contralateral)',
    category: 'atypical',
    categoryLabel: 'Patient-Reported Variant',
    description: 'Monochromatic black-and-white jagged fortification spectrum with lines developing on the opposite side.',
    clinicalSignificance: 'Achromatopsic aura variant reported by patients experiencing classic teichopsia without chromatic activation.',
    imagePath: '/aura_images/aura_27.png',
  },
];

export const PATIENT_AURA_EXPERIENCES: PatientAuraExperience[] = [
  {
    patientLabel: 'Anonymous Patient #1',
    sequence: [8, 13, 3, 2],
    sequenceDisplay: '#8 ➔ #13 ➔ #3 ➔ #2',
    quote:
      'Mine begins as #8 (colored spots), then develops into #13 (arcuate scintillating ring) ➔ #3 (expanding jagged fortification spectrum) ➔ #2 (foggy diffuse blur) as the severe head pain begins.',
    clinicalInsight:
      'Demonstrates textbook march of cortical spreading depression: initial punctate color activation (#8) evolving into expanding boundary wave (#13, #3) followed by post-depression refractory blur (#2).',
  },
  {
    patientLabel: 'Anonymous Patient #2',
    sequence: [1, 6],
    sequenceDisplay: '#1 ➔ #6 (Clockwise Rotating Spot)',
    quote:
      'Mine tend to be a single, white spot of light (#1). Moves in a clockwise rotation with a perceptible "tail" trailing behind across the visual field before sparkles (#6) appear.',
    clinicalInsight:
      'Rotational motion and trailing tail indicates focal retinotopic migration with transient palinopsia trailing the focal epicenter.',
  },
  {
    patientLabel: 'Anonymous Patient #3',
    sequence: [27],
    sequenceDisplay: '#27 (Monochromatic Variant)',
    quote:
      'I get #3 but from the other side, and pure greyscale (#27). No rainbow colors at all—just intense vibrating black-and-white zig-zag lines cutting across vision.',
    clinicalInsight:
      'Confirms achromatic fortification spectrum (#27): cortical depolarization restricted to parvocellular luminance channels without ventral V4 color excitation.',
  },
  {
    patientLabel: 'Anonymous Patient #4',
    sequence: [5, 13],
    sequenceDisplay: '#5 ➔ #13',
    quote:
      'Starts as tiny blind spots (#5) scattered around text when I try to read on a monitor, then within 15 minutes they fuse into a shimmering crescent (#13) that drifts toward the peripheral edge.',
    clinicalInsight:
      'Macular patchy scotomas coalescing into an expanding calcarine crescent over 15–20 minutes is definitive for spreading cortical depression.',
  },
  {
    patientLabel: 'Anonymous Patient #5',
    sequence: [10, 16],
    sequenceDisplay: '#10 ➔ #16',
    quote:
      '#10 (kaleidoscope prism shapes) followed immediately by #16 (tunnel vision). The progression lasts about 45 minutes before nausea starts.',
    clinicalInsight:
      'Higher cortical associative involvement (#10) transitioning to bilateral peripheral constriction (#16) before trigeminal-autonomic activation.',
  },
  {
    patientLabel: 'Anonymous Patient #6',
    sequence: [11, 19],
    sequenceDisplay: '#11 ➔ #19',
    quote:
      '#11 (intense visual snow and grainy static) that suddenly fractures into #19 (shattered glass effect), making it impossible to recognize faces or road signs.',
    clinicalInsight:
      'Diffuse thalamic dysrhythmia (#11) progressing to severe spatial discontinuity (#19).',
  },
  {
    patientLabel: 'Anonymous Patient #7',
    sequence: [20, 14],
    sequenceDisplay: '#20 ➔ #14',
    quote:
      'Starts with #20 (vibrant glowing halo around lights and people\'s silhouettes), which slowly contracts into #14 (complete loss of right peripheral vision).',
    clinicalInsight:
      'Hyper-excitatory lateral halo phase followed by unilateral post-excitation cortical silence (hemianopic visual deficit).',
  },
];
