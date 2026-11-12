import type { Dict, Line, ProblemCard } from './he';

export const en: Dict = {
  meta: {
    siteName: 'Tazmin',
    title: 'Tazmin · The order assistant for equipment distributors',
    description:
      'Your customers keep writing on WhatsApp as always. Tazmin identifies the customer, matches every line to an existing SKU and drafts a quote for your rep to approve.',
  },
  brand: 'Tazmin',
  skip: 'Skip to main content',
  nav: {
    label: 'Main navigation',
    how: 'How it works',
    principles: 'Principles',
    faq: 'FAQ',
    about: 'About',
    contact: 'Contact',
    cta: 'Send us orders',
    menu: 'Menu',
    close: 'Close',
    langSwitch: 'עברית',
    langSwitchLabel: 'מעבר לעברית',
  },
  demoData: 'Demo data',

  hero: {
    eyebrow: 'The order assistant for equipment distributors',
    title: ['How many orders', 'came in ', 'today?'],
    sub: 'And how many did someone retype, line by line? Tazmin turns a messy WhatsApp message into a clean quote. Your rep just approves.',
    cta: 'Send us real orders from this week',
    secondary: 'Scroll to follow one order',
    chats: 'Chats',
    newMessages: 'new messages',
    chatList: [
      { name: 'Yossi Electric', text: 'Voice message' },
      { name: 'Avi Solar', text: 'Photo' },
      { name: 'Rami Plumbing', text: 'same as last time' },
      { name: 'Danny Contractor', text: 'bring me the usual cable' },
      { name: 'Shlomi Energy', text: 'got a 50 inverter in stock?' },
      { name: 'Nir HVAC', text: 'Photo' },
      { name: 'Haim Plumbing', text: 'add 10 elbows 32' },
    ],
  },

  problem: {
    eyebrow: 'The problem',
    title: 'Orders arrive in every shape',
    cards: [
      { kind: 'voice', label: 'Voice message', text: '0:42' },
      { kind: 'photo', label: 'Photo of a note', text: '40 pairs MC4\nend clamps for 35' },
      { kind: 'text', label: 'Slang', text: 'bring me the usual cable' },
      { kind: 'text', label: 'No details', text: 'same as last time' },
    ] as ProblemCard[],
    steps: ['Translates', 'Searches the catalog', 'Checks the price', 'Types it in'],
    stepsTitle: 'And the rep? Translates, searches, checks the price and types.',
    stuck: ['And when they are on vacation?', 'Everything stalls.'],
  },

  journey: {
    eyebrow: 'The path of an order',
    title: 'From a WhatsApp message to an order in your system',
    lead: 'Keep scrolling. The message moves from station to station.',
    progressLabel: 'Order progress',
    staticNote: 'Animation is off. These are the nine steps an order goes through:',
    steps: [
      {
        station: 'Customer writes',
        title: 'The customer writes as always',
        body: 'Slang-filled text, a photo of a handwritten note, a voice message. Nothing is installed and nothing changes on the customer side.',
      },
      {
        station: 'Forward',
        title: 'The rep forwards the message to Tazmin',
        body: 'One forward in WhatsApp, like to any contact. From here the message is on its way.',
      },
      {
        station: 'Identify',
        title: 'First: who is the customer?',
        body: 'Tazmin finds the customer in your customer list and pulls their order history and price list.',
      },
      {
        station: 'Parse',
        title: 'A messy message becomes lines',
        body: 'Text, handwriting and voice are broken into clean lines: quantity, unit and description. At this stage the model sees no catalog and no prices.',
      },
      {
        station: 'Catalog match',
        title: 'Every line locks onto an existing SKU',
        body: 'Matching runs only against your catalog, using that customer’s history and nicknames. A SKU that does not exist in your catalog cannot appear.',
      },
      {
        station: 'No guessing',
        title: 'Something unclear? Tazmin does not guess',
        body: 'When several matches are possible, the system offers three options and the rep picks one.',
      },
      {
        station: 'Pricing',
        title: 'Prices only from your price list',
        body: 'The price is looked up in code from the customer’s price list. No price is ever made up by a model.',
      },
      {
        station: 'Approval',
        title: 'The rep approves with one tap',
        body: 'Nothing goes out to the customer without a person approving it. The rep stays in control.',
      },
      {
        station: 'Close',
        title: 'The customer gets a quote, the order enters your system',
        body: 'The customer receives a clean quote. Once they confirm, the order is written to the system you already use, and Tazmin remembers the nickname for next time.',
      },
    ],
    ui: {
      contact: 'Avi · A.S. Solar',
      online: 'typing…',
      bubble: ['bro bring 20 panels 550', '100m cable 6 black', 'inverter 50 kilo like last time'],
      note: ['40 pairs MC4', '80 end clamps for 35'],
      voice: '0:12',
      forwardTo: 'Forward to',
      assistant: 'Order assistant',
      others: ['Sales team', 'Main warehouse'],
      send: 'Send',
      systems: ['Customer list', 'Order history', 'Customer price list'],
      systemTags: ['CRM', 'ERP', 'ERP'],
      identified: 'Customer identified',
      customer: 'A.S. Solar Ltd.',
      initials: 'AS',
      customerRows: [
        ['Contact', 'Avi Shoshan'],
        ['Price list', 'Contractors A'],
        ['Last order', 'Oct 12'],
      ],
      draft: 'Draft quote',
      awaiting: 'Awaiting rep approval',
      sources: { text: 'Text', hand: 'Handwriting', voice: 'Voice' },
      cols: { item: 'Item', qty: 'Qty', price: 'Price' },
      lines: [
        { raw: '20 panels 550', src: 'text', qty: '20', name: 'Solar panel 550W mono', sku: 'PV-550-M', price: '8,400' },
        { raw: '100m cable 6 black', src: 'text', qty: '1 roll', name: 'Solar cable 6mm² black, 100m', sku: 'CB-6-BK-100', price: '390' },
        { raw: '40 pairs MC4', src: 'hand', qty: '40', name: 'MC4 connector, pair', sku: 'MC4-PR', price: '360' },
        { raw: 'inverter 50 kilo like last time', src: 'voice', qty: '1', name: 'Inverter 50kW', sku: 'INV-50K', price: '14,500', alias: 'From the last order' },
        { raw: '80 end clamps for 35', src: 'hand', qty: '80', name: 'End clamp 35mm, aluminium', sku: 'EC-35-AL', price: '480', ambiguous: true },
      ] as Line[],
      threeOptions: '3 options',
      options: [
        { name: 'End clamp 35 · aluminium', sku: 'EC-35-AL', tag: 'Bought in the last 3 orders' },
        { name: 'End clamp 35 · black', sku: 'EC-35-BK', tag: '' },
        { name: 'Clamp 30–35 · universal', sku: 'EC-30-35-UNI', tag: '' },
      ],
      priceSource: 'Source: Contractors A price list',
      total: 'Total before VAT',
      totalValue: 24130,
      currency: '₪',
      approve: 'Approve & send',
      approved: 'Approved',
      pdfName: 'Quote.pdf',
      customerReply: 'Confirmed, thanks',
      customerPhone: 'Customer',
      erpTitle: 'ERP · Orders',
      erpRows: [
        ['Galil Electric', 'Shipped'],
        ['M.R. Plumbing', 'Picking'],
        ['Solar South', 'Shipped'],
      ],
      erpNew: 'New',
      learned: 'Learned',
      learnedFrom: '“inverter 50 kilo”',
    },
  },

  principles: {
    eyebrow: 'Principles',
    title: 'Why you can trust it',
    lines: [
      'Tazmin does not guess.',
      'Prices only from your price list.',
      'The rep approves every quote.',
      'And with every order, it learns each customer’s language.',
    ],
    cards: [
      {
        title: 'Three options instead of a guess',
        body: 'When a match is not clear-cut, the line stops. The rep sees three options and chooses.',
      },
      {
        title: 'Prices never pass through a model',
        body: 'Prices are looked up in code from your price lists: customer price, then group, then base.',
      },
      {
        title: 'Handwriting and voice are always reviewed',
        body: 'A line that came from a photo or a recording is flagged, and the rep sees it before anything goes out.',
      },
      {
        title: 'It learns only from explicit approval',
        body: 'A nickname such as “the usual cable” is saved for a customer only after a rep approved the match.',
      },
    ],
  },

  ai: {
    eyebrow: 'Behind the scenes',
    title: 'AI touches only three places',
    lead: 'Everything else is ordinary code: identifying the customer, prices, approval rules and writing to your system.',
    aiLabel: 'AI',
    codeLabel: 'Code',
    aiItems: [
      { title: 'Line extraction', body: 'Breaks a free-form message into quantity, unit and description.' },
      { title: 'Transcription and image reading', body: 'Turns a voice message and a handwritten note into text.' },
      { title: 'Choosing from a closed list', body: 'Picks a SKU only from candidates retrieved from your catalog, or returns “unclear”.' },
    ],
    codeItems: ['Customer identification', 'Prices and price lists', 'Approval rules', 'Writing to the ERP', 'Separation between companies'],
  },

  systems: {
    eyebrow: 'Integrations',
    title: 'Connects to the system you already use',
    lead: 'The core is fixed. Each company connects through a connector and a settings file, without replacing the ERP and without installing anything for customers.',
    nowLabel: 'Starting with',
    now: ['Priority', 'Google Sheets'],
    nextLabel: 'Planned',
    next: ['Rivhit', 'SAP Business One', 'Hashavshevet'],
    note: 'Product names belong to their owners. Naming them does not imply a partnership or endorsement.',
    verticalsLabel: 'Built for distributors of',
    verticals: ['Electrical', 'Solar', 'Plumbing', 'HVAC'],
  },

  benefits: {
    label: 'What you get',
    words: ['Less typing.', 'Fewer mistakes.', 'Faster replies.', 'And the rep stays in control.'],
  },

  pilot: {
    eyebrow: 'Getting started',
    title: 'A two-week pilot, on your data',
    lead: 'Tazmin is in a pilot stage with its first distributors. Before promising anything, we test on real orders.',
    steps: [
      { title: 'Intro call', body: '40 minutes. We walk through one real order together, from message to system.' },
      { title: 'Send data', body: 'Catalog, price lists, order history and 50 to 100 real WhatsApp messages.' },
      { title: 'Review together', body: 'We run your orders and see how many lines matched correctly. Then we tell you honestly whether it fits.' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions we get asked',
    items: [
      {
        q: 'Do our customers need to install anything?',
        a: 'No. Customers keep writing to the rep on WhatsApp exactly as they do today. The rep is the one who forwards the message to Tazmin.',
      },
      {
        q: 'Does Tazmin send quotes to customers on its own?',
        a: 'No. Every quote is approved by a rep before it goes out.',
      },
      {
        q: 'Where do prices come from?',
        a: 'Only from your price list. The price is looked up in code, not generated by a language model, and the interface shows the price source.',
      },
      {
        q: 'What about handwriting and voice messages?',
        a: 'The system reads them, but such lines are always flagged and reviewed by the rep. Reading Hebrew handwriting and voice is not perfect.',
      },
      {
        q: 'We work with customers in WhatsApp groups. Is that a problem?',
        a: 'Not at this stage. The rep forwards the message from the group to Tazmin, just like from any other chat.',
      },
      {
        q: 'What if our catalog is messy?',
        a: 'Match quality depends on catalog quality. As part of the pilot we review the catalog and flag duplicates and generic items worth cleaning up.',
      },
      {
        q: 'Which ERP systems do you work with?',
        a: 'We start with Priority and Google Sheets. Connectors for Rivhit, SAP Business One and Hashavshevet are planned. If you use something else, talk to us.',
      },
      {
        q: 'What happens to our data?',
        a: 'Your data is used only to provide the service to you. Before any data is transferred we sign a data processing agreement, and one company never sees another company’s data.',
      },
    ],
  },

  cta: {
    q: 'Want to see it on your own data?',
    title: 'Send us real orders from this week',
    slogan: 'Order in your orders. Peace for your reps.',
    button: 'Contact us',
  },

  footer: {
    tagline: 'The order assistant for equipment distributors.',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    accessibility: 'Accessibility statement',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    rights: 'All rights reserved.',
    demoNote: 'Prices, SKUs and customer names shown on this site are demo data only.',
    trademarks: 'WhatsApp, Priority, SAP, Google Sheets and other names are trademarks of their respective owners.',
  },

  a11y: {
    open: 'Accessibility menu',
    title: 'Accessibility',
    textSize: 'Text size',
    textSizes: ['Normal', 'Large', 'Larger'],
    contrast: 'High contrast',
    links: 'Highlight links',
    motion: 'Stop animations',
    readable: 'Readable font',
    reset: 'Reset',
    statement: 'Accessibility statement',
    close: 'Close',
  },

  about: {
    title: 'About',
    metaDescription: 'Who we are, what we are building and why.',
    heading: 'Order in your orders. Peace for your reps.',
    lead: 'Tazmin is an order assistant for companies that sell equipment: electrical, solar, plumbing and HVAC.',
    sections: [
      {
        h: 'Why we started',
        p: [
          'At equipment distributors in Israel, most orders arrive on WhatsApp: a list full of slang, a photo of a note, a voice message, or simply “same as last time”.',
          'Someone has to translate that into SKUs, find a price and type it in line by line. It takes time, it causes mistakes, and when that person is away, orders wait.',
        ],
      },
      {
        h: 'What we are building',
        p: [
          'A thin layer on top of the system you already have. The rep forwards a message and Tazmin returns a draft quote: an identified customer, lines matched to existing SKUs, and prices from the price list.',
          'The rep reviews, corrects if needed and approves. Once the customer confirms, the order goes into the ERP.',
        ],
      },
      {
        h: 'How we work',
        p: [
          'We do not promise numbers before testing on your data. Every engagement starts with a discovery call and a short pilot on real orders, and at the end we tell you honestly whether it fits.',
        ],
      },
      {
        h: 'Where we are today',
        p: [
          'Tazmin is at an early stage, in pilot with its first distributors. If you distribute equipment and want to be among the first, we would love to talk.',
        ],
      },
    ],
    companyTitle: 'Company details',
    companyRows: { name: 'Name', id: 'Company no.', address: 'Address', email: 'Email', phone: 'Phone' },
  },

  contact: {
    title: 'Contact',
    metaDescription: 'Send us real orders from this week and we will see together whether Tazmin fits.',
    heading: 'Let’s talk',
    lead: 'Tell us a little about your company. We will get back to you to schedule a 40-minute intro call.',
    direct: 'Or reach us directly',
    email: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    form: {
      name: 'Full name',
      company: 'Company name',
      email: 'Email',
      phone: 'Phone',
      erp: 'ERP system',
      erpOptions: ['Priority', 'SAP Business One', 'Hashavshevet', 'Rivhit', 'Excel / Google Sheets', 'Other'],
      choose: 'Choose',
      message: 'A few words about your orders',
      messageHint: 'For example: how many orders a day, and through which channel they arrive.',
      required: 'Required',
      optional: 'Optional',
      consent: 'I have read the privacy policy and agree that my details will be used to contact me about this enquiry.',
      submit: 'Send',
      mailSubject: 'Website enquiry',
      note: 'Pressing “Send” opens your email app with the details filled in. Nothing is sent until you confirm there.',
      errorRequired: 'Please fill in this field.',
      errorEmail: 'Please enter a valid email address.',
      errorConsent: 'Consent is required to send the enquiry.',
      errorSummary: 'Some fields need fixing:',
      notConfigured: 'The site’s email address has not been configured yet. Your details were not sent.',
      opened: 'We opened your email app. If it did not open, you can write to us directly at the address on this page.',
    },
  },

  legalCommon: {
    updated: 'Last updated',
    draftBanner: 'This text is a draft and must be approved by a lawyer before the site goes live.',
    toc: 'Contents',
  },

  notFound: {
    title: 'Page not found',
    body: 'The address you reached does not exist.',
    home: 'Back to home',
  },
};
