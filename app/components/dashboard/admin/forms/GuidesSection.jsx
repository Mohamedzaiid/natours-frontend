'use client';

import { useState, useEffect } from 'react';
import { 
  User as UserIcon,
  Search,
  CheckCircle2,
  Loader,
  AlertCircle,
  Info
} from 'lucide-react';

// Guides section component for TourForm
const GuidesSection = ({
  activeTab,
  formData,
  handleGuideSelection,
  availableGuides,
  isLoadingGuides,
  isDark
}) => {
  const [searchGuidesTerm, setSearchGuidesTerm] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  
  // Filter guides when search term changes
  useEffect(() => {
    if (searchGuidesTerm.trim() === '') {
      setFilteredGuides(availableGuides);
    } else {
      const lowercasedSearch = searchGuidesTerm.toLowerCase();
      setFilteredGuides(
        availableGuides.filter(
          guide => guide.name.toLowerCase().includes(lowercasedSearch) ||
                  guide.email.toLowerCase().includes(lowercasedSearch) ||
                  guide.role.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchGuidesTerm, availableGuides]);
  
  // Check if a guide is selected
  const isGuideSelected = (guideId) => {
    return formData.guides.includes(guideId);
  };
  
  if (activeTab !== 'guides') return null;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tour Guides</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search guides..."
            className={`pl-10 pr-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-emerald-500 focus:border-emerald-500`}
            value={searchGuidesTerm}
            onChange={(e) => setSearchGuidesTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {isLoadingGuides ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={40} className="text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading guides...</p>
        </div>
      ) : filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map(guide => {
            const isSelected = isGuideSelected(guide._id);
            return (
              <div 
                key={guide._id}
                onClick={() => handleGuideSelection(guide)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${isSelected
                  ? isDark 
                    ? 'border-emerald-600 bg-emerald-900/30'
                    : 'border-emerald-500 bg-emerald-50'
                  : isDark
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                    {guide.photo && guide.photo !== 'default.jpg' ? (
                      <img
                        src={`https://natours-yslc.onrender.com/img/users/${guide.photo}`}
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">{guide.name}</h4>
                      {isSelected && (
                        <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{guide.email}</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${guide.role === 'lead-guide'
                        ? isDark
                          ? 'bg-blue-900/30 text-blue-300 border border-blue-800'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                        : isDark
                          ? 'bg-green-900/30 text-green-300 border border-green-800'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {guide.role === 'lead-guide' ? 'Lead Guide' : 'Guide'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={40} className="text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchGuidesTerm ? 'No guides match your search criteria' : 'No guides available'}
          </p>
        </div>
      )}
      
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Guide Selection</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select tour guides who will lead this tour. Lead guides are responsible for the overall tour, while regular guides assist with specific activities.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium">Current selection:</span>{' '}
              {formData.guides.length > 0
                ? `${formData.guides.length} guide${formData.guides.length !== 1 ? 's' : ''} selected`
                : 'No guides selected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesSection;