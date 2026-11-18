export interface ProductBlueprint {
  key: string;
  productName: string;
  category: string;
  description: string;
  descriptionHindi: string;
  tags: string[];
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  highlights: string[];
}

/**
 * Demo product intelligence used when a real vision API is unavailable.
 * The uploaded image is previewed on the frontend; details come from here.
 */
export const PRODUCT_BLUEPRINTS: ProductBlueprint[] = [
  {
    key: 'bamboo-basket',
    productName: 'Handcrafted Bamboo Storage Basket',
    category: 'Home & Lifestyle',
    description:
      'A durable, handwoven bamboo storage basket crafted by skilled rural artisans. Its natural finish and sturdy build make it perfect for organising homes while adding an eco-friendly, rustic touch. Each piece is unique, sustainable, and made from locally sourced bamboo.',
    descriptionHindi:
      'कुशल ग्रामीण कारीगरों द्वारा हाथ से बुनी गई मजबूत और टिकाऊ बांस की भंडारण टोकरी। इसकी प्राकृतिक फिनिश और मजबूत बनावट इसे घर को व्यवस्थित रखने के लिए आदर्श बनाती है। हर टोकरी अनूठी, पर्यावरण-अनुकूल और स्थानीय बांस से बनी है।',
    tags: ['Handmade', 'Bamboo', 'Eco-Friendly', 'Rural Craft', 'Sustainable'],
    suggestedPriceMin: 650,
    suggestedPriceMax: 750,
    highlights: [
      '100% natural, biodegradable bamboo',
      'Handwoven by rural artisans',
      'Sturdy and long-lasting',
      'Eco-friendly storage solution',
    ],
  },
  {
    key: 'dairy-ghee',
    productName: 'Pure Farm-Fresh Desi Ghee',
    category: 'Food & Grocery',
    description:
      'Traditionally prepared pure desi ghee made from farm-fresh cow milk using the time-honoured bilona method. Rich in aroma and flavour, it is free from additives and preservatives — a wholesome addition to everyday cooking.',
    descriptionHindi:
      'ताज़े गाय के दूध से पारंपरिक बिलोना विधि द्वारा तैयार शुद्ध देसी घी। सुगंध और स्वाद से भरपूर, यह किसी भी मिलावट और परिरक्षक से मुक्त है — रोज़मर्रा के भोजन के लिए एक पौष्टिक विकल्प।',
    tags: ['Farm-Fresh', 'Pure', 'Desi Ghee', 'No Preservatives', 'Traditional'],
    suggestedPriceMin: 550,
    suggestedPriceMax: 700,
    highlights: [
      'Made from farm-fresh cow milk',
      'Traditional bilona method',
      'No additives or preservatives',
      'Rich aroma and taste',
    ],
  },
  {
    key: 'organic-honey',
    productName: 'Raw Organic Forest Honey',
    category: 'Food & Grocery',
    description:
      'Unprocessed, raw forest honey collected from natural beehives in pristine rural surroundings. Retaining its natural enzymes and nutrients, it is a pure and healthy sweetener for daily use.',
    descriptionHindi:
      'ग्रामीण वातावरण में प्राकृतिक मधुमक्खी के छत्तों से एकत्रित बिना प्रसंस्कृत, कच्चा वन शहद। अपने प्राकृतिक एंजाइम और पोषक तत्वों को बनाए रखते हुए, यह रोज़ाना उपयोग के लिए शुद्ध और स्वस्थ मिठास है।',
    tags: ['Raw', 'Organic', 'Forest Honey', 'Natural', 'Healthy'],
    suggestedPriceMin: 400,
    suggestedPriceMax: 550,
    highlights: [
      'Raw and unprocessed',
      'Collected from natural beehives',
      'Retains natural enzymes',
      'No added sugar',
    ],
  },
];

export const DEFAULT_PRODUCT_KEY = 'bamboo-basket';
