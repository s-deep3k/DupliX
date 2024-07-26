import { useState } from 'react';
import { Flex, TabPanel, Tabs } from '@pega/cosmos-react-core';

const TabsCountDemo = () => {
  const [panelShown, changePanel] = useState('1');
  const handleTabChange = id => {
    changePanel(id);
  };

  const tabs = [
    { name: 'Tab 1', id: '1', count: 5 },
    { name: 'Tab 2', id: '2', count: 14 },
    { name: 'Tab 3', id: '3', count: 0 },
    { name: 'Tab 4', id: '4', count: 56, disabled: true },
    { name: 'Tab 5', id: '5', count: 150, errors: 2 }
  ];

  return (
    <Flex container={{ direction: 'horizontal' === 'horizontal' ? 'column' : 'row' }}>
      <Flex item={{ grow: 1 }}>
        <Tabs
          tabs={tabs}
          type='horizontal'
          onTabClick={handleTabChange}
          currentTabId={panelShown}
        />
      </Flex>
      <Flex container={{ pad: [1, 2] }} item={{ grow: 1 }}>
        {tabs.map(tab => (
          <TabPanel tabId={tab.id} currentTabId={panelShown} key={tab.id}>
            <div>{tab.name} content</div>
          </TabPanel>
        ))}
      </Flex>
    </Flex>
  );
};

export default TabsCountDemo;
