import type { Scheme } from '../types/scheme';

/**
 * Curated demo scheme dataset. Structured so official data can replace it later
 * without changing the matching logic or the UI.
 */
export const SCHEMES: Scheme[] = [
  {
    id: 'pmegp',
    name: 'PMEGP',
    fullName: 'Prime Minister\'s Employment Generation Programme',
    ministry: 'Ministry of MSME',
    summary:
      'Credit-linked subsidy programme for setting up new micro-enterprises in the non-farm sector.',
    categories: 'all',
    forStatus: ['new'],
    minProjectCost: 50000,
    maxProjectCost: 5000000,
    subsidyInfo: 'Subsidy of 15%–35% of project cost depending on category and area.',
    keyEligibility: [
      'Individual above 18 years of age',
      'New enterprise (not an existing unit)',
      'Project cost within programme limits',
      'No income ceiling for setting up the unit',
    ],
    documents: [
      'Aadhaar card',
      'Project report / business plan',
      'Caste / special category certificate (if applicable)',
      'Bank account details',
    ],
    supportInfo: 'Applications processed via KVIC / State KVIB / DIC through the PMEGP e-portal.',
    officialSource: 'https://www.kviconline.gov.in/pmegpeportal/',
  },
  {
    id: 'mudra',
    name: 'PM MUDRA',
    fullName: 'Pradhan Mantri MUDRA Yojana',
    ministry: 'Ministry of Finance',
    summary:
      'Collateral-free loans up to ₹10 lakh for micro and small non-corporate business enterprises.',
    categories: 'all',
    forStatus: ['new', 'existing'],
    minProjectCost: 10000,
    maxProjectCost: 1000000,
    subsidyInfo: 'Loans under Shishu (up to ₹50k), Kishore (₹50k–₹5L), Tarun (₹5L–₹10L).',
    keyEligibility: [
      'Non-farm income-generating micro enterprise',
      'Indian citizen with a viable business plan',
      'Loan requirement within ₹10 lakh',
      'No collateral required',
    ],
    documents: [
      'Identity and address proof',
      'Business plan / quotation of machinery',
      'Bank statements',
      'Passport-size photographs',
    ],
    supportInfo: 'Available through banks, NBFCs, and MFIs.',
    officialSource: 'https://www.mudra.org.in/',
  },
  {
    id: 'nlm',
    name: 'NLM',
    fullName: 'National Livestock Mission',
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    summary:
      'Support for entrepreneurship development in poultry, sheep, goat, piggery, and feed & fodder sectors.',
    categories: ['agriculture', 'dairy'],
    forStatus: ['new', 'existing'],
    minProjectCost: 100000,
    maxProjectCost: 5000000,
    subsidyInfo: 'Capital subsidy up to 50% for eligible livestock entrepreneurship projects.',
    keyEligibility: [
      'Individual, FPO, SHG, or Section-8 company',
      'Livestock / dairy / allied activity',
      'Bank-appraised project',
      'Own contribution as per norms',
    ],
    documents: [
      'Detailed project report',
      'Land / lease documents',
      'Training certificate (if available)',
      'Bank sanction / appraisal',
    ],
    supportInfo: 'Implemented through State Animal Husbandry departments and NABARD.',
    officialSource: 'https://nlm.udyamimitra.in/',
  },
  {
    id: 'sfurti',
    name: 'SFURTI',
    fullName: 'Scheme of Fund for Regeneration of Traditional Industries',
    ministry: 'Ministry of MSME',
    summary:
      'Support for clusters of traditional artisans and industries to become competitive.',
    categories: ['handicraft', 'textile'],
    forStatus: ['new', 'existing'],
    minProjectCost: 100000,
    maxProjectCost: 5000000,
    subsidyInfo: 'Cluster-based funding for common facilities, tools, and market linkage.',
    keyEligibility: [
      'Traditional artisan / craft cluster',
      'Group or cluster-based application',
      'Focus on value addition and market access',
      'Implementing agency support',
    ],
    documents: [
      'Cluster / SHG details',
      'Artisan identity proof',
      'Project proposal',
      'Bank details',
    ],
    supportInfo: 'Implemented via nodal and implementing agencies under KVIC.',
    officialSource: 'https://sfurti.msme.gov.in/',
  },
  {
    id: 'pmfme',
    name: 'PM FME',
    fullName: 'PM Formalisation of Micro Food Processing Enterprises',
    ministry: 'Ministry of Food Processing Industries',
    summary:
      'Credit-linked subsidy for micro food-processing units, with a focus on one-district-one-product.',
    categories: ['food-processing', 'agriculture', 'dairy'],
    forStatus: ['new', 'existing'],
    minProjectCost: 100000,
    maxProjectCost: 10000000,
    subsidyInfo: 'Credit-linked capital subsidy of 35% (max ₹10 lakh per unit).',
    keyEligibility: [
      'Micro food-processing enterprise',
      'Individual / FPO / SHG / cooperative',
      'Alignment with local product focus',
      'Own contribution of at least 10%',
    ],
    documents: [
      'Aadhaar and PAN',
      'Detailed project report',
      'Proof of business / registration',
      'Bank account details',
    ],
    supportInfo: 'Applied through the PM FME MIS portal with State Nodal Agency support.',
    officialSource: 'https://pmfme.mofpi.gov.in/',
  },
];

export const SCHEME_DISCLAIMER =
  'These schemes are shown as potentially relevant based on the information provided. This is not a confirmation of eligibility or an approval. Please verify details on the official sources before applying.';
