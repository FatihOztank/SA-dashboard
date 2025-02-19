import React, { useCallback } from 'react'
import { Box, Button, styled, Typography, Link } from '@mui/material'
import { ChevronRight } from '@mui/icons-material'
import PropTypes from 'prop-types'
import SimpleRange from '../SimpleRange'
import CompareIconPlus from '../Icons/CompareIconPlus'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import PATH from 'utils/path'
import { iconColor } from 'utils/theme'

const StyledTitleLink = styled(Link)({
  display: 'flex',
  justifyContent: 'space-between',
  textDecoration: 'none',
  marginBottom: '8px',
})

function MapPopupContent({
  id,
  datasetId,
  title,
  metricName,
  data,
  colorScheme,
  domain,
  expanded,
  addToComparison,
  canAddToComparison,
  assistantProps,
}) {
  const disableAddToComparison = !canAddToComparison(id)

  const handleAddToComparison = useCallback(() => {
    addToComparison({ id, title })
  }, [addToComparison, id, title])

  const { setBusinessLocation, businessSimulatorOpen, simulating } = assistantProps

  return (
    <Box
      p={1.5}
      bgcolor={expanded ? '#fff' : 'rgba(255, 255, 255, 0.9)'}
      color={theme => theme.palette.darkGrey.main}
      borderRadius={'10px'}
      width={200}
      boxShadow={'0px 2px 4px rgba(0, 0, 0, 0.25)'}>
      <StyledTitleLink to={`${PATH.DATASET_ENTRY.replace(':datasetId', datasetId).replace(':entryId', id)}`}>
        <Typography fontSize={18} fontWeight={500} color={'#000'}>
          {title}
        </Typography>

        <ChevronRight
          sx={{
            position: 'relative',
            left: '8px',
            color: iconColor,
            opacity: expanded ? 1 : 0,
            transition: theme => `opacity ${theme.transitions.duration.short}ms`,
          }}
        />
      </StyledTitleLink>

      <Typography fontSize={14} mb={0.5}>
        {metricName}
      </Typography>

      {data > 0 && (
        <Box>
          <SimpleRange value={data} size={'small'} variant={'gradient'} colorScheme={colorScheme} domain={domain} />
        </Box>
      )}

      {expanded && (
        <>
          <Button
            variant="text"
            sx={{
              p: 0,
              color: theme => theme.palette.darkGrey.main,
              mt: 1,
              textTransform: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            onClick={handleAddToComparison}
            disabled={disableAddToComparison}>
            <CompareIconPlus size={24} />

            <Typography component="span" fontWeight={500} fontSize={14} sx={{ ml: 1 }}>
              Add to comparison
            </Typography>
          </Button>
          {businessSimulatorOpen && (
            <Button
              variant="text"
              sx={{
                p: 0,
                color: theme => theme.palette.darkGrey.main,
                mt: 1,
                textTransform: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => setBusinessLocation({ datasetId, id, title })}
              disabled={simulating}>
              <AddBusinessOutlinedIcon size={24} />

              <Typography component="span" fontWeight={500} fontSize={14} sx={{ ml: 1, textAlign: 'left' }}>
                Simulate New
                <br />
                Business Here
              </Typography>
            </Button>
          )}
        </>
      )}
    </Box>
  )
}

MapPopupContent.propTypes = {
  datasetId: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  metricName: PropTypes.string,
  data: PropTypes.number,
  colorScheme: PropTypes.array,
  domain: PropTypes.array,
  expanded: PropTypes.bool,
  businessSimulatorOpen: PropTypes.bool,
  simulating: PropTypes.bool,
}

MapPopupContent.defaultProps = {
  domain: [0, 1],
}

export default MapPopupContent
