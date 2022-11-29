import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import isEmpty from 'lodash.isempty';

import { getConvertedCurrencyData, getLatestCurrencyData, getTimeSeriesData } from '../../utils/api';
import Header from '../../components/Header';
import ExchangeHistoryUI from './ExchangeHistoryUI';
import ConvertCurrencyUI from './ConvertCurrencyUI';

import './currencyConverterPage.css';

const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const fourteenDaysAgo = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const thirtyDaysAgo = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const currentDate = new Date().toISOString().slice(0, 10);

const CurrencyConverterPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [amount, setAmount] = useState(() => {
        if (!isEmpty(location?.state)) {
            return location?.state?.query?.amount
        } else {
            return false;
        }
    });

    const [fromCurrency, setFromCurrency] = useState(() => {
        if (!isEmpty(location?.state)) {
            return location?.state?.query?.from
        } else {
            return ''
        }
    });

    const [toCurrency, setToCurrency] = useState(() => {
        if (!isEmpty(location?.state)) {
            return location?.state?.query?.to
        } else {
            return ''
        }
    });

    const [convertedData, setConvertedData] = useState([]);
    const [latestCurrencyData, setLatestCurrencyData] = useState([]);
    const [timeSeriesData, setTimeSeriesData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [duration, setDuration] = useState(7);
    const [dummyState, setDummyState] = useState(false);
    const [statsObj, setStatsObj] = useState([]);
    const [view, setView] = useState('table')

    const handleDurationChange = (e) => {
        setDuration(e.target.value);
    }

    const onAmountInput = (e) => {
        setError('')
        setAmount(e.target.value)
    }

    const onBaseCurrencyInput = (e) => {
        setError('')
        setFromCurrency((e.target.value).toUpperCase())
    }

    const onConvertCurrencyInput = (e) => {
        setError('')
        setToCurrency((e.target.value).toUpperCase())
    }

    const onCompareArrowClick = () => {
        navigate(location.pathname, { replace: true });
        setError('')
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency)
    }

    const onRadioBtnClick = (e) => {
        setView(e.target.value)
    }

    const onConvertBtnClick = useCallback(() => {
        setLoading(true);

        if (isEmpty(location?.state)) {
            if (!amount) {
                setError('Please enter a valid number');
                setLoading(false);
                return false;
            }

            if (isEmpty(fromCurrency)) {
                setError('Please enter base Currency');
                setLoading(false);
                return false;
            }

            if (isEmpty(toCurrency)) {
                setError('Please enter currency to convert');
                setLoading(false);
                return false;
            }

        }

        Promise.all([getConvertedCurrencyData(fromCurrency, toCurrency, amount), getLatestCurrencyData(toCurrency, fromCurrency), getTimeSeriesData(sevenDaysAgo, currentDate, fromCurrency)]).then((response) => {

            setLoading(false)
            setConvertedData(response[0]?.data);
            setLatestCurrencyData(response[1]?.data);
            setTimeSeriesData(response[2]?.data.rates);
            setDummyState(true);

            let data = JSON.parse(localStorage.getItem("dataKey") || "[]");
            let tempArr = [];
            tempArr = response[0]?.data;
            let today = new Date();
            let time = today.getHours() + ":" + today.getMinutes();
            tempArr.time = time;
            tempArr.formattedDate = currentDate.split("-").reverse().join("/")

            data.push(tempArr);
            localStorage.setItem("dataKey", JSON.stringify(data));

        }).catch((error) => {
            setError('Unable to convert the currency');
            setLoading(false);
            console.error(error)
        })
    }, [amount, fromCurrency, toCurrency, location?.state])

    useEffect(() => {
        const getTimeSeriesDataFromApi = (startDate, endDate, baseCurrency) => {

            if ((baseCurrency.length === 3 && !isEmpty(amount) && toCurrency.length === 3 && dummyState) || !isEmpty(location?.state)) {
                setLoading(true);

                getTimeSeriesData(startDate, endDate, baseCurrency).then((response) => {
                    setLoading(false)
                    setTimeSeriesData(response?.data.rates);
                }).catch((error) => {
                    setError('Unable to convert the currency');
                    setLoading(false);
                    console.error(error)
                })
            }

        }

        const getHistoricalData = () => {
            if (duration === '7') {
                getTimeSeriesDataFromApi(sevenDaysAgo, currentDate, fromCurrency)
            }

            if (duration === '14') {
                getTimeSeriesDataFromApi(fourteenDaysAgo, currentDate, fromCurrency)
            }

            if (duration === '30') {
                getTimeSeriesDataFromApi(thirtyDaysAgo, currentDate, fromCurrency)
            }
        }

        if (!isEmpty(location?.state)) {

            getHistoricalData();

            onConvertBtnClick();
        } else {

            getHistoricalData();
        }

    }, [location?.state, onConvertBtnClick, duration, fromCurrency, amount, dummyState, toCurrency])

    useEffect(() => {
        let tempStatsArr = [];

        tempStatsArr = Object.entries(timeSeriesData).map((item) => {
            const filteredKey = Object.keys(item[1])
                .filter(key => [toCurrency].includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: item[1][key]
                    };
                }, {});

            return filteredKey[toCurrency];
        })

        setStatsObj(tempStatsArr)
    }, [timeSeriesData, toCurrency])

    return (
        <>
            <Header />
            <div className='mainContainer'>
                <h1 className='headingText'>I want to convert</h1>

                <ConvertCurrencyUI
                    onAmountInput={onAmountInput}
                    onBaseCurrencyInput={onBaseCurrencyInput}
                    amount={amount}
                    onConvertCurrencyInput={onConvertCurrencyInput}
                    onCompareArrowClick={onCompareArrowClick}
                    onConvertBtnClick={onConvertBtnClick}
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                    location={location}
                />

                {
                    error && <div className='redClr errorDiv flex-center'>{error}</div>
                }
                {
                    (!isEmpty(convertedData)) && !loading &&
                    <div className='convertMainDiv'>
                        <div className='convertedAmount flex-center'>
                            <span className='mr10'>{(convertedData?.query?.amount)?.toLocaleString()}</span> <span className='mr10'>{convertedData?.query?.from}</span> = <span className='ml10 resultTxt'>{(convertedData?.result)?.toLocaleString()} {convertedData?.query?.to}</span>
                        </div>
                        <div className='latestPriceDiv flex-center'>
                            <div className='priceTxt'>
                                1 {fromCurrency} = {convertedData?.info?.rate} {toCurrency}
                            </div>
                        </div>
                        <div className='latestPriceDiv flex-center' style={{ marginTop: 15 }}>
                            <div className='priceTxt'>
                                1 {toCurrency} = {Object.values(latestCurrencyData?.rates)} {fromCurrency}
                            </div>
                        </div>
                    </div>
                }
                {
                    loading && <h3 className='loadingData flex-center'>Converting your data...</h3>
                }

                {
                    (!isEmpty(timeSeriesData)) && !loading &&
                    <>
                        <h2 className='excHistoryTxt'>Exchange History</h2>

                        <div className='selectDiv'>
                            <label className='durationLabel'>Duration</label>
                            <div className='selectRadioContainer'>
                                <select value={duration} name="duration" className='durationSelect' onChange={handleDurationChange}>
                                    <option value={7}>7 days</option>
                                    <option value={14}>14 days</option>
                                    <option value={30}>30 days</option>
                                </select>
                                <div onChange={onRadioBtnClick} className='radioCls'>
                                    <input type="radio" value="table" name="type" defaultChecked/> <label className='viewType'>Table</label>
                                    <input type="radio" value="chart" name="type" className='chartRadio'/> <label className='viewType'>Chart</label>
                                </div>
                            </div>
                        </div>

                        <ExchangeHistoryUI
                            timeSeriesData={timeSeriesData}
                            toCurrency={toCurrency}
                            statsObj={statsObj}
                            duration={duration}
                            view={view}
                        />
                    </>
                }
            </div>
        </>
    )
}

export default CurrencyConverterPage;