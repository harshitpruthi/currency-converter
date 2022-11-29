import axios from 'axios';

export function getConvertedCurrencyData(fromCurrency, toCurrency, amount ) {
    const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;

    return axios.get(url);
}


export function getLatestCurrencyData(base, symbol ) {
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}`;

    return axios.get(url);
}


export function getTimeSeriesData(startDate, endDate, baseCurrency ) {
    const url = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${baseCurrency}`;

    return axios.get(url);
}