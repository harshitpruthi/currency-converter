import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const ExchangeHistoryUI = (props) => {
    const { timeSeriesData, toCurrency, statsObj, duration, view } = props;
    const timeSeriesEntries = Object.entries(timeSeriesData).reverse();

    const sumValues = Object.values(statsObj).reduce((a, b) => a + b, 0);
    const avgVal = sumValues / duration;
    console.log(view)

    if (view === 'chart') {
        return (
            <Sparklines data={[...Object.values(statsObj)]}>
                <SparklinesLine color="#009688" />
            </Sparklines>
        )
    }

    return (
        <div className='tableContainer'>
            <table className='conversionHistoryTable'>
                <thead>
                    <tr className='tableHistoryHeadRow'>
                        <th className='tableHistoryHeader'>Date</th>
                        <th className='tableHistoryHeader'>Exchange Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        timeSeriesEntries.map((item, key) => {
                            const filteredKey = Object.keys(item[1])
                                .filter(key => [toCurrency].includes(key))
                                .reduce((obj, key) => {
                                    return {
                                        ...obj,
                                        [key]: item[1][key]
                                    };
                                }, {});

                            return (
                                <tr key={key} className='tableHistoryRow'>
                                    <td className='tableHistoryRow'>{item[0].split("-").reverse().join("/")}</td>
                                    <td className='tableHistoryRow'>{filteredKey[toCurrency]}</td>
                                </tr>
                            )
                        })

                    }
                </tbody>

            </table>
            <table className='conversionHistoryTable statTable'>
                <thead>
                    <tr className='tableHistoryHeadRow'>
                        <th className='tableHistoryHeader'>Statistics</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='statRow'>
                        <td className='statData'>Lowest</td>
                        <td className='statDataVal'>{Math.min(...Object.values(statsObj))}</td>
                    </tr>
                    <tr className='statRow'>
                        <td className='statData'>Highest</td>
                        <td className='statDataVal'>{Math.max(...Object.values(statsObj))}</td>
                    </tr>
                    <tr className='statRow'>
                        <td className='statData'>Average</td>
                        <td className='statDataVal'>{avgVal?.toFixed(8)}</td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default ExchangeHistoryUI;