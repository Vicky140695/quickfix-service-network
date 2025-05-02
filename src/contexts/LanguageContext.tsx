import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'english' | 'tamil' | 'telugu' | 'kannada' | 'malayalam' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

// Translations
const translations = {
  english: {
    'welcome': 'Welcome to QuickFix',
    'select_language': 'Select your language',
    'english': 'English',
    'tamil': 'Tamil',
    'telugu': 'Telugu',
    'kannada': 'Kannada',
    'malayalam': 'Malayalam',
    'hindi': 'Hindi',
    'continue': 'Continue',
    'back': 'Back',
    'select_role': 'I am a...',
    'customer': 'Customer',
    'worker': 'Worker',
    'customer_description': 'Find skilled professionals for your service needs',
    'worker_description': 'Offer your skills and services to customers',
    'phone_verification': 'Phone Verification',
    'enter_phone': 'Enter your phone number',
    'send_otp': 'Send OTP',
    'verify_otp': 'Verify OTP',
    'enter_otp': 'Enter the OTP sent to your phone',
    'do_it_later': 'Do it Later',
    'worker_registration': 'Worker Registration',
    'name': 'Name',
    'age': 'Age',
    'address': 'Address',
    'use_current_location': 'Use Current Location',
    'select_skills': 'Select your skills',
    'electrician': 'Electrician',
    'plumber': 'Plumber',
    'carpenter': 'Carpenter',
    'painter': 'Painter',
    'other': 'Other',
    'specify_other': 'Please specify',
    'terms_conditions': 'Terms and Conditions',
    'i_agree': 'I agree to the Terms and Conditions',
    'registration_fee': 'Registration Fee',
    'payment_info': 'To complete your registration, please pay a one-time service charge of',
    'pay_now': 'Pay ₹99 Now',
    'skip_for_now': 'Skip for Now',
    'dashboard': 'Dashboard',
    'book_service': 'Book a Service',
    'for_me': 'For Me',
    'for_someone_else': 'For Someone Else',
    'now': 'Now',
    'later': 'Later',
    'available': 'Available',
    'past_work': 'Past Work',
    'reviews': 'Reviews',
    'about_us': 'About Us',
    'nearby_jobs': 'Nearby Jobs',
    'job_description': 'Job Description',
    'location': 'Location',
    'accept': 'Accept',
    'decline': 'Decline',
    'work_in_progress': 'Work in Progress',
    'tracking': 'Tracking',
    'bill': 'Bill',
    'payment': 'Payment',
    'rate_review': 'Rate & Review',
    'submit': 'Submit',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'logout': 'Logout',
    'admin': 'Admin'
  },
  tamil: {
    'welcome': 'QuickFix-க்கு வரவேற்கிறோம்',
    'select_language': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    'english': 'ஆங்கிலம்',
    'tamil': 'தமிழ்',
    'telugu': 'தெலுங்கு',
    'kannada': 'கன்னடம்',
    'malayalam': 'மலையாளம்',
    'hindi': 'இந்தி',
    'continue': 'தொடரவும்',
    'back': 'பின்னால்',
    'select_role': 'நான் ஒரு...',
    'customer': 'வாடிக்கையாளர்',
    'worker': 'பணியாளர்',
    'customer_description': 'உங்கள் சேவை தேவைகளுக்கான திறமையான தொழில்முறை நிபுணர்களைக் கண்டறியுங்கள்',
    'worker_description': 'உங்கள் திறன்களையும் சேவைகளையும் வாடிக்கையாளர்களுக்கு வழங்குங்கள்',
    'phone_verification': 'தொலைபேசி சரிபார்ப்பு',
    'enter_phone': 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    'send_otp': 'OTP அனுப்பவும்',
    'verify_otp': 'OTP ஐ சரிபார்க்கவும்',
    'enter_otp': 'உங்கள் தொலைபேசிக்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்',
    'do_it_later': 'பிறகு செய்யவும்',
    'worker_registration': 'பணியாளர் பதிவு',
    'name': 'பெயர்',
    'age': 'வயது',
    'address': 'முகவரி',
    'use_current_location': 'தற்போதைய இருப்பிடத்தைப் பயன்படுத்தவும்',
    'select_skills': 'உங்கள் திறன்களைத் தேர்ந்தெடுக்கவும்',
    'electrician': 'மின்சாரி',
    'plumber': 'நீர்க்குழாய்',
    'carpenter': 'தச்சர்',
    'painter': 'ஓவியர்',
    'other': 'மற்றவை',
    'specify_other': 'தயவுசெய்து குறிப்பிடுங்கள்',
    'terms_conditions': 'விதிமுறைகளும் நிபந்தனைகளும்',
    'i_agree': 'விதிமுறைகளுக்கும் நிபந்தனைகளுக்கும் நான் ஒப்புக்கொள்கிறேன்',
    'registration_fee': 'பதிவு கட்டணம்',
    'payment_info': 'உங்கள் பதிவை முடிக்க, தயவுசெய்து ஒரு முறை சேவைக் கட்டணத்தைச் செலுத்தவும்',
    'pay_now': '₹99 ஐ இப்போது செலுத்துங்கள்',
    'skip_for_now': 'இப்போதைக்கு தவிர்க்கவும்',
    'dashboard': 'டாஷ்போர்டு',
    'book_service': 'சேவை புக் செய்க',
    'for_me': 'எனக்காக',
    'for_someone_else': 'வேறு யாருக்காகவோ',
    'now': 'இப்பொழுது',
    'later': 'பிறகு',
    'available': 'கிடைக்கும்',
    'past_work': 'கடந்த பணி',
    'reviews': 'விமர்சனங்கள்',
    'about_us': 'எங்களைப் பற்றி',
    'nearby_jobs': 'அருகிலுள்ள வேலைகள்',
    'job_description': 'வேலை விவரம்',
    'location': 'இடம்',
    'accept': 'ஏற்றுக்கொள்',
    'decline': 'மறு',
    'work_in_progress': 'பணி நடந்து கொண்டிருக்கிறது',
    'tracking': 'கண்காணிப்பு',
    'bill': 'பில்',
    'payment': 'கட்டணம்',
    'rate_review': 'மதிப்பீடு & விமர்சனம்',
    'submit': 'சமர்ப்பிக்கவும்',
    'confirm': 'உறுதிப்படுத்தவும்',
    'cancel': 'ரத்துசெய்',
    'logout': 'வெளியேறு',
    'admin': 'நிர்வாகி'
  },
  telugu: {
    'welcome': 'QuickFix కి స్వాగతం',
    'select_language': 'మీ భాషను ఎంచుకోండి',
    'english': 'ఆంగ్లం',
    'tamil': 'తమిళం',
    'telugu': 'తెలుగు',
    'kannada': 'కన్నడ',
    'malayalam': 'మలయాళం',
    'hindi': 'హిందీ',
    'continue': 'కొనసాగించు',
    'back': 'వెనుకకు',
    'select_role': 'నేను ఒక...',
    'customer': 'కస్టమర్',
    'worker': 'వర్కర్',
    'customer_description': 'మీ సేవా అవసరాలకు నైపుణ్యం ఉన్న నిపుణులను కనుగొనండి',
    'worker_description': 'మీ నైపుణ్యాలను మరియు సేవలను వినియోగదారులకు అందించండి',
    'phone_verification': 'ఫోన్ ధ్రువీకరణ',
    'enter_phone': 'మీ ఫోన్ నంబర్‌ని నమోదు చేయండి',
    'send_otp': 'OTP పంపండి',
    'verify_otp': 'OTP ధృవీకరించండి',
    'enter_otp': 'మీ ఫోన్‌కి పంపిన OTPని నమోదు చేయండి',
    'do_it_later': 'తర్వాత చేయండి'
  },
  kannada: {
    'welcome': 'QuickFix ಗೆ ಸುಸ್ವಾಗತ',
    'select_language': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'english': 'ಇಂಗ್ಲಿಷ್',
    'tamil': 'ತಮಿಳು',
    'telugu': 'తೆಲುಗು',
    'kannada': 'ಕನ್ನಡ',
    'malayalam': 'ಮಲಯಾಳಂ',
    'hindi': 'ಹಿಂದಿ',
    'continue': 'ಮುಂದುವರಿಸಿ',
    'back': 'ಹಿಂದೆ',
    'select_role': 'ನಾನು...',
    'customer': 'ಗ್ರಾಹಕ',
    'worker': 'ಕೆಲಸಗಾರ',
    'customer_description': 'ನಿಮ್ಮ ಸೇವೆಯ ಅಗತ್ಯಗಳಿಗಾಗಿ ನುರಿತ ವೃತ್ತಿಪರರನ್ನು ಹುಡುಕಿ',
    'phone_verification': 'ಫೋನ್ ಪರಿಶೀಲನೆ',
    'enter_phone': 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ'
  },
  malayalam: {
    'welcome': 'QuickFix ലേക്ക് സ്വാഗതം',
    'select_language': 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    'english': 'ഇംഗ്ലീഷ്',
    'tamil': 'തമിഴ്',
    'telugu': 'തെലുങ്ക്',
    'kannada': 'കന്നഡ',
    'malayalam': 'മലയാളം',
    'hindi': 'ഹിന്ദി',
    'continue': 'തുടരുക',
    'back': 'തിരികെ',
    'select_role': 'ഞാൻ ഒരു...',
    'customer': 'ഉപഭോക്താവ്',
    'worker': 'തൊഴിലാളി',
    'phone_verification': 'ഫോൺ പരിശോധന',
    'enter_phone': 'നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക'
  },
  hindi: {
    'welcome': 'QuickFix में आपका स्वागत है',
    'select_language': 'अपनी भाषा चुनें',
    'english': 'अंग्रेज़ी',
    'tamil': 'तमिल',
    'telugu': 'तेलुगू',
    'kannada': 'कन्नड़',
    'malayalam': 'मलयालम',
    'hindi': 'हिंदी',
    'continue': 'जारी रखें',
    'back': 'वापस',
    'select_role': 'मैं एक...',
    'customer': 'ग्राहक',
    'worker': 'कर्मचारी', 
    'customer_description': 'अपनी सेवा आवश्यकताओं के लिए कुशल पेशेवरों को खोजें',
    'worker_description': 'अपने कौशल और सेवाएं ग्राहकों को प्रदान करें',
    'phone_verification': 'फोन सत्यापन',
    'enter_phone': 'अपना फोन नंबर दर्ज करें'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('quickfix-language');
    return (savedLanguage as Language) || 'english';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('quickfix-language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
