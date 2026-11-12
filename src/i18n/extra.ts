import type { Lang } from '../config/site';

/** Copy for the "How it works" page, the lead form, and a few home-page extras. */
const he = {
  nav: { how: 'איך זה עובד', talk: 'דברו איתנו' },
  home: {
    marquee: ['״תביא לי את הכבל הרגיל״', 'הודעה קולית 0:42', 'תמונה של פתק', '״כמו בפעם הקודמת״', 'קובץ Excel', '״40 זוג MC4״', '״יש ממיר 50 במלאי?״', 'רשימה בכתב יד'],
    marqueeLabel: 'כך נראות הזמנות אמיתיות',
    journeyMore: 'להסבר המלא על כל שלב',
    talkEyebrow: 'דברו איתנו',
    scrollHint: 'גללו',
    whatsapp: 'דברו איתנו בוואטסאפ',
    whatsappText: 'היי, אשמח לשמוע על תזמין',
    pricingQ: 'כמה זה עולה?',
    team: 'הצוות',
    sample: 'תוכן לדוגמה',
    themeDark: 'מצב כהה',
    themeLight: 'מצב בהיר',
  },
  proof: { eyebrow: 'לקוחות', title: 'מה אומרים עלינו' },
  video: {
    eyebrow: 'סרטון',
    title: 'כל הסיפור בסרטון קצר',
    lead: 'מההודעה המבולגנת ועד ההזמנה במערכת. עם קריינות וכתוביות.',
    play: 'הפעלת הסרטון',
    watch: 'צפו בסרטון',
    captions: 'כתוביות',
    durations: { wide: '1:09', tall: '0:35' },
  },
  how: {
    title: 'איך זה עובד',
    metaDescription: 'הסבר מפורט: מה קורה להזמנה מהרגע שהלקוח כותב בוואטסאפ ועד שהיא נכנסת למערכת ה-ERP.',
    heading: 'מהודעה מבולגנת להזמנה במערכת',
    lead: 'תשעה שלבים, מקצה לקצה. בכל שלב כתוב מה תזמין עושה, מה הוא לא עושה, ואיפה הנציג נכנס לתמונה.',
    stepLabel: 'שלב',
    details: [
      [
        'הלקוח כותב לנציג בוואטסאפ הרגיל שלו: טקסט חופשי, תמונה של רשימה בכתב יד, הודעה קולית, קובץ, או ״כמו בפעם הקודמת״.',
        'אין אפליקציה חדשה, אין פורטל ואין הדרכה ללקוחות.',
      ],
      [
        'הנציג מעביר את ההודעה לתזמין, כמו שמעבירים הודעה לכל איש קשר.',
        'זה עובד גם כשההודעה הגיעה בקבוצה או לטלפון האישי של הנציג.',
      ],
      [
        'תזמין מאתר את הלקוח לפי פרטי איש הקשר ברשימת הלקוחות שסונכרנה מהמערכת שלכם.',
        'יחד עם הלקוח נשלפים המחירון שלו, היסטוריית ההזמנות והכינויים שכבר נלמדו.',
        'לקוח שלא זוהה לא מקבל הצעה אוטומטית. הנציג משייך אותו ידנית.',
      ],
      [
        'הודעה קולית מתומללת, ותמונה של פתק מפוענחת לטקסט.',
        'מודל שפה מפרק את הטקסט לשורות: כמות, יחידה, תיאור ומאפיינים כמו הספק, חתך או צבע.',
        'בשלב הזה המודל לא רואה את הקטלוג ולא רואה מחירים, ולכן אין לו ממה להמציא.',
      ],
      [
        'לכל שורה נשלפים מועמדים מהקטלוג שלכם: כינוי מוכר של הלקוח, מק״ט מדויק, פריטים שהוזמנו בעבר וחיפוש טקסטואלי.',
        'מספרים הם מסנן קשיח: 545W ו-550W, או 4 ממ״ר ו-6 ממ״ר, לא מתחלפים זה בזה.',
        'המודל בוחר רק מתוך רשימת המועמדים, או מחזיר ״אין התאמה״ או ״נדרש בירור״.',
      ],
      [
        'כשיש כמה התאמות סבירות, השורה מסומנת והנציג מקבל שלוש אפשרויות לבחירה.',
        'שורות שהגיעו מכתב יד או מהקלטה מסומנות תמיד לבדיקה.',
      ],
      [
        'המחיר נשלף בקוד מהמחירונים שסונכרנו: מחיר לקוח, אחר כך קבוצת לקוחות, אחר כך מחיר בסיס.',
        'למודל השפה אין שדה מחיר, ולכן הוא לא יכול להחזיר מחיר.',
        'ליד כל מחיר מופיע המקור שלו.',
      ],
      [
        'הנציג רואה טיוטה אחת מסודרת: שורות מותאמות, שורות לבדיקה וסכום.',
        'אפשר לתקן שורה, להחליף פריט או לשנות כמות, ואז לאשר.',
      ],
      [
        'הלקוח מקבל הצעת מחיר כקובץ PDF.',
        'אחרי שהלקוח מאשר, ההזמנה נכתבת ל-ERP, ותזמין קורא אותה בחזרה כדי לוודא שהיא אכן נרשמה.',
        'כל תיקון או אישור של הנציג נשמר ככינוי של אותו לקוח, כך שבפעם הבאה ״הכבל הרגיל״ כבר מזוהה.',
      ],
    ],
    states: {
      title: 'שלושה מצבים לכל שורה',
      lead: 'הנציג רואה במבט אחד איפה צריך אותו.',
      items: [
        { k: 'ok', title: 'מותאמת', body: 'התאמה חד-משמעית למק״ט קיים, עם מחיר מהמחירון.' },
        { k: 'pick', title: 'לבחירה', body: 'כמה התאמות אפשריות. הנציג בוחר אחת משלוש.' },
        { k: 'review', title: 'לבדיקה', body: 'שורה מכתב יד או מהקלטה, או שורה בלי התאמה. הנציג בודק ומחליט.' },
      ],
    },
    build: {
      title: 'איך זה בנוי',
      lead: 'ליבה אחת קבועה. כל חברה מתחברת דרך מתאם וקובץ הגדרות.',
      items: [
        { title: 'עותק מסונכרן', body: 'לקוחות, קטלוג, מחירונים והיסטוריה מסונכרנים מהמערכת שלכם, כך שההתאמה מהירה ולא מעמיסה על ה-ERP.' },
        { title: 'כתיבה רק באישור', body: 'למערכת שלכם נכתב דבר אחד בלבד: הזמנה שאושרה. אחרי הכתיבה מתבצעת קריאה חוזרת לאימות.' },
        { title: 'הפרדה בין חברות', body: 'הנתונים של כל חברה מופרדים ברמת מסד הנתונים. חברה אחת לא רואה נתונים של אחרת.' },
        { title: 'מודל עם ידיים קשורות', body: 'המודל מקבל טקסט ותמונות בלבד, בלי מחירים, ואין לו כלי שכותב למערכת שלכם.' },
      ],
    },
    need: {
      title: 'מה צריך מכם כדי להתחיל',
      lead: 'את הרשימה סוגרים יחד בסוף שיחת ההיכרות.',
      items: [
        'ייצוא קטלוג: מק״ט, תיאור ויחידת מידה',
        'מחירונים',
        '12 חודשים של שורות הזמנה או חשבונית',
        '50 עד 100 הזמנות וואטסאפ אמיתיות (צילומי מסך)',
        'רשימת לקוחות ואנשי קשר',
        'דוגמה של הצעת מחיר ולוגו',
      ],
    },
    cta: 'רוצים לראות את זה על ההזמנות שלכם?',
  },
  form: {
    role: 'תפקיד',
    vertical: 'תחום',
    verticalOptions: ['חשמל', 'סולארי', 'אינסטלציה', 'מיזוג', 'כלי עבודה ופרזול', 'חומרי בניין', 'אחר'],
    volume: 'כמה הזמנות ביום, בערך?',
    volumeOptions: ['עד 5', '5 עד 20', '20 עד 50', 'יותר מ-50'],
    sending: 'שולח…',
    success: 'קיבלנו, תודה. נחזור אליכם בהקדם לתיאום שיחה.',
    errorServer: 'השליחה לא הצליחה. אפשר לנסות שוב, או לכתוב לנו ישירות.',
    fallback: 'השליחה דרך האתר לא זמינה כרגע, אז פתחנו את תוכנת הדוא״ל שלכם עם הפרטים.',
    errorMin: 'הטקסט קצר מדי.',
    errorPhone: 'נא להזין מספר טלפון תקין.',
    hp: 'נא להשאיר שדה זה ריק',
    legend: 'פרטי הפנייה',
  },
};

