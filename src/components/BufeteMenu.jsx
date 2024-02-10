import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

const fontSizeClass = 'xs:text-md sm:text-md md:text-md lg:text-base xl:text-base';

function BufeteMenu({ menuItems }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Bufete Menu</h1>
      </div>
      <ul className="overflow-y-auto px-4 py-6 flex-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              className={`flex items-center w-full py-2 rounded-lg transition duration-75 group ${fontSizeClass} ${
                selectedItem === item ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              <span className="flex-1 truncate">{item.title}</span>
              {item.children && item.children.length > 0 && (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {item.children && item.children.length > 0 && selectedItem === item && (
              <ul className="ml-4 mt-2">
                {item.children.map((subItem) => (
                  <li key={subItem.id}>
                    <button className="text-sm text-gray-300">{subItem.title}</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

BufeteMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default BufeteMenu;
