// components/InputBox.jsx
import React, { useId, useState } from 'react'

// Comprehensive currency mapping - Major currencies with detailed info
const CURRENCY_INFO = {
    // Major Global Currencies
    'usd': { name: 'US Dollar', country: 'United States', symbol: '$', flag: '🇺🇸' },
    'eur': { name: 'Euro', country: 'European Union', symbol: '€', flag: '🇪🇺' },
    'gbp': { name: 'British Pound', country: 'United Kingdom', symbol: '£', flag: '🇬🇧' },
    'jpy': { name: 'Japanese Yen', country: 'Japan', symbol: '¥', flag: '🇯🇵' },
    'cny': { name: 'Chinese Yuan', country: 'China', symbol: '¥', flag: '🇨🇳' },
    
    // Asia Pacific
    'inr': { name: 'Indian Rupee', country: 'India', symbol: '₹', flag: '🇮🇳' },
    'krw': { name: 'South Korean Won', country: 'South Korea', symbol: '₩', flag: '🇰🇷' },
    'aud': { name: 'Australian Dollar', country: 'Australia', symbol: 'A$', flag: '🇦🇺' },
    'nzd': { name: 'New Zealand Dollar', country: 'New Zealand', symbol: 'NZ$', flag: '🇳🇿' },
    'sgd': { name: 'Singapore Dollar', country: 'Singapore', symbol: 'S$', flag: '🇸🇬' },
    'hkd': { name: 'Hong Kong Dollar', country: 'Hong Kong', symbol: 'HK$', flag: '🇭🇰' },
    'myr': { name: 'Malaysian Ringgit', country: 'Malaysia', symbol: 'RM', flag: '🇲🇾' },
    'thb': { name: 'Thai Baht', country: 'Thailand', symbol: '฿', flag: '🇹🇭' },
    'idr': { name: 'Indonesian Rupiah', country: 'Indonesia', symbol: 'Rp', flag: '🇮🇩' },
    'php': { name: 'Philippine Peso', country: 'Philippines', symbol: '₱', flag: '🇵🇭' },
    'vnd': { name: 'Vietnamese Dong', country: 'Vietnam', symbol: '₫', flag: '🇻🇳' },
    'twd': { name: 'Taiwan Dollar', country: 'Taiwan', symbol: 'NT$', flag: '🇹🇼' },
    'pkr': { name: 'Pakistani Rupee', country: 'Pakistan', symbol: '₨', flag: '🇵🇰' },
    'bdt': { name: 'Bangladeshi Taka', country: 'Bangladesh', symbol: '৳', flag: '🇧🇩' },
    'lkr': { name: 'Sri Lankan Rupee', country: 'Sri Lanka', symbol: '₨', flag: '🇱🇰' },
    'npr': { name: 'Nepalese Rupee', country: 'Nepal', symbol: '₨', flag: '🇳🇵' },
    'mmk': { name: 'Myanmar Kyat', country: 'Myanmar', symbol: 'K', flag: '🇲🇲' },
    'khr': { name: 'Cambodian Riel', country: 'Cambodia', symbol: '៛', flag: '🇰🇭' },
    'lak': { name: 'Lao Kip', country: 'Laos', symbol: '₭', flag: '🇱🇦' },
    'mop': { name: 'Macanese Pataca', country: 'Macau', symbol: 'MOP$', flag: '🇲🇴' },
    'bnd': { name: 'Brunei Dollar', country: 'Brunei', symbol: 'B$', flag: '🇧🇳' },
    
    // North America
    'cad': { name: 'Canadian Dollar', country: 'Canada', symbol: 'C$', flag: '🇨🇦' },
    'mxn': { name: 'Mexican Peso', country: 'Mexico', symbol: '$', flag: '🇲🇽' },
    'gtq': { name: 'Guatemalan Quetzal', country: 'Guatemala', symbol: 'Q', flag: '🇬🇹' },
    'bze': { name: 'Belize Dollar', country: 'Belize', symbol: 'BZ$', flag: '🇧🇿' },
    'hnl': { name: 'Honduran Lempira', country: 'Honduras', symbol: 'L', flag: '🇭🇳' },
    'nic': { name: 'Nicaraguan Córdoba', country: 'Nicaragua', symbol: 'C$', flag: '🇳🇮' },
    'crc': { name: 'Costa Rican Colón', country: 'Costa Rica', symbol: '₡', flag: '🇨🇷' },
    'pab': { name: 'Panamanian Balboa', country: 'Panama', symbol: 'B/.', flag: '🇵🇦' },
    
    // South America
    'brl': { name: 'Brazilian Real', country: 'Brazil', symbol: 'R$', flag: '🇧🇷' },
    'ars': { name: 'Argentine Peso', country: 'Argentina', symbol: '$', flag: '🇦🇷' },
    'cop': { name: 'Colombian Peso', country: 'Colombia', symbol: '$', flag: '🇨🇴' },
    'clp': { name: 'Chilean Peso', country: 'Chile', symbol: '$', flag: '🇨🇱' },
    'pen': { name: 'Peruvian Sol', country: 'Peru', symbol: 'S/', flag: '🇵🇪' },
    'uyu': { name: 'Uruguayan Peso', country: 'Uruguay', symbol: '$U', flag: '🇺🇾' },
    'pyg': { name: 'Paraguayan Guarani', country: 'Paraguay', symbol: '₲', flag: '🇵🇾' },
    'bob': { name: 'Bolivian Boliviano', country: 'Bolivia', symbol: 'Bs', flag: '🇧🇴' },
    'ves': { name: 'Venezuelan Bolívar', country: 'Venezuela', symbol: 'Bs.S', flag: '🇻🇪' },
    'gyd': { name: 'Guyanese Dollar', country: 'Guyana', symbol: '$', flag: '🇬🇾' },
    'srd': { name: 'Surinamese Dollar', country: 'Suriname', symbol: '$', flag: '🇸🇷' },
    
    // Europe
    'chf': { name: 'Swiss Franc', country: 'Switzerland', symbol: 'Fr', flag: '🇨🇭' },
    'sek': { name: 'Swedish Krona', country: 'Sweden', symbol: 'kr', flag: '🇸🇪' },
    'nok': { name: 'Norwegian Krone', country: 'Norway', symbol: 'kr', flag: '🇳🇴' },
    'dkk': { name: 'Danish Krone', country: 'Denmark', symbol: 'kr', flag: '🇩🇰' },
    'pln': { name: 'Polish Złoty', country: 'Poland', symbol: 'zł', flag: '🇵🇱' },
    'czk': { name: 'Czech Koruna', country: 'Czech Republic', symbol: 'Kč', flag: '🇨🇿' },
    'huf': { name: 'Hungarian Forint', country: 'Hungary', symbol: 'Ft', flag: '🇭🇺' },
    'ron': { name: 'Romanian Leu', country: 'Romania', symbol: 'lei', flag: '🇷🇴' },
    'bgn': { name: 'Bulgarian Lev', country: 'Bulgaria', symbol: 'лв', flag: '🇧🇬' },
    'hrk': { name: 'Croatian Kuna', country: 'Croatia', symbol: 'kn', flag: '🇭🇷' },
    'rsd': { name: 'Serbian Dinar', country: 'Serbia', symbol: 'дин', flag: '🇷🇸' },
    'isk': { name: 'Icelandic Króna', country: 'Iceland', symbol: 'kr', flag: '🇮🇸' },
    'rub': { name: 'Russian Ruble', country: 'Russia', symbol: '₽', flag: '🇷🇺' },
    'try': { name: 'Turkish Lira', country: 'Turkey', symbol: '₺', flag: '🇹🇷' },
    'uah': { name: 'Ukrainian Hryvnia', country: 'Ukraine', symbol: '₴', flag: '🇺🇦' },
    'byn': { name: 'Belarusian Ruble', country: 'Belarus', symbol: 'Br', flag: '🇧🇾' },
    'mdl': { name: 'Moldovan Leu', country: 'Moldova', symbol: 'MDL', flag: '🇲🇩' },
    'gel': { name: 'Georgian Lari', country: 'Georgia', symbol: '₾', flag: '🇬🇪' },
    'azn': { name: 'Azerbaijani Manat', country: 'Azerbaijan', symbol: '₼', flag: '🇦🇿' },
    'amd': { name: 'Armenian Dram', country: 'Armenia', symbol: '֏', flag: '🇦🇲' },
    
    // Middle East
    'aed': { name: 'UAE Dirham', country: 'UAE', symbol: 'د.إ', flag: '🇦🇪' },
    'sar': { name: 'Saudi Riyal', country: 'Saudi Arabia', symbol: '﷼', flag: '🇸🇦' },
    'qar': { name: 'Qatari Riyal', country: 'Qatar', symbol: '﷼', flag: '🇶🇦' },
    'kwd': { name: 'Kuwaiti Dinar', country: 'Kuwait', symbol: 'د.ك', flag: '🇰🇼' },
    'bhd': { name: 'Bahraini Dinar', country: 'Bahrain', symbol: '.د.ب', flag: '🇧🇭' },
    'omr': { name: 'Omani Rial', country: 'Oman', symbol: '﷼', flag: '🇴🇲' },
    'jod': { name: 'Jordanian Dinar', country: 'Jordan', symbol: 'د.ا', flag: '🇯🇴' },
    'ils': { name: 'Israeli Shekel', country: 'Israel', symbol: '₪', flag: '🇮🇱' },
    'lbp': { name: 'Lebanese Pound', country: 'Lebanon', symbol: '£', flag: '🇱🇧' },
    'syp': { name: 'Syrian Pound', country: 'Syria', symbol: '£', flag: '🇸🇾' },
    'iqd': { name: 'Iraqi Dinar', country: 'Iraq', symbol: 'ع.د', flag: '🇮🇶' },
    'irr': { name: 'Iranian Rial', country: 'Iran', symbol: '﷼', flag: '🇮🇷' },
    'afn': { name: 'Afghan Afghani', country: 'Afghanistan', symbol: '؋', flag: '🇦🇫' },
    
    // Africa
    'zar': { name: 'South African Rand', country: 'South Africa', symbol: 'R', flag: '🇿🇦' },
    'ngn': { name: 'Nigerian Naira', country: 'Nigeria', symbol: '₦', flag: '🇳🇬' },
    'egp': { name: 'Egyptian Pound', country: 'Egypt', symbol: '£', flag: '🇪🇬' },
    'mad': { name: 'Moroccan Dirham', country: 'Morocco', symbol: 'د.م.', flag: '🇲🇦' },
    'dzd': { name: 'Algerian Dinar', country: 'Algeria', symbol: 'د.ج', flag: '🇩🇿' },
    'tnd': { name: 'Tunisian Dinar', country: 'Tunisia', symbol: 'د.ت', flag: '🇹🇳' },
    'lyd': { name: 'Libyan Dinar', country: 'Libya', symbol: 'ل.د', flag: '🇱🇾' },
    'etb': { name: 'Ethiopian Birr', country: 'Ethiopia', symbol: 'Br', flag: '🇪🇹' },
    'kes': { name: 'Kenyan Shilling', country: 'Kenya', symbol: 'KSh', flag: '🇰🇪' },
    'ugx': { name: 'Ugandan Shilling', country: 'Uganda', symbol: 'USh', flag: '🇺🇬' },
    'tzs': { name: 'Tanzanian Shilling', country: 'Tanzania', symbol: 'TSh', flag: '🇹🇿' },
    'ghs': { name: 'Ghanaian Cedi', country: 'Ghana', symbol: '₵', flag: '🇬🇭' },
    'zmw': { name: 'Zambian Kwacha', country: 'Zambia', symbol: 'ZK', flag: '🇿🇲' },
    'bwp': { name: 'Botswana Pula', country: 'Botswana', symbol: 'P', flag: '🇧🇼' },
    'mzn': { name: 'Mozambican Metical', country: 'Mozambique', symbol: 'MT', flag: '🇲🇿' },
    'aoa': { name: 'Angolan Kwanza', country: 'Angola', symbol: 'Kz', flag: '🇦🇴' },
    'xof': { name: 'West African CFA Franc', country: 'West Africa', symbol: 'CFA', flag: '🌍' },
    'xaf': { name: 'Central African CFA Franc', country: 'Central Africa', symbol: 'FCFA', flag: '🌍' },
};

