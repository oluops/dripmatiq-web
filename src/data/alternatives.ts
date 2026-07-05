export const competitors: Record<
  string,
  {
    name: string;
    title: string;
    description: string;
    h1: string;
    intro: string;
    strengths: string; // what the competitor does well — honest framing
    gap: string; // where Dripmatiq wins
    rows: { feature: string; dripmatiq: string; them: string }[];
    faqs: { q: string; a: string }[];
  }
> = {
  whering: {
    name: 'Whering',
    title: 'Whering Alternative With Virtual Try-On (2026) | Dripmatiq',
    description:
      'Looking for a Whering alternative? Dripmatiq does the digital wardrobe and AI styling — plus FitMatic virtual try-on that shows outfits on your body. Free download.',
    h1: 'The Whering alternative with actual try-on',
    intro:
      'Whering made digital wardrobes mainstream: snap your clothes, get outfit ideas, track cost per wear. Dripmatiq covers that ground — then renders every AI-styled outfit on your body with FitMatic virtual try-on.',
    strengths:
      'Whering is free, well-designed, and its dress-up mechanic and sustainability angle deserve the hype. If you only want cataloguing and flat outfit collages, it does the job.',
    gap: "Whering's outfits stay flat — garments arranged on a screen. You still have to imagine them on you. Dripmatiq closes that gap: FitMatic shows the outfit on your body before you get dressed, plus colour analysis matched to your skin tone.",
    rows: [
      { feature: 'Virtual try-on (on your body)', dripmatiq: '✓ FitMatic', them: '—' },
      { feature: 'AI outfit suggestions', dripmatiq: '✓', them: '✓' },
      { feature: 'Closet scanner + auto-tagging', dripmatiq: '✓', them: '✓' },
      { feature: 'Color & skin-tone analysis', dripmatiq: '✓', them: '—' },
      { feature: 'Outfit calendar + weather', dripmatiq: '✓', them: '✓' },
      { feature: 'iOS + Android', dripmatiq: '✓', them: '✓' },
    ],
    faqs: [
      {
        q: 'Is Dripmatiq a good Whering alternative?',
        a: 'Yes — Dripmatiq covers the digital wardrobe, AI outfit suggestions, and outfit calendar Whering is known for, and adds FitMatic virtual try-on that renders outfits on your actual body instead of a flat collage.',
      },
      {
        q: 'Is Dripmatiq free like Whering?',
        a: 'Yes. The free tier includes the closet scanner, 25 AI outfits per month, and FitMatic virtual try-on — no credit card required.',
      },
      {
        q: 'Can I switch from Whering to Dripmatiq?',
        a: 'There is no direct import, but the Dripmatiq closet scanner digitizes a wardrobe fast — photograph garments and it auto-tags color, category, and season.',
      },
    ],
  },
  acloset: {
    name: 'Acloset',
    title: 'Acloset Alternative With Virtual Try-On (2026) | Dripmatiq',
    description:
      'Looking for an Acloset alternative? Dripmatiq organizes your closet with AI — and shows every outfit on your body with virtual try-on. Free download for iOS and Android.',
    h1: 'The Acloset alternative that shows outfits on your body',
    intro:
      "Acloset is a capable AI closet organizer — auto background removal, weather-based outfit suggestions, wear statistics. Dripmatiq matches the organizing and goes further: every suggested outfit can be rendered on your body with FitMatic virtual try-on.",
    strengths:
      'Acloset does digital closet management well, with solid auto-tagging and a clean stats view of what you wear.',
    gap: "Acloset's outfit previews are flat-lay collages, and its styling doesn't account for your coloring. Dripmatiq adds on-body try-on plus color analysis matched to your palette and skin tone — the difference between organizing clothes and being styled.",
    rows: [
      { feature: 'Virtual try-on (on your body)', dripmatiq: '✓ FitMatic', them: '—' },
      { feature: 'AI outfit suggestions', dripmatiq: '✓', them: '✓' },
      { feature: 'Closet scanner + auto-tagging', dripmatiq: '✓', them: '✓' },
      { feature: 'Color & skin-tone analysis', dripmatiq: '✓', them: '—' },
      { feature: 'Outfit calendar + weather', dripmatiq: '✓', them: '✓' },
      { feature: 'iOS + Android', dripmatiq: '✓', them: '✓' },
    ],
    faqs: [
      {
        q: 'What is the best Acloset alternative?',
        a: 'Dripmatiq is the strongest Acloset alternative if you want more than cataloging: it adds FitMatic virtual try-on that shows AI-styled outfits on your body, plus color analysis matched to your skin tone.',
      },
      {
        q: 'Does Dripmatiq auto-tag clothes like Acloset?',
        a: 'Yes. Photograph garments and the closet scanner auto-tags color, category, and season — a full digital wardrobe in minutes.',
      },
      {
        q: 'Is Dripmatiq free?',
        a: 'The free tier includes the closet scanner, 25 AI outfits per month, and virtual try-on. Pro ($6.99/mo) unlocks unlimited garments and suggestions.',
      },
    ],
  },
  stylebook: {
    name: 'Stylebook',
    title: 'Stylebook Alternative for iOS & Android (2026) | Dripmatiq',
    description:
      'Looking for a Stylebook alternative? Dripmatiq runs on iOS and Android, auto-tags your closet, and styles you with AI plus virtual try-on. Free to download.',
    h1: 'The Stylebook alternative — on Android, without the manual work',
    intro:
      'Stylebook is the veteran outfit planner: deep, powerful, and loved by dedicated users. It is also iOS-only, paid up front, and almost entirely manual. Dripmatiq is what the same idea looks like with AI doing the heavy lifting.',
    strengths:
      'Stylebook offers serious depth for manual curators — packing lists, detailed stats, full control over every collage. If you enjoy the craft of manual wardrobe management on an iPhone, it remains excellent.',
    gap: 'Stylebook has no Android app, no AI styling, and every outfit is hand-assembled. Dripmatiq runs on both platforms, digitizes your wardrobe with auto-tagging, generates outfits with AI, and shows them on your body with FitMatic — free to start.',
    rows: [
      { feature: 'Virtual try-on (on your body)', dripmatiq: '✓ FitMatic', them: '—' },
      { feature: 'AI outfit suggestions', dripmatiq: '✓', them: '—' },
      { feature: 'Closet scanner + auto-tagging', dripmatiq: '✓', them: 'Manual' },
      { feature: 'Android app', dripmatiq: '✓', them: '—' },
      { feature: 'Free tier', dripmatiq: '✓', them: 'Paid only' },
      { feature: 'Outfit calendar', dripmatiq: '✓', them: '✓' },
    ],
    faqs: [
      {
        q: 'Is there a Stylebook alternative for Android?',
        a: 'Yes — Dripmatiq runs on iOS and Android with a free tier, auto-tags garments when you scan them, and generates outfits with AI instead of manual collaging.',
      },
      {
        q: 'Does Dripmatiq require manual outfit building like Stylebook?',
        a: 'No. The AI outfit engine builds looks from your digitized wardrobe automatically, filtered by occasion, formality, and color — and FitMatic shows each look on your body.',
      },
      {
        q: 'Is Dripmatiq free, unlike Stylebook?',
        a: 'Yes, Dripmatiq is free to download with 25 AI outfits per month and virtual try-on included. Stylebook is a paid app with no free version.',
      },
    ],
  },
  'style-dna': {
    name: 'Style DNA',
    title: 'Style DNA Alternative With a Real Wardrobe (2026) | Dripmatiq',
    description:
      'Looking for a Style DNA alternative? Dripmatiq pairs color analysis with a full digital wardrobe, AI outfit suggestions, and virtual try-on. Free download.',
    h1: 'The Style DNA alternative — color analysis you can act on',
    intro:
      "Style DNA nails one thing: AI color analysis that tells you which shades flatter you. But it stops at advice. Dripmatiq pairs skin-tone-aware color matching with your actual wardrobe — and shows the resulting outfits on your body.",
    strengths:
      'Style DNA popularized instant AI color-season analysis from a selfie, and its shopping recommendations follow your palette.',
    gap: "Knowing your colors is step one; wearing them from clothes you own is the point. Dripmatiq digitizes your wardrobe, applies your palette to AI outfit suggestions, and renders each look on your body with FitMatic virtual try-on.",
    rows: [
      { feature: 'Color & skin-tone analysis', dripmatiq: '✓', them: '✓' },
      { feature: 'Digital wardrobe of your clothes', dripmatiq: '✓', them: '—' },
      { feature: 'AI outfit suggestions from your closet', dripmatiq: '✓', them: '—' },
      { feature: 'Virtual try-on (on your body)', dripmatiq: '✓ FitMatic', them: '—' },
      { feature: 'Outfit calendar + weather', dripmatiq: '✓', them: '—' },
      { feature: 'iOS + Android', dripmatiq: '✓', them: '✓' },
    ],
    faqs: [
      {
        q: 'What is the best Style DNA alternative?',
        a: 'Dripmatiq — it includes skin-tone-aware color analysis like Style DNA, plus a full digital wardrobe, AI outfit suggestions from clothes you own, and FitMatic virtual try-on.',
      },
      {
        q: 'Does Dripmatiq do color analysis?',
        a: 'Yes. Colors are paired to your palette and skin tone preferences, and the Elite tier adds skin tone, trend, brand and mood filters.',
      },
      {
        q: 'Can Dripmatiq style clothes I already own?',
        a: 'That is the core of the app: scan your wardrobe once and the AI builds daily outfits from your own clothes, shown on your body before you get dressed.',
      },
    ],
  },
};
