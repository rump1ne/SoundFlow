import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const IconWrapper = styled.i`
  color: ${props => props.color || 'inherit'};
  font-size: ${props => props.size || '1rem'};
  margin: ${props => props.margin || '0'};
  cursor: ${props => props.cursor || 'inherit'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.hoverColor || props.color || 'inherit'};
    transform: ${props => props.hoverScale ? `scale(${props.hoverScale})` : 'none'};
  }
`;

// Icon mapping to ensure consistency
const iconMap = {
  // Player controls
  play: 'fas fa-play',
  pause: 'fas fa-pause',
  next: 'fas fa-step-forward',
  prev: 'fas fa-step-backward',
  volume: 'fas fa-volume-up',
  mute: 'fas fa-volume-mute',
  
  // Navigation
  search: 'fas fa-search',
  home: 'fas fa-home',
  library: 'fas fa-book',
  discover: 'fas fa-compass',
  profile: 'fas fa-user',
  settings: 'fas fa-cog',
  
  // Content
  playlist: 'fas fa-list-music',
  artist: 'fas fa-user-music',
  album: 'fas fa-compact-disc',
  track: 'fas fa-music',
  
  // Actions
  add: 'fas fa-plus',
  remove: 'fas fa-minus',
  edit: 'fas fa-edit',
  delete: 'fas fa-trash',
  favorite: 'fas fa-heart',
  share: 'fas fa-share',
  
  // View modes
  grid: 'fas fa-th-large',
  list: 'fas fa-list',
  
  // Other
  close: 'fas fa-times',
  menu: 'fas fa-bars',
  notification: 'fas fa-bell',
  download: 'fas fa-download',
  upload: 'fas fa-upload',
  filter: 'fas fa-filter',
  sort: 'fas fa-sort',
  check: 'fas fa-check',
  warning: 'fas fa-exclamation-triangle',
  info: 'fas fa-info-circle',
  error: 'fas fa-times-circle',
  success: 'fas fa-check-circle',
};

const Icon = ({ 
  name, 
  color, 
  size, 
  margin, 
  cursor, 
  hoverColor, 
  hoverScale,
  className,
  onClick,
  ...props 
}) => {
  // Get the icon class from the map or use the name directly if not found
  const iconClass = iconMap[name] || name;
  
  return (
    <IconWrapper
      className={className ? `${iconClass} ${className}` : iconClass}
      color={color}
      size={size}
      margin={margin}
      cursor={cursor}
      hoverColor={hoverColor}
      hoverScale={hoverScale}
      onClick={onClick}
      {...props}
    />
  );
};

export default Icon; 