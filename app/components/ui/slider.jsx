'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef(({ 
  className, 
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  onValueChange,
  ...props 
}, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className="relative flex w-full touch-none select-none items-center"
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-green-600" />
      </SliderPrimitive.Track>
      
      {defaultValue && defaultValue.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-4 w-4 rounded-full border border-green-600 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-600"
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = 'Slider';

export { Slider };