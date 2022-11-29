import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/Header';
import './conversionHistoryPage.css';

const ConversionHistoryPage = () => {
    const [lsArrData, setLsArrData] = useState(JSON.parse(localStorage.getItem('dataKey')));
    const [rerender, setRerender] = useState(false);
    const navigate = useNavigate();


    const onDeleteBtnclick = (key) => {
        lsArrData.splice(key, 1);
        localStorage.setItem('dataKey', JSON.stringify(lsArrData));
        setLsArrData(lsArrData);
        setRerender(!rerender);
    }

    const onViewBtnclick = (item) => {
        navigate('/currency-converter', { state: item })
    }

    return (
        <>
            <Header />
            <div className='mainContainer'>
                <h1 className='headingText'>Conversion History</h1>
                {
                    lsArrData?.length > 0 ?
                        <table className='conversionTable'>
                            <thead>
                                <tr className='tableHeadRow'>
                                    <th className='tableHeader'>Date</th>
                                    <th className='tableHeader'>Event</th>
                                    <th className='tableHeader'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lsArrData.map((item, key) => {
                                        return (
                                            <tr key={key + '_' + item?.result} className='tableRow'>
                                                <td className='tableRow'>{(item?.formattedDate) + ' @ ' + item?.time}</td>
                                                <td className='tableRow'>Converted an amount of {item?.query?.amount} from {item?.query?.from} to {item?.query?.to}</td>
                                                <td className='tableRow actionCls'>
                                                    <div className='actionViewDiv' onClick={() => onViewBtnclick(item)}>
                                                        <span className="material-icons primaryClr mr5">
                                                            remove_red_eye
                                                        </span><span className='primaryClr'>View</span>
                                                    </div>
                                                    <div className='actionRemoveDiv' onClick={() => onDeleteBtnclick(key)}>
                                                        <span className="material-icons redClr mr5">
                                                            delete_forever
                                                        </span><span className='redClr'>Delete from History</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })

                                }
                            </tbody>

                        </table> :
                        <h2 className='emptyConversionTxt primaryClr'>No Conversion History Found.Go To Conversion Page</h2>
                }
            </div>
        </>
    )
}

export default ConversionHistoryPage;