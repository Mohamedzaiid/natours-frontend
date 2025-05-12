"use client";

import { useState } from "react";
import { Slider } from "@/app/components/ui/slider";
import {
  Filter,
  ArrowUpDown,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  X,
} from "lucide-react";

const TourFilter = ({ filter, onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handlePriceChange = (value) => {
    onFilterChange({ priceRange: value });
  };

  const clearFilters = () => {
    onFilterChange({
      difficulty: "",
      duration: "",
      maxGroupSize: "",
      priceRange: [0, 5000],
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <button
          onClick={toggleFilters}
          className="w-full flex items-center justify-between text-slate-700 font-medium"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <span>Filters</span>
          </div>
          <ArrowUpDown
            size={16}
            className={`transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Filter Content */}
      <div
        className={`
        flex flex-col gap-6 p-6 
        ${isFilterOpen ? "block" : "hidden"} 
        lg:block
      `}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
            <DollarSign size={16} />
            Price Range
          </h4>
          <div className="px-2">
            <Slider
              defaultValue={filter.priceRange}
              min={0}
              max={5000}
              step={100}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filter.priceRange[0]}</span>
              <span>${filter.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
            <TrendingUp size={16} />
            Difficulty
          </h4>
          <div className="space-y-2">
            {["easy", "medium", "difficult"].map((difficulty) => (
              <label
                key={difficulty}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={filter.difficulty === difficulty}
                  onChange={() => onFilterChange({ difficulty })}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="capitalize text-slate-700">{difficulty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
            <Clock size={16} />
            Duration
          </h4>
          <div className="space-y-2">
            {[
              { label: "1-3 days", value: "1-3" },
              { label: "4-7 days", value: "4-7" },
              { label: "7-14 days", value: "7-14" },
              { label: "14+ days", value: "14-30" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="duration"
                  checked={filter.duration === option.value}
                  onChange={() => onFilterChange({ duration: option.value })}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Group Size */}
        <div>
          <h4 className="font-medium text-gray-800 flex items-center gap-2 mb-4">
            <Users size={16} />
            Group Size
          </h4>
          <div className="space-y-2">
            {[
              { label: "Small (up to 10)", value: "10" },
              { label: "Medium (up to 15)", value: "15" },
              { label: "Large (up to 20)", value: "20" },
              { label: "Any size", value: "" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="groupSize"
                  checked={filter.maxGroupSize === option.value}
                  onChange={() =>
                    onFilterChange({ maxGroupSize: option.value })
                  }
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourFilter;
