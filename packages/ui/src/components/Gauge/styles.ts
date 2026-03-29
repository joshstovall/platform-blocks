import { useTheme } from '../../core/theme';
import { GaugeStyleProps } from './types';

export const useGaugeStyles = (props: GaugeStyleProps) => {
  const theme = useTheme();
  const { size, disabled, thickness } = props;

  const containerSize = typeof size === 'number' ? size : 200;
  
  return {
    container: {
      position: 'relative' as const,
      width: containerSize,
      height: containerSize,
      opacity: disabled ? 0.5 : 1,
    },
    
    svg: {
      width: '100%',
      height: '100%',
      overflow: 'visible' as const,
    },
    
    track: {
      fill: 'none',
      stroke: theme.colors.gray[2],
      strokeWidth: thickness,
      strokeLinecap: 'round' as const,
    },
    
    range: {
      fill: 'none',
      strokeWidth: thickness,
      strokeLinecap: 'round' as const,
      transition: 'stroke-dasharray 0.3s ease',
    },
    
    needle: {
      transformOrigin: 'center',
      transition: 'transform 0.5s ease-out',
    },
    
    needleLine: {
      stroke: theme.colors.primary[5],
      strokeWidth: 2,
      strokeLinecap: 'round' as const,
    },
    
    center: {
      fill: theme.colors.primary[5],
    },
    
    tick: {
      stroke: theme.colors.gray[4],
      strokeLinecap: 'round' as const,
    },
    
    majorTick: {
      strokeWidth: 2,
      stroke: theme.colors.gray[6],
    },
    
    minorTick: {
      strokeWidth: 1,
      stroke: theme.colors.gray[4],
    },
    
    label: {
      fill: theme.text.primary,
      fontSize: 12,
      fontFamily: theme.fontFamily,
      textAnchor: 'middle' as const,
      dominantBaseline: 'central' as const,
    },
  };
};
