import React from 'react';
import {
  AirVent,
  Fan,
  Refrigerator,
  Tv,
  Laptop,
  Monitor,
  Waves,
  WashingMachine,
  Flame,
  Heater,
  Microwave,
  Lightbulb,
  Droplets,
  Shirt,
  Coffee,
  Wind,
  Zap,
} from 'lucide-react';

const ICON_MAP = {
  AirVent,
  Fan,
  Refrigerator,
  Tv,
  Laptop,
  Monitor,
  Waves,
  WashingMachine,
  Flame,
  Heater,
  Microwave,
  Lightbulb,
  Droplets,
  Shirt,
  Coffee,
  Wind,
  Zap,
};

export function ApplianceIcon({ name, className = 'w-6 h-6' }) {
  const IconComponent = ICON_MAP[name] || Zap;
  return <IconComponent className={className} aria-hidden="true" />;
}
