import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './tabs.css';


const Tabs = props => {

  const [ activeIndex, setActiveIndex ] = useState(props.activeTabIndexOnMount);

  useEffect(() => {
    setActiveIndex(props.activeTabIndexOnMount);
  }, [ props.activeTabIndexOnMount ]);


  const onTabClick = (index) => {
    const { onTabSelect } = props;

    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    onTabSelect(index);
  };


  const getActiveTabDimensions = () => {
    const { data } = props;
    let left = 0;
    let width = 0;

    const activeTab = data[ activeIndex ];

    if (activeTab && activeTab.hasOwnProperty('width') && activeTab.hasOwnProperty('left')) {
      width = activeTab.width;
      left = activeTab.left;

      return {
        'width': width,
        'left': left
      };

    } else {
      if (typeof document !== 'undefined') {
        const prevActiveElement = document?.getElementsByClassName('tabs8TextActive');

        if (prevActiveElement && prevActiveElement.length) {
          const currentActiveElement = prevActiveElement[ 0 ]?.parentElement?.children[ activeIndex ];

          return {
            'width': currentActiveElement?.offsetWidth,
            'left': currentActiveElement?.offsetLeft
          };

        } else {
          return {
            'width': width,
            'left': left
          };
        }

      } else {
        return {
          'width': 0,
          'left': 0
        };
      }
    }

  };


  const { data, showBottomBorder, customStyleTab } = props;
  const { width, left } = getActiveTabDimensions();

  return (
    <div className={cn('tabs8Container', { 'tabs8Shadow': showBottomBorder })}>
      {
        width > 0 &&
        <div className="tabs8Line"
          style={{ width, left }}
        />
      }

      <div className="valign-wrapper">
        {
          data.map((item, key) => {
            return (
              <div
                className={`${customStyleTab} ${key === activeIndex && 'tabs8TextActive'}`}
                title={item.description}
                onClick={onTabClick.bind(null, key)}
                style={item.style}
                key={key}
              >
                {item.name}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};


Tabs.propTypes = {
  data: PropTypes.array.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  showBottomBorder: PropTypes.bool,
  activeTabIndexOnMount: PropTypes.number,
  customStyleTab: PropTypes.string
};


Tabs.defaultProps = {
  showBottomBorder: true,
  activeTabIndexOnMount: 0,
  customStyleTab: 'tabs8Text'
};

export default Tabs;
