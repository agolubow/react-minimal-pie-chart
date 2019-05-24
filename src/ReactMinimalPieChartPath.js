import React from 'react';
import PropTypes from 'prop-types';
//import partialCircle from 'svg-partial-circle';
import { degreesToRadians, extractPercentage, valueBetween } from './utils';

const partialCircle = function(cx, cy, r, start, end){
  const length = end - start;
  if (length === 0) return [];
  const fromX = r * Math.cos(start) + cx;
  const fromY = r * Math.sin(start) + cy;
  const toX = r * Math.cos(end) + cx;
  const toY = r * Math.sin(end) + cy;
  const large = Math.abs(length) <= Math.PI ? '0' : '1';
  const sweep = length < 0 ? '0' : '1';
  return [['M', fromX, fromY], ['A', r, r, 0, large, sweep, toX, toY]];
};

function makePathCommands(cx, cy, startAngle, lengthAngle, radius) {
  const patchedLengthAngle = valueBetween(lengthAngle, -359.999, 359.999);

  return partialCircle(
    cx,
    cy, // center X and Y
    radius,
    degreesToRadians(startAngle),
    degreesToRadians(startAngle + patchedLengthAngle)
  )
    .map(command => command.join(' '))
    .join(' ');
}

export default function ReactMinimalPieChartPath({
  cx,
  cy,
  startAngle,
  lengthAngle,
  radius,
  lineWidth,
  reveal,
  title,
  ...props
}) {
  const actualRadio = radius - lineWidth / 2;
  const pathCommands = makePathCommands(
    cx,
    cy,
    startAngle,
    lengthAngle,
    actualRadio
  );
  let strokeDasharray;
  let strokeDashoffset;

  // Animate/hide paths with "stroke-dasharray" + "stroke-dashoffset"
  // https://css-tricks.com/svg-line-animation-works/
  if (typeof reveal === 'number') {
    strokeDasharray = degreesToRadians(actualRadio) * Math.abs(lengthAngle);
    strokeDashoffset =
      strokeDasharray + extractPercentage(strokeDasharray, reveal);
  }

  return (
    <path
      d={pathCommands}
      strokeWidth={lineWidth}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      {...props}
    >
      {title && <title>{title}</title>}
    </path>
  );
}

ReactMinimalPieChartPath.displayName = 'ReactMinimalPieChartPath';

ReactMinimalPieChartPath.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  startAngle: PropTypes.number,
  lengthAngle: PropTypes.number,
  radius: PropTypes.number,
  lineWidth: PropTypes.number,
  reveal: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ReactMinimalPieChartPath.defaultProps = {
  startAngle: 0,
  lengthAngle: 0,
  lineWidth: 100,
  radius: 100,
};
