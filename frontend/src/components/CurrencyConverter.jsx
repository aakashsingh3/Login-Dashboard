import { useState } from 'react'
import useCurrencyInfo from '../hooks/useCurrencyInfo'
import InputBox from './InputBox'

function CurrencyConverter() {
    const [amount, setAmount] = useState(1)
    const [from, setFrom] = useState("usd")
    const [to, setTo] = useState("inr")
    const [convertedAmount, setConvertedAmount] = useState(0)

    const { data: currencyInfo, loading, error } = useCurrencyInfo(from)

    const options = Object.keys(currencyInfo || {})

    const swap = () => {
        setFrom(to)
        setTo(from)
        setConvertedAmount(amount)
        setAmount(convertedAmount)
    }

    const convert = () => {
        if (currencyInfo && currencyInfo[to]) {
            setConvertedAmount((amount * currencyInfo[to]).toFixed(4))
        }
    }

    return (
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="px-6 py-6">
                {/* Header */}
                <div className="flex items-center mb-5">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Currency Converter</h3>
                        <p className="text-xs text-gray-500">Convert between different currencies in real-time</p>
                    </div>
                </div>

                {/* Loading/Error States */}
                {loading && (
                    <div className="flex items-center justify-center py-4">
                        <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm text-gray-600">Loading exchange rates...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">Failed to load exchange rates. Please try again.</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            convert();
                        }}
                        className="space-y-4"
                    >
                        {/* From Currency */}
                        <div>
                            <InputBox
                                label="From"
                                amount={amount}
                                currencyOptions={options}
                                onCurrencyChange={(currency) => setFrom(currency)}
                                selectCurrency={from}
                                onAmountChange={(amount) => setAmount(amount)}
                                className="border border-gray-200 shadow-sm"
                            />
                        </div>

                        {/* Swap Button */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={swap}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                            >
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Swap Currencies
                            </button>
                        </div>

                        {/* To Currency */}
                        <div>
                            <InputBox
                                label="To"
                                amount={convertedAmount}
                                currencyOptions={options}
                                onCurrencyChange={(currency) => setTo(currency)}
                                selectCurrency={to}
                                amountDisable
                                className="border border-gray-200 shadow-sm"
                            />
                        </div>

                        {/* Convert Button */}
                        <button 
                            type="submit" 
                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Convert {from.toUpperCase()} to {to.toUpperCase()}
                        </button>

                        {/* Exchange Rate Info */}
                        {convertedAmount > 0 && currencyInfo && currencyInfo[to] && (
                            <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-900 font-medium">Exchange Rate:</span>
                                    <span className="text-blue-800">
                                        1 {from.toUpperCase()} = {currencyInfo[to].toFixed(4)} {to.toUpperCase()}
                                    </span>
                                </div>
                                {amount > 0 && (
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-blue-900 font-medium">Result:</span>
                                        <span className="text-blue-800 font-semibold">
                                            {amount} {from.toUpperCase()} = {convertedAmount} {to.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    )
}

export default CurrencyConverter