type Extra = typeof he;

const en: Extra = {
  nav: { how: 'How it works', talk: 'Talk to us' },
  home: {
    marquee: ['“bring me the usual cable”', 'Voice message 0:42', 'Photo of a note', '“same as last time”', 'Excel file', '“40 pairs MC4”', '“got a 50 inverter in stock?”', 'Handwritten list'],
    marqueeLabel: 'What real orders look like',
    journeyMore: 'The full explanation of every step',
    talkEyebrow: 'Talk to us',
    scrollHint: 'Scroll',
    whatsapp: 'Talk to us on WhatsApp',
    whatsappText: 'Hi, I would like to hear about Tazmin',
    pricingQ: 'How much does it cost?',
    team: 'Team',
    sample: 'Sample content',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
  },
  proof: { eyebrow: 'Customers', title: 'What they say' },
  video: {
    eyebrow: 'Video',
    title: 'The whole story in a short video',
    lead: 'From the messy message to the order in your system. Narrated, with captions.',
    play: 'Play the video',
    watch: 'Watch the video',
    captions: 'Captions',
    durations: { wide: '1:12', tall: '0:37' },
  },
  how: {
    title: 'How it works',
    metaDescription: 'A detailed walkthrough: what happens to an order from the moment a customer writes on WhatsApp until it enters the ERP.',
    heading: 'From a messy message to an order in your system',
    lead: 'Nine steps, end to end. Each one says what Tazmin does, what it does not do, and where the rep comes in.',
    stepLabel: 'Step',
    details: [
      [
        'The customer writes to the rep on regular WhatsApp: free text, a photo of a handwritten list, a voice message, a file, or “same as last time”.',
        'No new app, no portal and no training for customers.',
      ],
      [
        'The rep forwards the message to Tazmin, the way you forward a message to any contact.',
        'It works even when the message arrived in a group or on the rep’s personal phone.',
      ],
      [
        'Tazmin finds the customer by the contact’s details in the customer list synced from your system.',
        'Along with the customer it loads their price list, order history and the nicknames already learned.',
        'An unidentified customer never gets an automatic quote. The rep assigns them manually.',
      ],
      [
        'A voice message is transcribed, and a photo of a note is read into text.',
        'A language model breaks the text into lines: quantity, unit, description and attributes such as wattage, cross-section or colour.',
        'At this stage the model sees neither the catalog nor prices, so it has nothing to invent from.',
      ],
      [
        'For each line, candidates are retrieved from your catalog: a known customer nickname, an exact SKU, items ordered before and text search.',
        'Numbers are a hard filter: 545W and 550W, or 4mm² and 6mm², never stand in for each other.',
        'The model chooses only from the candidate list, or returns “no match” or “needs clarification”.',
      ],
      [
        'When several matches are plausible, the line is flagged and the rep gets three options to choose from.',
        'Lines that came from handwriting or a recording are always flagged for review.',
      ],
      [
        'The price is looked up in code from the synced price lists: customer price, then customer group, then base price.',
        'The language model has no price field, so it cannot return a price.',
        'Next to every price you see where it came from.',
      ],
      [
        'The rep sees one clean draft: matched lines, lines to review and a total.',
        'They can fix a line, swap an item or change a quantity, and then approve.',
      ],
      [
        'The customer receives the quote as a PDF.',
        'Once the customer confirms, the order is written to the ERP, and Tazmin reads it back to verify it was really recorded.',
        'Every correction or approval by the rep is saved as that customer’s nickname, so next time “the usual cable” is already recognised.',
      ],
    ],
    states: {
      title: 'Three states for every line',
      lead: 'The rep sees at a glance where they are needed.',
      items: [
        { k: 'ok', title: 'Matched', body: 'A clear-cut match to an existing SKU, with a price from the price list.' },
        { k: 'pick', title: 'To choose', body: 'Several possible matches. The rep picks one of three.' },
        { k: 'review', title: 'To review', body: 'A line from handwriting or a recording, or a line with no match. The rep checks and decides.' },
      ],
    },
    build: {
      title: 'How it is built',
      lead: 'One fixed core. Each company connects through a connector and a settings file.',
      items: [
        { title: 'A synced copy', body: 'Customers, catalog, price lists and history are synced from your system, so matching is fast and does not load the ERP.' },
        { title: 'Writes only on approval', body: 'Only one thing is ever written to your system: an approved order. After writing, it is read back for verification.' },
        { title: 'Separation between companies', body: 'Each company’s data is separated at the database level. One company never sees another’s data.' },
        { title: 'A model with its hands tied', body: 'The model receives text and images only, no prices, and has no tool that writes to your system.' },
      ],
    },
    need: {
      title: 'What we need from you to start',
      lead: 'We close the list together at the end of the intro call.',
      items: [
        'Catalog export: SKU, description and unit of measure',
        'Price lists',
        '12 months of order or invoice lines',
        '50 to 100 real WhatsApp orders (screenshots)',
        'Customer and contact list',
        'A sample quote and your logo',
      ],
    },
    cta: 'Want to see it on your own orders?',
  },
  form: {
    role: 'Role',
    vertical: 'Industry',
    verticalOptions: ['Electrical', 'Solar', 'Plumbing', 'HVAC', 'Tools & hardware', 'Building materials', 'Other'],
    volume: 'Roughly how many orders a day?',
    volumeOptions: ['Up to 5', '5 to 20', '20 to 50', 'More than 50'],
    sending: 'Sending…',
    success: 'Got it, thank you. We will get back to you shortly to schedule a call.',
    errorServer: 'Sending failed. You can try again, or write to us directly.',
    fallback: 'Sending through the site is unavailable right now, so we opened your email app with the details.',
    errorMin: 'This text is too short.',
    errorPhone: 'Please enter a valid phone number.',
    hp: 'Please leave this field empty',
    legend: 'Your details',
  },
};

export const extra = (lang: Lang): Extra => (lang === 'en' ? en : he);
