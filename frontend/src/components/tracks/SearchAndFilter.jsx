import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    genre: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск треков..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-4">
          <div>
            <label className="block text-white mb-2">Жанр</label>
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Все жанры</option>
              <option value="pop">Поп</option>
              <option value="rock">Рок</option>
              <option value="hiphop">Хип-хоп</option>
              <option value="electronic">Электронная</option>
              <option value="classical">Классическая</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Сортировка</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="title">По названию</option>
              <option value="artist">По исполнителю</option>
              <option value="date">По дате добавления</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Порядок</label>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter; 