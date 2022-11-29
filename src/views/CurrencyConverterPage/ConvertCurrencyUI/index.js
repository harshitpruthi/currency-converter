import React from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash.isempty';

const ConvertCurrencyUI = (props) => {
    const navigate = useNavigate();
    const { 
        onAmountInput,
        onBaseCurrencyInput,
        onConvertCurrencyInput,
        onCompareArrowClick,
        onConvertBtnClick,
        amount,
        fromCurrency,
        toCurrency,
        location
    } = props;

    return (
        <div className='inputDivWrapper'>
            <div className='amountInput'>
                <span className='amountTxt'>Amount</span>
                <input
                    className='inputField'
                    type="number"
                    placeholder='Enter Amount'
                    value={!isEmpty(location.state) ? location?.state?.query?.amount : amount}
                    onInput={onAmountInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                            navigate(location.pathname, { replace: true });
                        }
                    }}
                />
            </div>
            <div className='amountInput'>
                <span className='amountTxt'>From</span>
                <input
                    className='inputField fromInput'
                    type="text"
                    placeholder='Base currency'
                    value={!isEmpty(location.state) ? location?.state?.query?.from : fromCurrency}
                    onInput={onBaseCurrencyInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                            navigate(location.pathname, { replace: true });
                        }
                    }}
                />
            </div>
            <div className='compareArrowDiv' onClick={onCompareArrowClick}>
                <span className="material-icons compareArrow primaryClr">
                    compare_arrows
                </span>
            </div>
            <div className='amountInput'>
                <span className='amountTxt'>To</span>
                <input
                    className='inputField fromInput'
                    type="text"
                    placeholder='Currency to convert'
                    value={!isEmpty(location.state) ? location?.state?.query?.to : toCurrency}
                    onInput={onConvertCurrencyInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                            navigate(location.pathname, { replace: true });
                        }
                    }}
                />
            </div>
            <div className='amountInput'>
                <button className='convertBtn' onClick={onConvertBtnClick}>
                    CONVERT
                </button>
            </div>
        </div>
    )
}

export default ConvertCurrencyUI;