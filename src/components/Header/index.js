import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Tabs from '../Tabs';

import './header.css';

const tabsData = [
    {
        width: 186,
        left: 0,
        name: 'CURRENCY CONVERTER'
    },
    {
        width: 220,
        left: 215,
        name: 'VIEW CONVERSION HISTORY'
    }
]

const Header = () => {
    const [tabSelected, setTabSelected ] = useState(() => {
        if(window.location.pathname === '/conversion-history') {
            return 1;
        } else if(window.location.pathname === '/' || window.location.pathname === 'currency-converter' ) {
            return 0;
        }
    });

    const [rerender, setRerender] = useState(false);

    const navigate = useNavigate();

    const onTabSelect = (index) => {
        setTabSelected(index);
        if(index === 0) {
            navigate('/currency-converter');
            setRerender(!rerender); 
        } else {
            navigate('/conversion-history');
        }
    }

    return (
        <header className='headerLogo'>
            <div className='currencyExchangeTxt' onClick={() => navigate('/')}>Currency<span className='exchangeTxt'>Exchange</span></div>
            <Tabs
                data={tabsData}
                onTabSelect={onTabSelect}
                activeTabIndexOnMount={tabSelected}
                showBottomBorder={false}
                customStyleTab="tabsText"
            />
        </header>
    )
}

export default Header;