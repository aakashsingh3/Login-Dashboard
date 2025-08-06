import { useCallback, useEffect, useRef, useState } from 'react'

function PasswordGenerator() {
  const [length, setLength] = useState(12)
  const [specialCharAllowed, setSpecialCharAllowed] = useState(true)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const passwordReference = useRef(null)

  const passwordGenerator = useCallback(() => {
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let pass = ""

    if (specialCharAllowed) str += "!@#$%^&*()-_=+[]{}\\|;:'<>,.?/~`"
    if (numberAllowed) str += "0123456789"

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * str.length)
      pass += str.charAt(index)
    }

    setPassword(pass)
  }, [length, specialCharAllowed, numberAllowed])

  useEffect(() => {
    passwordGenerator()
  }, [passwordGenerator])

  const copyPassToClipboard = useCallback(() => {
    passwordReference.current?.select()
    passwordReference.current?.setSelectionRange(0, 99)
    window.navigator.clipboard.writeText(password)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  // Password strength calculator
  const getPasswordStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { level: 'Weak', color: 'text-red-600', bgColor: 'bg-red-50', barColor: 'bg-red-500' }
    if (score <= 4) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', barColor: 'bg-yellow-500' }
    return { level: 'Strong', color: 'text-green-600', bgColor: 'bg-green-50', barColor: 'bg-green-500' }
  }

  const strength = getPasswordStrength()
  const strengthPercentage = strength.level === 'Weak' ? 33 : strength.level === 'Medium' ? 66 : 100

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center mb-5">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Password Generator</h3>
            <p className="text-xs text-gray-500">Generate secure passwords for your accounts</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Password Output */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={password}
                readOnly
                ref={passwordReference}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Generated password will appear here"
              />
              <button
                onClick={copyPassToClipboard}
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Password Strength:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${strength.color} ${strength.bgColor}`}>
                  {strength.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${strength.barColor}`}
                  style={{ width: `${strengthPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Length Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="length-range" className="text-sm font-medium text-gray-700">
                  Password Length
                </label>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {length}
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={25}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                id="length-range"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>8</span>
                <span>25</span>
              </div>
            </div>

            {/* Options in a clean layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">123</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="numbers" className="text-sm font-medium text-gray-700">
                      Include Numbers
                    </label>
                    <p className="text-xs text-gray-500">0-9</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  onChange={() => setNumberAllowed((prev) => !prev)}
                  id="numbers"
                  checked={numberAllowed}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-purple-100 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-600">@#</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="special" className="text-sm font-medium text-gray-700">
                      Special Characters
                    </label>
                    <p className="text-xs text-gray-500">!@#$%^&*</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  onChange={() => setSpecialCharAllowed((prev) => !prev)}
                  id="special"
                  checked={specialCharAllowed}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </div>

            {/* Generate New Password Button */}
            <div className="pt-2">
              <button
                onClick={passwordGenerator}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generate New Password
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Security Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use at least 12 characters for better security</li>
                  <li>• Include numbers and special characters</li>
                  <li>• Don't reuse passwords across multiple accounts</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator;
