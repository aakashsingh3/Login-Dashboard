// hooks/useCurrencyInfo.js
import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!currency) return;
        
        setLoading(true)
        setError(null)
        
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024.12.19/v1/currencies/${currency}.json`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch currency data')
                }
                return res.json()
            })
            .then((res) => {
                setData(res[currency] || {})
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
                console.error('Currency API Error:', err)
            })
    }, [currency])

    return { data, loading, error }
}

export default useCurrencyInfo;