// Function to get country name from currency code (fallback method)
const getCountryFromCurrency = (currencyCode) => {
    const code = currencyCode.toLowerCase();
    
    // Country mappings for currencies not in main list
    const countryMappings = {
        'all': 'Albania', 'and': 'Andorra', 'ang': 'Netherlands Antilles',
        'awk': 'Aruba', 'bam': 'Bosnia and Herzegovina', 'bbd': 'Barbados',
        'bzd': 'Belize', 'bmd': 'Bermuda', 'btn': 'Bhutan', 'xbt': 'Bitcoin',
        'bat': 'Croatia', 'kyd': 'Cayman Islands', 'cuc': 'Cuba', 'cup': 'Cuba',
        'djf': 'Djibouti', 'xcd': 'East Caribbean', 'svc': 'El Salvador',
        'ern': 'Eritrea', 'fkp': 'Falkland Islands', 'fjd': 'Fiji',
        'gmd': 'Gambia', 'ggp': 'Guernsey', 'gnf': 'Guinea', 'gwp': 'Guinea-Bissau',
        'htg': 'Haiti', 'imp': 'Isle of Man', 'jep': 'Jersey', 'kzt': 'Kazakhstan',
        'kgs': 'Kyrgyzstan', 'lsl': 'Lesotho', 'lrd': 'Liberia', 'mkd': 'Macedonia',
        'mga': 'Madagascar', 'mwk': 'Malawi', 'mvr': 'Maldives', 'mru': 'Mauritania',
        'mur': 'Mauritius', 'mnt': 'Mongolia', 'nad': 'Namibia', 'nio': 'Nicaragua',
        'pgk': 'Papua New Guinea', 'rwa': 'Rwanda', 'sbd': 'Solomon Islands',
        'scr': 'Seychelles', 'sll': 'Sierra Leone', 'sos': 'Somalia', 'ssp': 'South Sudan',
        'std': 'São Tomé and Príncipe', 'szl': 'Swaziland', 'tjs': 'Tajikistan',
        'top': 'Tonga', 'tmt': 'Turkmenistan', 'uzs': 'Uzbekistan', 'vuv': 'Vanuatu',
        'wst': 'Samoa', 'yer': 'Yemen', 'zwl': 'Zimbabwe'
    };
    
    return countryMappings[code] || 'Unknown Country';
};

function InputBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency = "usd",
    amountDisable = false,
    currencyDisable = false,
    className = "",
}) {
    const amountInputId = useId()
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Get currency display info with enhanced fallback
    const getCurrencyDisplay = (currencyCode) => {
        const code = currencyCode.toLowerCase();
        const info = CURRENCY_INFO[code];
        
        if (info) {
            return {
                flag: info.flag,
                code: currencyCode.toUpperCase(),
                name: info.name,
                country: info.country,
                symbol: info.symbol
            }
        }
        
        // Enhanced fallback for unknown currencies
        const country = getCountryFromCurrency(code);
        return {
            flag: '🌍',
            code: currencyCode.toUpperCase(),
            name: `${currencyCode.toUpperCase()} Currency`,
            country: country,
            symbol: currencyCode.toUpperCase()
        }
    }

    // Group currencies for better organization
    const groupCurrencies = (currencies) => {
        const major = ['usd', 'eur', 'gbp', 'jpy', 'cny', 'cad', 'aud', 'chf', 'inr', 'krw'];
        const majorCurrencies = currencies.filter(c => major.includes(c.toLowerCase()));
        const otherCurrencies = currencies.filter(c => !major.includes(c.toLowerCase()));
        
        return { major: majorCurrencies, others: otherCurrencies };
    }

    // Enhanced search function with multiple search terms and aliases
    const filteredCurrencies = currencyOptions.filter(currency => {
        if (!searchTerm.trim()) return true;
        
        const info = getCurrencyDisplay(currency)
        const search = searchTerm.toLowerCase().trim()
        
        // Create searchable text from all relevant fields including aliases
        const searchableTerms = [
            info.code.toLowerCase(),
            info.name.toLowerCase(),
            info.country.toLowerCase(),
            currency.toLowerCase(),
            // Add common aliases for popular currencies
            ...(info.code.toLowerCase() === 'jpy' ? ['japan', 'japanese', 'yen'] : []),
            ...(info.code.toLowerCase() === 'usd' ? ['america', 'american', 'dollar', 'usa', 'us', 'united states'] : []),
            ...(info.code.toLowerCase() === 'eur' ? ['europe', 'european', 'euro'] : []),
            ...(info.code.toLowerCase() === 'gbp' ? ['britain', 'british', 'england', 'uk', 'pound', 'sterling'] : []),
            ...(info.code.toLowerCase() === 'inr' ? ['india', 'indian', 'rupee'] : []),
            ...(info.code.toLowerCase() === 'cny' ? ['china', 'chinese', 'yuan', 'rmb'] : []),
            ...(info.code.toLowerCase() === 'cad' ? ['canada', 'canadian'] : []),
            ...(info.code.toLowerCase() === 'aud' ? ['australia', 'australian', 'aussie'] : []),
            ...(info.code.toLowerCase() === 'chf' ? ['switzerland', 'swiss', 'franc'] : []),
            ...(info.code.toLowerCase() === 'krw' ? ['korea', 'korean', 'south korea', 'won'] : [])
        ];
        
        // Check if search term matches any of the searchable terms
        return searchableTerms.some(term => term.includes(search))
    })

    const { major, others } = groupCurrencies(filteredCurrencies)
    const selectedCurrency = getCurrencyDisplay(selectCurrency)

    const handleCurrencySelect = (currency) => {
        onCurrencyChange && onCurrencyChange(currency)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className={`bg-gray-50 p-4 rounded-lg border ${className}`}>
            <div className="flex items-center justify-between">
                {/* Amount Section */}
                <div className="flex-1 mr-4">
                    <label htmlFor={amountInputId} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                    <div className="relative">
                        <input
                            id={amountInputId}
                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 pr-16"
                            type="number"
                            placeholder="0.00"
                            disabled={amountDisable}
                            value={amount || ''}
                            onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                            step="0.0001"
                            min="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-xs font-medium">{selectedCurrency.symbol}</span>
                        </div>
                    </div>
                </div>

                {/* Currency Section - Custom Dropdown */}
                <div className="flex-shrink-0 min-w-[220px] relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency ({currencyOptions.length} available)
                    </label>
                    
                    {/* Selected Currency Display */}
                    <button
                        type="button"
                        onClick={() => !currencyDisable && setIsOpen(!isOpen)}
                        disabled={currencyDisable}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-left flex items-center justify-between"
                    >
                        <div className="flex items-center min-w-0">
                            <span className="mr-2 flex-shrink-0">{selectedCurrency.flag}</span>
                            <span className="font-medium flex-shrink-0">{selectedCurrency.code}</span>
                            <span className="ml-2 text-gray-500 truncate">{selectedCurrency.name}</span>
                        </div>
                        <svg className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                            {/* Search Input */}
                            <div className="p-3 border-b bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="Search currencies or countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {filteredCurrencies.length} of {currencyOptions.length} currencies
                                </div>
                            </div>
                            
                            {/* Currency Options */}
                            <div className="max-h-64 overflow-y-auto">
                                {/* Major Currencies Section */}
                                {major.length > 0 && !searchTerm && (
                                    <div>
                                        <div className="px-3 py-2 bg-blue-50 text-xs font-medium text-blue-800 border-b">
                                            Major Currencies
                                        </div>
                                        {major.map((currency) => {
                                            const currencyInfo = getCurrencyDisplay(currency)
                                            return (
                                                <button
                                                    key={currency}
                                                    onClick={() => handleCurrencySelect(currency)}
                                                    className="w-full px-3 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center"
                                                >
                                                    <span className="mr-3 text-lg flex-shrink-0">{currencyInfo.flag}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">{currencyInfo.code}</span>
                                                            <span className="ml-2 text-gray-600 text-sm">{currencyInfo.symbol}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">{currencyInfo.name} • {currencyInfo.country}</div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* All Other Currencies */}
                                {others.length > 0 && (
                                    <div>
                                        {!searchTerm && major.length > 0 && (
                                            <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-700 border-b">
                                                All Currencies ({others.length})
                                            </div>
                                        )}
                                        {(searchTerm ? filteredCurrencies : others).map((currency) => {
                                            const currencyInfo = getCurrencyDisplay(currency)
                                            return (
                                                <button
                                                    key={currency}
                                                    onClick={() => handleCurrencySelect(currency)}
                                                    className="w-full px-3 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center"
                                                >
                                                    <span className="mr-3 text-lg flex-shrink-0">{currencyInfo.flag}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">{currencyInfo.code}</span>
                                                            <span className="ml-2 text-gray-600 text-sm">{currencyInfo.symbol}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">{currencyInfo.name} • {currencyInfo.country}</div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                                
                                {filteredCurrencies.length === 0 && (
                                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                        No currencies found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Selected Currency Info */}
                    <div className="mt-1 text-xs text-gray-500 truncate">
                        {selectedCurrency.country}
                    </div>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

export default InputBox;
