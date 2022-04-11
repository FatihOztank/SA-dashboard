import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import ExpandableContainer from 'components/ExpandableContainer'
import SimpleRange from 'components/SimpleRange'
import { LayoutMetricType } from 'utils/propTypes'
import { useClientSize } from 'hooks/victory'
import { COLOR_PALETTES, filterData } from './SectionSimpleRange.utils'

const SectionSimpleRange = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const ref = useRef()
  const defaultContainerWidth = 560
  const defaultContainerHeight = 360
  const size = useClientSize(ref, defaultContainerWidth, defaultContainerHeight, 0.6)

  if (typeof layout.max !== 'undefined' && typeof layout.min !== 'undefined') {
    if (data) {
      return <SimpleRange value={data} domain={[layout.min, layout.max]} variant={layout.options.variant} />
    } else {
      return <Skeleton variant="rectangular" sx={{ borderRadius: 1 }} />
    }
  }

  if (xAxisKey && yAxisKey && data) {
    const filteredData = filterData(data, layout.filters)
    return (
      <Box ref={ref}>
        <ExpandableContainer data={filteredData}>
          {items =>
            items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="fieldLabel">{item[xAxisKey]}</Typography>
                <SimpleRange
                  value={item[yAxisKey]}
                  domain={[layout.y.min, layout.y.max]}
                  variant={layout.options.variant}
                  color={COLOR_PALETTES[layout.title]}
                />
              </Box>
            ))
          }
        </ExpandableContainer>
      </Box>
    )
  } else {
    return <Skeleton variant="rectangular" {...size} sx={{ borderRadius: 1 }} />
  }
}

SectionSimpleRange.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionSimpleRange
