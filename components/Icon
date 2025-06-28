import React from 'react';

type IconProps = {
  name: string;
  className?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
};

const Icon: React.FC<IconProps> = ({ name, className, weight = 'bold' }) => {
  const iconClass = `ph-${name}-${weight}`;
  return <i className={`${iconClass} ${className || ''}`}></i>;
};

export default Icon;
