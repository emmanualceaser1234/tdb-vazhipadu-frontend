import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    translation: {
      // ── Header & Common
      appName: 'Vazhipadu',
      appSubtitle: 'Temple Offerings Booking',
      skipToContent: 'Skip to main content',
      devoteeBooking: 'Devotee Booking',
      staffOrders: 'Staff Orders',
      cart: 'Cart',
      language: 'Language',
      english: 'English',
      malayalam: 'മലയാളം',

      // ── Hero & Temples
      liveBookingBadge: 'Live Booking Available',
      heroTitle: 'Book Temple Offerings',
      heroSubtitle:
        'Select a temple, choose your vazhipadu, and complete your sacred booking in minutes.',
      selectTemple: 'Select Temple',
      chooseTemplePlaceholder: '— Choose a temple —',
      templesAvailable: '{{count}} temple available',
      templesAvailable_plural: '{{count}} temples available',
      loadingTemples: 'Loading temples…',

      // ── Offerings List
      searchOfferingsPlaceholder: 'Search offerings by name…',
      allCategories: 'All Categories',
      activeOfferings: 'Active',
      inactiveOfferings: 'Inactive',
      unavailable: 'Temporarily Unavailable',
      add: 'Add',
      added: 'Added',
      retry: 'Retry',
      price: 'Price',
      loadingOfferings: 'Loading offerings…',
      failedToLoadOfferings: 'Failed to load offerings',
      noOfferingsFound: 'No offerings match your search.',
      noOfferingsHint: 'Try searching for something else or selecting a different category filter.',

      // ── Cart Drawer
      yourCart: 'Your Cart',
      cartItemCount: '{{count}} item in your sacred booking',
      cartItemCount_plural: '{{count}} items in your sacred booking',
      emptyCartTitle: 'Your cart is empty',
      emptyCartSubtitle: 'Select temple offerings from the list to begin your sacred booking.',
      clearCart: 'Clear Cart',
      subtotal: 'Offerings Subtotal',
      deliveryFee: 'Postal Prasadam Delivery',
      grandTotal: 'Total Payable Amount',
      freeDeliveryNotice: 'Postal delivery optional (+₹50 delivery charge)',

      // ── Devotee Form
      devoteeDetails: 'Devotee Booking Details',
      devoteeName: 'Devotee Full Name',
      devoteeNamePlaceholder: 'Enter full name for sankalpam',
      nakshatra: 'Birth Star (Nakshatra)',
      selectNakshatra: 'Select your birth star',
      vazhipaduDate: 'Offering Date',
      mobileNumber: '10-Digit Mobile Number',
      mobilePlaceholder: '9876543210',
      postalDeliveryPrompt: 'Receive Consecrated Prasadam via Postal Speed Delivery (+₹50)',
      postalAddress: 'Full Postal Address with PIN Code',
      postalAddressPlaceholder: 'House name, Street, City, District, PIN code',
      placeOrder: 'Place Order & Pay',
      processingOrder: 'Processing Booking…',
      requiredError: 'This field is required',

      // ── Confirmation Card
      bookingConfirmed: 'Vazhipadu Booking Confirmed!',
      officialReceipt: 'Official Travancore Devaswom Board Booking Receipt',
      orderNumber: 'Order Number',
      status: 'Status',
      bookingDate: 'Booking Date',
      vazhipaduDateLabel: 'Vazhipadu Date',
      devotee: 'Devotee',
      star: 'Birth Star',
      phone: 'Mobile',
      itemsBooked: 'Items Booked',
      bookAnother: 'Book Another Offering',
      printReceipt: 'Print Receipt',

      // ── Staff Portal & Login
      staffLoginTitle: 'Temple Staff Portal Login',
      staffLoginSubtitle: 'Authorized Devaswom Board Officers and Central Administrators only',
      staffEmail: 'Staff Official Email',
      password: 'Password',
      signInStaff: 'Sign In to Staff Portal',
      signingIn: 'Authenticating…',
      quickFillAccounts: 'Quick-Fill Demo Accounts',
      signOut: 'Sign Out',
      centralAdmin: 'Central Admin',
      templeOfficer: 'Temple Officer',

      // ── Staff Offerings Manager
      manageOfferingsTitle: 'Temple Offerings Catalog & Availability',
      manageOfferingsSubtitle:
        'Review current vazhipadu listings, update pricing or descriptions, and toggle booking availability.',
      bookedOrdersTab: 'Booked Orders',
      manageOfferingsTab: 'Manage Offerings',
      editOffering: 'Edit Offering',
      modify: 'Modify',
      offeringName: 'Offering Name',
      category: 'Category',
      description: 'Description',
      saveChanges: 'Save Changes',
      saving: 'Saving…',
      cancel: 'Cancel',
      allTemplesFilter: 'All Temples (Central View)',
      filterByTemple: 'Filter by Temple',
      searchOfferingPlaceholder: 'Search offerings by name or category…',

      // ── Nakshatras (27 Stars)
      nakshatra_Ashwati: 'Ashwati',
      nakshatra_Bharani: 'Bharani',
      nakshatra_Karthika: 'Karthika',
      nakshatra_Rohini: 'Rohini',
      nakshatra_Makayiram: 'Makayiram',
      nakshatra_Thiruvathira: 'Thiruvathira',
      nakshatra_Punartham: 'Punartham',
      nakshatra_Pooyam: 'Pooyam',
      nakshatra_Aayilyam: 'Aayilyam',
      nakshatra_Makam: 'Makam',
      nakshatra_Pooram: 'Pooram',
      nakshatra_Uthram: 'Uthram',
      nakshatra_Atham: 'Atham',
      nakshatra_Chithira: 'Chithira',
      nakshatra_Chothi: 'Chothi',
      nakshatra_Vishakham: 'Vishakham',
      nakshatra_Anizham: 'Anizham',
      nakshatra_Thrikketta: 'Thrikketta',
      nakshatra_Moolam: 'Moolam',
      nakshatra_Pooradam: 'Pooradam',
      nakshatra_Uthradam: 'Uthradam',
      nakshatra_Thiruvonam: 'Thiruvonam',
      nakshatra_Avittom: 'Avittom',
      nakshatra_Chathayam: 'Chathayam',
      nakshatra_Poororuttathi: 'Poororuttathi',
      nakshatra_Uthrattathi: 'Uthrattathi',
      nakshatra_Revathi: 'Revathi',
    },
  },

  ml: {
    translation: {
      // ── Header & Common
      appName: 'വഴിപാട്',
      appSubtitle: 'ക്ഷേത്ര വഴിപാടുകൾ ബുക്ക് ചെയ്യാം',
      skipToContent: 'പ്രധാന ഉള്ളടക്കത്തിലേക്ക് പോകുക',
      devoteeBooking: 'ഭക്തജന ബുക്കിംഗ്',
      staffOrders: 'ജീവനക്കാരുടെ പോർട്ടൽ',
      cart: 'വഴിപാട് കൊട്ട',
      language: 'ഭാഷ',
      english: 'English',
      malayalam: 'മലയാളം',

      // ── Hero & Temples
      liveBookingBadge: 'ഓൺലൈൻ ബുക്കിംഗ് ലഭ്യമാണ്',
      heroTitle: 'ക്ഷേത്ര വഴിപാടുകൾ ബുക്ക് ചെയ്യാം',
      heroSubtitle:
        'പ്രസിദ്ധമായ തിരുവിതാംകൂർ ക്ഷേത്രങ്ങളിലെ വിശുദ്ധ വഴിപാടുകൾ ഓൺലൈനായി എളുപ്പത്തിൽ സമർപ്പിക്കൂ.',
      selectTemple: 'ക്ഷേത്രം തിരഞ്ഞെടുക്കുക',
      chooseTemplePlaceholder: '— ഒരു ക്ഷേത്രം തിരഞ്ഞെടുക്കുക —',
      templesAvailable: '{{count}} ക്ഷേത്രം ലഭ്യമാണ്',
      templesAvailable_plural: '{{count}} ക്ഷേത്രങ്ങൾ ലഭ്യമാണ്',
      loadingTemples: 'ക്ഷേത്ര വിവരങ്ങൾ ലഭ്യമാക്കുന്നു…',

      // ── Offerings List
      searchOfferingsPlaceholder: 'വഴിപാടുകൾ പേര് വഴി തിരയുക…',
      allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
      activeOfferings: 'ലഭ്യമാണ്',
      inactiveOfferings: 'ലഭ്യമല്ല',
      unavailable: 'ഇപ്പോൾ ലഭ്യമല്ല',
      add: 'ചേർക്കുക',
      added: 'ചേർത്തു',
      retry: 'വീണ്ടും ശ്രമിക്കുക',
      price: 'നിരക്ക്',
      loadingOfferings: 'വഴിപാടുകൾ ലഭ്യമാക്കുന്നു…',
      failedToLoadOfferings: 'വഴിപാടുകൾ ലഭ്യമാക്കുന്നതിൽ തടസ്സം നേരിട്ടു',
      noOfferingsFound: 'വഴിപാടുകൾ ഒന്നും കണ്ടെത്താനായില്ല.',
      noOfferingsHint: 'മറ്റൊരു പേരോ വിഭാഗമോ തിരഞ്ഞെടുത്ത് വീണ്ടും തിരയുക.',

      // ── Cart Drawer
      yourCart: 'നിങ്ങളുടെ വഴിപാട് കൊട്ട',
      cartItemCount: '{{count}} വഴിപാട് തിരഞ്ഞെടുത്തു',
      cartItemCount_plural: '{{count}} വഴിപാടുകൾ തിരഞ്ഞെടുത്തു',
      emptyCartTitle: 'കൊട്ട ശൂന്യമാണ്',
      emptyCartSubtitle: 'വഴിപാടുകൾ തിരഞ്ഞെടുത്ത് ബുക്കിംഗ് ആരംഭിക്കൂ.',
      clearCart: 'കൊട്ട ശൂന്യമാക്കുക',
      subtotal: 'വഴിപാട് തുക',
      deliveryFee: 'പോസ്റ്റൽ പ്രസാദം തപാൽ ചാർജ്',
      grandTotal: 'ആകെ അടയ്ക്കേണ്ട തുക',
      freeDeliveryNotice: 'പ്രസാദം തപാലിൽ ലഭിക്കാൻ (+₹50 തപാൽ ചാർജ്)',

      // ── Devotee Form
      devoteeDetails: 'ഭക്തന്റെ വിവരങ്ങൾ',
      devoteeName: 'ഭക്തന്റെ പൂർണ്ണ പേര്',
      devoteeNamePlaceholder: 'സങ്കൽപ്പത്തിന് ഭക്തന്റെ പേര് നൽകുക',
      nakshatra: 'ജന്മനക്ഷത്രം',
      selectNakshatra: 'നക്ഷത്രം തിരഞ്ഞെടുക്കുക',
      vazhipaduDate: 'വഴിപാട് നടത്തേണ്ട തീയതി',
      mobileNumber: '10 അക്ക മൊബൈൽ നമ്പർ',
      mobilePlaceholder: '9876543210',
      postalDeliveryPrompt: 'വിശുദ്ധ പ്രസാദം തപാലിൽ (സ്പീഡ് പോസ്റ്റ്) ആവശ്യമുണ്ടോ? (+₹50)',
      postalAddress: 'പൂർണ്ണ മേൽവിലാസവും പിൻകോഡും',
      postalAddressPlaceholder: 'വീട്ടുപേര്, റോഡ്, സ്ഥലം, ജില്ല, പിൻകോഡ്',
      placeOrder: 'ഓർഡർ സമർപ്പിച്ച് പണമടയ്ക്കുക',
      processingOrder: 'ബുക്കിംഗ് സമർപ്പിക്കുന്നു…',
      requiredError: 'ഈ വിവരം നിർബന്ധമാണ്',

      // ── Confirmation Card
      bookingConfirmed: 'വഴിപാട് ബുക്കിംഗ് വിജയകരമായി പൂർത്തിയായി!',
      officialReceipt: 'തിരുവിതാംകൂർ ദേവസ്വം ബോർഡ് ഔദ്യോഗിക ബുക്കിംഗ് രസീത്',
      orderNumber: 'ഓർഡർ നമ്പർ',
      status: 'നിലവിലെ അവസ്ഥ',
      bookingDate: 'ബുക്ക് ചെയ്ത തീയതി',
      vazhipaduDateLabel: 'വഴിപാട് തീയതി',
      devotee: 'ഭക്തൻ',
      star: 'ജന്മനക്ഷത്രം',
      phone: 'മൊബൈൽ',
      itemsBooked: 'ബുക്ക് ചെയ്ത വഴിപാടുകൾ',
      bookAnother: 'മറ്റൊരു വഴിപാട് ബുക്ക് ചെയ്യുക',
      printReceipt: 'രസീത് പ്രിന്റ് ചെയ്യുക',

      // ── Staff Portal & Login
      staffLoginTitle: 'ക്ഷേത്ര ജീവനക്കാരുടെ ലോഗിൻ',
      staffLoginSubtitle: 'അംഗീകൃത ദേവസ്വം ബോർഡ് ജീവനക്കാർക്കും അഡ്മിനിസ്ട്രേറ്റർമാർക്കും മാത്രം',
      staffEmail: 'ഔദ്യോഗിക ഇമെയിൽ വിലാസം',
      password: 'പാസ്‌വേഡ്',
      signInStaff: 'പോർട്ടലിലേക്ക് പ്രവേശിക്കുക',
      signingIn: 'പരിശോധിക്കുന്നു…',
      quickFillAccounts: 'ഡെമോ അക്കൗണ്ടുകൾ ഉപയോഗിക്കാം',
      signOut: 'പുറത്തിറങ്ങുക',
      centralAdmin: 'സെൻട്രൽ അഡ്മിൻ',
      templeOfficer: 'ക്ഷേത്ര ഓഫീസർ',

      // ── Staff Offerings Manager
      manageOfferingsTitle: 'ക്ഷേത്ര വഴിപാടുകളുടെ വിവരങ്ങളും ലഭ്യതയും',
      manageOfferingsSubtitle:
        'വഴിപാടുകളുടെ നിരക്കുകൾ, വിവരങ്ങൾ എന്നിവ പുതുക്കുകയോ ലഭ്യത മാറ്റുകയോ ചെയ്യാം.',
      bookedOrdersTab: 'ബുക്ക് ചെയ്ത ഓർഡറുകൾ',
      manageOfferingsTab: 'വഴിപാടുകൾ നിയന്ത്രിക്കുക',
      editOffering: 'വഴിപാടിൽ മാറ്റം വരുത്തുക',
      modify: 'മാറ്റം വരുത്തുക',
      offeringName: 'വഴിപാടിന്റെ പേര്',
      category: 'വിഭാഗം',
      description: 'വിവരണം',
      saveChanges: 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക',
      saving: 'സംരക്ഷിക്കുന്നു…',
      cancel: 'റദ്ദാക്കുക',
      allTemplesFilter: 'എല്ലാ ക്ഷേത്രങ്ങളും (കേന്ദ്ര കാഴ്ച)',
      filterByTemple: 'ക്ഷേത്രം തിരഞ്ഞെടുക്കുക',
      searchOfferingPlaceholder: 'വഴിപാടുകൾ പേര് വഴിയോ വിഭാഗം വഴിയോ തിരയുക…',

      // ── Nakshatras (27 Stars in Malayalam)
      nakshatra_Ashwati: 'അശ്വതി (Ashwati)',
      nakshatra_Bharani: 'ഭരണി (Bharani)',
      nakshatra_Karthika: 'കാർത്തിക (Karthika)',
      nakshatra_Rohini: 'രോഹിണി (Rohini)',
      nakshatra_Makayiram: 'മകയിരം (Makayiram)',
      nakshatra_Thiruvathira: 'തിരുവാതിര (Thiruvathira)',
      nakshatra_Punartham: 'പുണർതം (Punartham)',
      nakshatra_Pooyam: 'പൂയം (Pooyam)',
      nakshatra_Aayilyam: 'ആയില്യം (Aayilyam)',
      nakshatra_Makam: 'മകം (Makam)',
      nakshatra_Pooram: 'പൂരം (Pooram)',
      nakshatra_Uthram: 'ഉത്രം (Uthram)',
      nakshatra_Atham: 'അത്തം (Atham)',
      nakshatra_Chithira: 'ചിത്തിര (Chithira)',
      nakshatra_Chothi: 'ചോതി (Chothi)',
      nakshatra_Vishakham: 'വിശാഖം (Vishakham)',
      nakshatra_Anizham: 'അനിഴം (Anizham)',
      nakshatra_Thrikketta: 'തൃക്കേട്ട (Thrikketta)',
      nakshatra_Moolam: 'മൂലം (Moolam)',
      nakshatra_Pooradam: 'പൂരാടം (Pooradam)',
      nakshatra_Uthradam: 'ഉത്രാടം (Uthradam)',
      nakshatra_Thiruvonam: 'തിരുവോണം (Thiruvonam)',
      nakshatra_Avittom: 'അവിട്ടം (Avittom)',
      nakshatra_Chathayam: 'ചതയം (Chathayam)',
      nakshatra_Poororuttathi: 'പൂരുരുട്ടാതി (Poororuttathi)',
      nakshatra_Uthrattathi: 'ഉത്രട്ടാതി (Uthrattathi)',
      nakshatra_Revathi: 'രേവതി (Revathi)',
    },
  },
} as const;

export type SupportedLanguage = 'en' | 'ml';

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tdb_language');
    if (saved === 'en' || saved === 'ml') {
      return saved;
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already prevents XSS
  },
});

// Sync html lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

export function switchLanguage(lang: SupportedLanguage): void {
  void i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('tdb_language', lang);
    document.documentElement.lang = lang;
  }
}

export default i18n;
