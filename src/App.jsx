import { useState, useEffect } from 'react'
import { ArrowDownUp, DollarSign, TrendingUp, Clock, Sparkles } from 'lucide-react'
import './App.css'

function App() {
  const [amount, setAmount] = useState('0')
  const [displayAmount, setDisplayAmount] = useState('0,00')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BRL')
  const [exchangeRate, setExchangeRate] = useState(0)
  const [result, setResult] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')

  const currencies = [
    { code: 'USD', name: 'Dólar Americano' },
    { code: 'BRL', name: 'Real Brasileiro' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Iene Japonês' },
    { code: 'CAD', name: 'Dólar Canadense' },
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'CHF', name: 'Franco Suíço' },
    { code: 'CNY', name: 'Yuan Chinês' },
    { code: 'ARS', name: 'Peso Argentino' },
    { code: 'MXN', name: 'Peso Mexicano' },
    { code: 'CLP', name: 'Peso Chileno' },
  ]

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      const newAmount = amount.slice(0, -1) || '0'
      setAmount(newAmount)
      formatDisplay(newAmount)
    } else if (key >= '0' && key <= '9') {
      const newAmount = amount === '0' ? key : amount + key
      setAmount(newAmount)
      formatDisplay(newAmount)
    }
  }

  const formatDisplay = (value) => {
    const numValue = parseInt(value) || 0
    const formatted = (numValue / 100).toFixed(2).replace('.', ',')
    setDisplayAmount(formatted)
  }

  const getNumericAmount = () => {
    return parseFloat(amount) / 100
  }

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        )
        const data = await response.json()
        const rate = data.rates[toCurrency]
        setExchangeRate(rate)
        const numAmount = getNumericAmount()
        setResult((numAmount * rate).toFixed(2))
        setLastUpdate(new Date().toLocaleString('pt-BR'))
      } catch (error) {
        console.error('Erro ao buscar taxa de câmbio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRate()
  }, [fromCurrency, toCurrency, amount])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (value, currencyCode) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    }).format(value)
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-icon">
            <Sparkles size={40} strokeWidth={2} />
          </div>
          <h1>Conversor de Moedas</h1>
          <p>Conversão em tempo real com as melhores taxas</p>
        </header>

        <div className="converter-card">
          <div className="input-group">
            <label>Valor</label>
            <input
              type="text"
              value={displayAmount}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  e.preventDefault()
                  handleKeyPress('backspace')
                } else if (e.key >= '0' && e.key <= '9') {
                  e.preventDefault()
                  handleKeyPress(e.key)
                }
              }}
              className="amount-input"
              placeholder="0,00"
              readOnly
              onClick={(e) => e.target.focus()}
            />
          </div>

          <div className="currency-section">
            <div className="currency-select-wrapper">
              <label>De</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="currency-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={swapCurrencies} className="swap-button" title="Trocar moedas">
              <ArrowDownUp size={20} />
            </button>

            <div className="currency-select-wrapper">
              <label>Para</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="currency-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="result-section">
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : (
              <>
                <div className="result">
                  <div className="result-label">Resultado</div>
                  <div className="result-value">
                    {formatCurrency(result, toCurrency)}
                  </div>
                </div>
                <div className="exchange-info">
                  <div className="exchange-rate">
                    <TrendingUp size={16} />
                    <span>1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}</span>
                  </div>
                  <div className="last-update">
                    <Clock size={14} />
                    <span>Atualizado em {lastUpdate}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Taxas de câmbio atualizadas em tempo real</p>
          <p className="disclaimer">
            Valores informativos. Consulte seu banco para taxas oficiais.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
