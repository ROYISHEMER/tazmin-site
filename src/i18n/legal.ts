import type { Lang } from '../config/site';

/**
 * Legal texts. Tokens in {braces} are filled from src/config/site.ts at render
 * time; a missing value prints a visible "[to complete]" marker.
 *
 * These are careful drafts, not legal advice. Have a lawyer review them
 * before launch (see README, "Before going live").
 */
export interface LegalSection { id: string; h: string; p?: string[]; list?: string[]; after?: string[] }
export interface LegalDoc { title: string; description: string; intro: string[]; sections: LegalSection[] }

type Docs = Record<'accessibility' | 'privacy' | 'terms', Record<Lang, LegalDoc>>;

export const LEGAL: Docs = {
  accessibility: {
    he: {
      title: 'הצהרת נגישות',
      description: 'הצהרת הנגישות של אתר תזמין, פרטי רכז הנגישות ודרכי פנייה.',
      intro: [
        'אנחנו רואים חשיבות בכך שכל אדם יוכל להשתמש באתר בנוחות, כולל אנשים עם מוגבלות. השקענו בהנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998, ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013.',
      ],
      sections: [
        {
          id: 'standard',
          h: 'רמת הנגישות',
          p: [
            'האתר נבנה לפי התקן הישראלי ת״י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, ובשאיפה לעמוד גם בהנחיות WCAG 2.1 ברמה AA.',
          ],
        },
        {
          id: 'done',
          h: 'מה עשינו',
          list: [
            'ניווט מלא במקלדת, סדר פוקוס הגיוני וסימון פוקוס ברור.',
            'קישור ״דילוג לתוכן הראשי״ בתחילת כל עמוד.',
            'מבנה סמנטי: כותרות היררכיות, אזורי ציון דרך (landmarks) ותוויות לשדות טפסים.',
            'ניגודיות צבעים מספקת בין טקסט לרקע.',
            'התאמה למסכים בכל גודל ולהגדלת תצוגה עד 200%.',
            'תמיכה בעברית (ימין לשמאל) ובאנגלית, עם הגדרת שפה נכונה לקוראי מסך.',
            'האנימציות באתר מופעלות בגלילה בלבד. הן נעצרות אוטומטית כשמוגדרת במכשיר העדפה להפחתת תנועה, ואפשר לעצור אותן מתפריט הנגישות.',
            'לאיורים המונפשים יש חלופה טקסטואלית מלאה, והם מוסתרים מקוראי מסך.',
            'לסרטון ההסבר יש כתוביות, והוא אינו מתנגן אוטומטית.',
          ],
        },
        {
          id: 'menu',
          h: 'תפריט הנגישות',
          p: ['בכל עמוד מופיע כפתור נגישות, ובו האפשרויות הבאות:'],
          list: ['הגדלת הטקסט', 'ניגודיות גבוהה', 'הדגשת קישורים', 'גופן קריא', 'עצירת אנימציות', 'איפוס ההגדרות'],
          after: ['ההעדפות נשמרות בדפדפן שלכם בלבד (localStorage) ואינן נשלחות אלינו.'],
        },
        {
          id: 'limits',
          h: 'מגבלות ידועות',
          p: [
            'האתר נבדק על ידינו בדפדפנים נפוצים, במקלדת ובקורא מסך. טרם נערכה לאתר בדיקה של מורשה נגישות שירות.',
            'ייתכן שיימצאו באתר חלקים שעדיין אינם נגישים במלואם. אם נתקלתם בבעיה, נשמח שתעדכנו אותנו ונטפל בה בהקדם.',
          ],
        },
        {
          id: 'contact',
          h: 'פנייה לרכז הנגישות',
          p: ['נתקלתם בבעיית נגישות, או שאתם צריכים מידע בפורמט אחר? אפשר לפנות לרכז הנגישות:'],
          list: ['שם: {a11yName}', 'דוא״ל: {a11yEmail}', 'טלפון: {a11yPhone}'],
          after: ['נשתדל להשיב לכל פנייה בתוך 14 ימי עסקים.'],
        },
      ],
    },
    en: {
      title: 'Accessibility statement',
      description: 'Tazmin website accessibility statement, accessibility coordinator details and how to reach us.',
      intro: [
        'We want everyone to be able to use this site comfortably, including people with disabilities. We have worked to make the site accessible in line with the Israeli Equal Rights for Persons with Disabilities Law, 1998, and the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 2013.',
      ],
      sections: [
        {
          id: 'standard',
          h: 'Conformance level',
          p: [
            'The site is built to Israeli Standard 5568, which is based on WCAG 2.0 level AA, and aims to meet WCAG 2.1 level AA as well.',
          ],
        },
        {
          id: 'done',
          h: 'What we did',
          list: [
            'Full keyboard navigation, a logical focus order and a clear focus indicator.',
            'A “Skip to main content” link at the top of every page.',
            'Semantic structure: hierarchical headings, landmarks and labels on form fields.',
            'Sufficient colour contrast between text and background.',
            'Layouts that adapt to any screen size and to zoom up to 200%.',
            'Hebrew (right-to-left) and English, with the correct language declared for screen readers.',
            'Animations run only in response to scrolling. They stop automatically when your device asks for reduced motion, and can be stopped from the accessibility menu.',
            'Animated illustrations have a full text alternative and are hidden from screen readers.',
            'The explainer video has captions and never plays automatically.',
          ],
        },
        {
          id: 'menu',
          h: 'Accessibility menu',
          p: ['Every page has an accessibility button with these options:'],
          list: ['Larger text', 'High contrast', 'Highlighted links', 'Readable font', 'Stop animations', 'Reset settings'],
          after: ['Your preferences are stored only in your browser (localStorage) and are not sent to us.'],
        },
        {
          id: 'limits',
          h: 'Known limitations',
          p: [
            'We tested the site ourselves in common browsers, with a keyboard and with a screen reader. It has not yet been audited by a licensed service-accessibility expert.',
            'Some parts of the site may not be fully accessible yet. If you run into a problem, please tell us and we will fix it as soon as we can.',
          ],
        },
        {
          id: 'contact',
          h: 'Contacting the accessibility coordinator',
          p: ['Ran into an accessibility problem, or need information in another format? Contact our accessibility coordinator:'],
          list: ['Name: {a11yName}', 'Email: {a11yEmail}', 'Phone: {a11yPhone}'],
          after: ['We aim to reply to every request within 14 business days.'],
        },
      ],
    },
  },

  privacy: {
    he: {
      title: 'מדיניות פרטיות',
      description: 'איזה מידע נאסף באתר תזמין, למה, ומה הזכויות שלכם.',
      intro: [
        'מדיניות זו מסבירה איזה מידע אנחנו אוספים באתר הזה, למה, ומה הזכויות שלכם. האתר מופעל על ידי {legalName} (״אנחנו״).',
        'המדיניות מתייחסת לאתר השיווקי בלבד. עיבוד מידע במסגרת שירות תזמין עצמו (למשל הזמנות ונתוני לקוחות של חברה שמשתמשת בשירות) מוסדר בהסכם נפרד מול אותה חברה.',
      ],
      sections: [
        {
          id: 'collect',
          h: 'איזה מידע אנחנו אוספים',
          list: [
            'פרטים שאתם מוסרים לנו ביוזמתכם: שם, שם החברה, דוא״ל, טלפון ותוכן הפנייה, כשאתם פונים אלינו בטופס, בדוא״ל, בטלפון או בוואטסאפ.',
            'מידע טכני שנרשם אוטומטית אצל ספק האחסון של האתר: כתובת IP, סוג דפדפן ומכשיר, העמודים שנצפו ומועד הגישה.',
            'העדפות תצוגה (שפה והגדרות נגישות). אלה נשמרות בדפדפן שלכם בלבד ואינן מגיעות אלינו.',
          ],
          after: [
            'אין עליכם חובה חוקית למסור לנו מידע. מסירתו תלויה ברצונכם, אבל בלי פרטי התקשרות לא נוכל לחזור אליכם.',
          ],
        },
        {
          id: 'use',
          h: 'למה אנחנו משתמשים במידע',
          list: [
            'כדי לחזור אליכם ולטפל בפנייה שלכם.',
            'כדי לתאם שיחת היכרות או פיילוט, אם ביקשתם.',
            'כדי לתפעל את האתר, לאבטח אותו ולאתר תקלות.',
            'כדי לעמוד בדרישות הדין.',
          ],
          after: [
            'לא נשלח אליכם דיוור שיווקי בלי הסכמה מפורשת מראש, ותוכלו לבטל הסכמה כזו בכל עת.',
          ],
        },
        {
          id: 'cookies',
          h: 'עוגיות ואחסון מקומי',
          p: [
            'האתר אינו משתמש בעוגיות פרסום או מעקב. כדי לדעת כמה צפיות יש בכל עמוד אנחנו משתמשים במדידה אנונימית של ספק האחסון (Vercel Web Analytics), שאינה שומרת עוגיות ואינה מזהה מבקרים. הגופנים מוגשים מהשרת שלנו ולא מצד שלישי.',
            'האתר שומר בדפדפן שלכם (localStorage) את העדפות הנגישות בלבד. אפשר למחוק אותן דרך הגדרות הדפדפן או בלחיצה על ״איפוס״ בתפריט הנגישות.',
            'אם נוסיף בעתיד כלי מדידה או עוגיות שאינן הכרחיות, נעדכן את המדיניות ונבקש הסכמה במקום שבו היא נדרשת.',
          ],
        },
        {
          id: 'share',
          h: 'עם מי המידע משותף',
          p: ['איננו מוכרים מידע אישי. מידע עשוי לעבור רק אל:'],
          list: [
            'ספקים שמסייעים לנו להפעיל את האתר ואת התקשורת איתכם (אחסון, דוא״ל), בכפוף להתחייבות לסודיות ולאבטחת מידע.',
            'רשויות מוסמכות, אם נידרש לכך לפי דין.',
            'גורם שירכוש את הפעילות או יתמזג איתנו, בכפוף למדיניות זו.',
          ],
        },
        {
          id: 'transfer',
          h: 'העברת מידע מחוץ לישראל',
          p: [
            'חלק מהספקים שלנו עשויים לאחסן מידע בשרתים מחוץ לישראל. במקרה כזה נפעל לפי תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ לגבולות המדינה), התשס״א-2001.',
          ],
        },
        {
          id: 'retention',
          h: 'כמה זמן המידע נשמר',
          p: [
            'פניות ופרטי התקשרות נשמרים כל עוד הם נדרשים לטיפול בפנייה ולקשר העסקי שנוצר ממנה, ולאחר מכן לתקופה הנדרשת לפי דין או להגנה מפני תביעות. אחרי כן נמחק את המידע או נהפוך אותו לאנונימי.',
          ],
        },
        {
          id: 'security',
          h: 'אבטחת מידע',
          p: [
            'אנחנו נוקטים אמצעי אבטחה מקובלים בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017. עם זאת, שום מערכת אינה חסינה לחלוטין, ואיננו יכולים להבטיח הגנה מוחלטת.',
          ],
        },
        {
          id: 'rights',
          h: 'הזכויות שלכם',
          p: [
            'לפי חוק הגנת הפרטיות, התשמ״א-1981, אתם זכאים לעיין במידע שמוחזק עליכם, לבקש לתקן אותו או למחוק אותו אם אינו נכון, שלם או מעודכן, ולבקש שנפסיק לפנות אליכם.',
            'לבקשות בנושא פרטיות אפשר לפנות אל {privacyEmail}. נשיב בתוך 30 יום.',
          ],
        },
        {
          id: 'minors',
          h: 'קטינים',
          p: ['האתר מיועד לעסקים ואינו מיועד לקטינים מתחת לגיל 18. איננו אוספים ביודעין מידע על קטינים.'],
        },
        {
          id: 'changes',
          h: 'שינויים במדיניות',
          p: ['אנחנו עשויים לעדכן את המדיניות מעת לעת. הנוסח המעודכן יפורסם בעמוד זה, עם תאריך העדכון.'],
        },
        {
          id: 'contact',
          h: 'יצירת קשר',
          list: ['{legalName}', 'כתובת: {address}', 'דוא״ל: {privacyEmail}', 'טלפון: {phone}'],
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      description: 'What information the Tazmin website collects, why, and what your rights are.',
      intro: [
        'This policy explains what information we collect on this website, why, and what your rights are. The site is operated by {legalName} (“we”).',
        'It covers the marketing website only. Data processed within the Tazmin service itself (for example, orders and customer data of a company using the service) is governed by a separate agreement with that company.',
      ],
      sections: [
        {
          id: 'collect',
          h: 'What we collect',
          list: [
            'Details you choose to give us: name, company name, email, phone and the content of your message, when you contact us by form, email, phone or WhatsApp.',
            'Technical information logged automatically by the site’s hosting provider: IP address, browser and device type, pages viewed and time of access.',
            'Display preferences (language and accessibility settings). These are stored only in your browser and never reach us.',
          ],
          after: [
            'You are under no legal obligation to give us information. Providing it is up to you, but without contact details we cannot get back to you.',
          ],
        },
        {
          id: 'use',
          h: 'How we use it',
          list: [
            'To reply to you and handle your enquiry.',
            'To schedule an intro call or pilot, if you asked for one.',
            'To operate and secure the site and diagnose problems.',
            'To comply with the law.',
          ],
          after: [
            'We will not send you marketing messages without your explicit prior consent, and you can withdraw that consent at any time.',
          ],
        },
        {
          id: 'cookies',
          h: 'Cookies and local storage',
          p: [
            'The site uses no advertising or tracking cookies. To know how many views each page gets we use our hosting provider’s anonymous measurement (Vercel Web Analytics), which stores no cookies and does not identify visitors. Fonts are served from our own server, not from a third party.',
            'The site stores only your accessibility preferences in your browser (localStorage). You can delete them in your browser settings or by pressing “Reset” in the accessibility menu.',
            'If we add measurement tools or non-essential cookies in the future, we will update this policy and ask for consent where it is required.',
          ],
        },
        {
          id: 'share',
          h: 'Who we share it with',
          p: ['We do not sell personal information. It may be passed only to:'],
          list: [
            'Providers that help us run the site and communicate with you (hosting, email), under confidentiality and security obligations.',
            'Competent authorities, where the law requires it.',
            'A party that acquires or merges with our business, subject to this policy.',
          ],
        },
        {
          id: 'transfer',
          h: 'Transfers outside Israel',
          p: [
            'Some of our providers may store information on servers outside Israel. In that case we act in accordance with the Israeli Privacy Protection (Transfer of Data to Databases Abroad) Regulations, 2001. If you are in the EU or UK, your data may be processed in Israel, which the European Commission recognises as providing adequate protection.',
          ],
        },
        {
          id: 'retention',
          h: 'How long we keep it',
          p: [
            'Enquiries and contact details are kept for as long as needed to handle the enquiry and the business relationship that follows, and afterwards for the period required by law or to defend against claims. After that we delete or anonymise them.',
          ],
        },
        {
          id: 'security',
          h: 'Security',
          p: [
            'We apply accepted security measures in line with the Israeli Privacy Protection (Data Security) Regulations, 2017. No system is completely immune, however, and we cannot guarantee absolute protection.',
          ],
        },
        {
          id: 'rights',
          h: 'Your rights',
          p: [
            'Under the Israeli Privacy Protection Law, 1981, you may review the information held about you, ask us to correct or delete it if it is inaccurate, incomplete or out of date, and ask us to stop contacting you. Depending on where you live, you may have additional rights under local law.',
            'For privacy requests, write to {privacyEmail}. We will reply within 30 days.',
          ],
        },
        {
          id: 'minors',
          h: 'Minors',
          p: ['The site is intended for businesses and not for anyone under 18. We do not knowingly collect information about minors.'],
        },
        {
          id: 'changes',
          h: 'Changes to this policy',
          p: ['We may update this policy from time to time. The current version will be published on this page with its update date.'],
        },
        {
          id: 'contact',
          h: 'Contact',
          list: ['{legalName}', 'Address: {address}', 'Email: {privacyEmail}', 'Phone: {phone}'],
        },
      ],
    },
  },

  terms: {
    he: {
      title: 'תנאי שימוש',
      description: 'התנאים החלים על השימוש באתר תזמין.',
      intro: [
        'ברוכים הבאים לאתר תזמין, המופעל על ידי {legalName} (״אנחנו״). השימוש באתר מהווה הסכמה לתנאים האלה. אם אינכם מסכימים להם, אנא אל תשתמשו באתר.',
        'התנאים מנוסחים בלשון רבים מטעמי נוחות, והם פונים לכל אדם.',
      ],
      sections: [
        {
          id: 'info',
          h: 'המידע באתר',
          p: [
            'האתר מציג מידע כללי על תזמין. המידע אינו הצעה מחייבת, ואינו התחייבות לתכונות, לביצועים, למחירים או ללוחות זמנים. תזמין נמצא בשלב פיילוט, ויכולות המוצר עשויות להשתנות.',
            'התקשרות לקבלת השירות תיעשה רק בהסכם נפרד בכתב, והוא שיחייב.',
          ],
        },
        {
          id: 'demo',
          h: 'נתוני הדגמה',
          p: [
            'ההודעות, שמות הלקוחות, המק״טים, המחירים והמסכים המוצגים באתר הם נתוני הדגמה להמחשה בלבד. כל דמיון לעסק, לאדם או למחיר אמיתיים מקרי.',
          ],
        },
        {
          id: 'ip',
          h: 'קניין רוחני',
          p: [
            'כל הזכויות באתר ובתוכנו, לרבות טקסטים, עיצוב, איורים, אנימציות, קוד, השם ״תזמין״ והלוגו, שייכות לנו או לבעלי רישיון מטעמנו. אין להעתיק, להפיץ, לשנות או לעשות שימוש מסחרי בתוכן בלי אישור מראש ובכתב.',
          ],
        },
        {
          id: 'trademarks',
          h: 'סימני מסחר של צדדים שלישיים',
          p: [
            'שמות כגון WhatsApp, Priority, SAP Business One, חשבשבת, רווחית ו-Google Sheets הם סימני מסחר של בעליהם. הם מוזכרים באתר לצורך תיאור בלבד, ואין בכך כדי להעיד על שותפות, חסות או אישור מצד אותן חברות.',
          ],
        },
        {
          id: 'use',
          h: 'שימוש מותר',
          p: ['אתם מתחייבים שלא:'],
          list: [
            'להשתמש באתר לכל מטרה בלתי חוקית.',
            'לפגוע בפעילות האתר, לנסות לחדור אליו או לעקוף אמצעי אבטחה.',
            'לאסוף מידע מהאתר באמצעים אוטומטיים באופן שמכביד עליו.',
            'למסור דרך האתר מידע כוזב או מידע על אדם אחר בלי רשותו.',
          ],
        },
        {
          id: 'links',
          h: 'קישורים',
          p: ['האתר עשוי לכלול קישורים לאתרים של צדדים שלישיים. איננו אחראים לתוכנם או למדיניות הפרטיות שלהם.'],
        },
        {
          id: 'liability',
          h: 'אחריות',
          p: [
            'האתר והמידע שבו ניתנים כמות שהם (AS IS). אנחנו משתדלים שהמידע יהיה מדויק ומעודכן, אבל ייתכנו בו טעויות או אי-דיוקים.',
            'במידה המרבית המותרת בדין, לא נישא באחריות לנזק ישיר או עקיף שייגרם בעקבות השימוש באתר או ההסתמכות על המידע שבו.',
          ],
        },
        {
          id: 'privacy',
          h: 'פרטיות',
          p: ['השימוש במידע אישי נעשה לפי מדיניות הפרטיות שלנו, שהיא חלק מתנאים אלה.'],
        },
        {
          id: 'changes',
          h: 'שינויים',
          p: ['אנחנו רשאים לעדכן את האתר ואת התנאים מעת לעת. הנוסח המחייב הוא זה שמפורסם באתר במועד השימוש.'],
        },
        {
          id: 'law',
          h: 'דין וסמכות שיפוט',
          p: [
            'על תנאים אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.',
          ],
        },
        {
          id: 'contact',
          h: 'יצירת קשר',
          list: ['{legalName}', 'כתובת: {address}', 'דוא״ל: {email}', 'טלפון: {phone}'],
        },
      ],
    },
    en: {
      title: 'Terms of use',
      description: 'The terms that apply to using the Tazmin website.',
      intro: [
        'Welcome to the Tazmin website, operated by {legalName} (“we”). By using the site you agree to these terms. If you do not agree, please do not use the site.',
        'In case of any discrepancy between the Hebrew and English versions of these terms, the Hebrew version prevails.',
      ],
      sections: [
        {
          id: 'info',
          h: 'Information on the site',
          p: [
            'The site presents general information about Tazmin. It is not a binding offer and not a commitment to features, performance, prices or timelines. Tazmin is in a pilot stage and its capabilities may change.',
            'Any engagement to receive the service will be made only through a separate written agreement, which will govern.',
          ],
        },
        {
          id: 'demo',
          h: 'Demo data',
          p: [
            'The messages, customer names, SKUs, prices and screens shown on the site are demo data for illustration only. Any resemblance to a real business, person or price is coincidental.',
          ],
        },
        {
          id: 'ip',
          h: 'Intellectual property',
          p: [
            'All rights in the site and its content, including text, design, illustrations, animations, code, the name “Tazmin” and the logo, belong to us or our licensors. You may not copy, distribute, modify or make commercial use of the content without prior written permission.',
          ],
        },
        {
          id: 'trademarks',
          h: 'Third-party trademarks',
          p: [
            'Names such as WhatsApp, Priority, SAP Business One, Hashavshevet, Rivhit and Google Sheets are trademarks of their respective owners. They are mentioned for descriptive purposes only and do not imply a partnership, sponsorship or endorsement by those companies.',
          ],
        },
        {
          id: 'use',
          h: 'Acceptable use',
          p: ['You agree not to:'],
          list: [
            'Use the site for any unlawful purpose.',
            'Interfere with the site, attempt to break into it or bypass security measures.',
            'Collect information from the site by automated means in a way that burdens it.',
            'Submit false information, or information about another person without their permission.',
          ],
        },
        {
          id: 'links',
          h: 'Links',
          p: ['The site may link to third-party websites. We are not responsible for their content or privacy practices.'],
        },
        {
          id: 'liability',
          h: 'Liability',
          p: [
            'The site and its information are provided “as is”. We try to keep the information accurate and current, but it may contain errors or inaccuracies.',
            'To the maximum extent permitted by law, we are not liable for any direct or indirect damage arising from use of the site or reliance on its information.',
          ],
        },
        {
          id: 'privacy',
          h: 'Privacy',
          p: ['Personal information is handled according to our privacy policy, which forms part of these terms.'],
        },
        {
          id: 'changes',
          h: 'Changes',
          p: ['We may update the site and these terms from time to time. The binding version is the one published on the site at the time of use.'],
        },
        {
          id: 'law',
          h: 'Governing law and jurisdiction',
          p: [
            'These terms are governed solely by the laws of the State of Israel. Exclusive jurisdiction lies with the competent courts of the Tel Aviv-Jaffa district.',
          ],
        },
        {
          id: 'contact',
          h: 'Contact',
          list: ['{legalName}', 'Address: {address}', 'Email: {email}', 'Phone: {phone}'],
        },
      ],
    },
  },
};
