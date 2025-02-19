import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import debounce from 'lodash/debounce'
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material'
import { searchListSelector } from '../../store/modules/search'
import { isRequestPending } from '../../store/modules/api'

function WhitePaper({ children }) {
  return (
    <Paper
      sx={{
        bgcolor: 'white',
      }}>
      {children}
    </Paper>
  )
}

function SearchInput({ placeholder, onChange = () => null, onSelect = () => null, onHighlightChange }) {
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputChanged, setInputChanged] = useState(false)
  const [inputWidth, setInputWidth] = useState(180)
  const options = useSelector(searchListSelector)
  const isLoading = useSelector(isRequestPending('searchList', 'get'))
  const open = Boolean(focused && !(inputChanged && !options?.length) && inputValue)

  const handleHighlightChange = useCallback(
    (event, option) => {
      onHighlightChange(option)
    },
    [onHighlightChange],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(debounce(onChange, 500), [onChange])

  useEffect(() => {
    debouncedOnChange(inputValue)
  }, [debouncedOnChange, inputValue])

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!inputValue) {
      onHighlightChange(null)
      onSelect(null)
    }

    setInputChanged(true)
  }, [inputValue, onHighlightChange, onSelect])

  useEffect(() => {
    if (isLoading === false) {
      setInputChanged(false)
    }
  }, [isLoading])

  useEffect(() => {
    const tempNode = document.createElement('span')
    tempNode.innerText = placeholder || ''
    document.body.appendChild(tempNode)

    const width = tempNode.offsetWidth
    const offset = 14
    setInputWidth(width + offset)

    document.body.removeChild(tempNode)
  }, [placeholder])

  return (
    <Autocomplete
      autoHighlight
      blurOnSelect
      open={open}
      onHighlightChange={handleHighlightChange}
      id="search-input-autocomplete"
      options={options || []}
      filterOptions={x => x}
      getOptionLabel={item => item?.title || ''}
      value={null}
      onChange={(event, val) => onSelect(val)}
      noOptionsText="No results"
      inputValue={inputValue || ''}
      PaperComponent={WhitePaper}
      renderOption={(props, option) => (
        <Stack {...props} key={option?.id + option?.subtitle}>
          <Typography fontWeight={500} sx={{ color: '#000' }}>
            {option?.title}
          </Typography>

          <Typography fontSize={'0.875rem'} sx={{ color: theme => theme.palette.darkGrey.main }}>
            {option?.subtitle}
          </Typography>
        </Stack>
      )}
      renderInput={params => (
        <TextField
          {...params}
          sx={{
            input: { width: `${inputWidth}px !important`, paddingRight: inputValue ? '48px !important' : undefined },
          }}
          variant={'filled'}
          onChange={event => setInputValue(event?.target?.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          InputProps={{
            ...params.InputProps,
            placeholder,
            startAdornment: (
              <InputAdornment position="start" sx={{ mt: '0 !important' }}>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} style={{ position: 'absolute', right: 38 }} />
                ) : null}

                {inputValue && (
                  <IconButton
                    onClick={() => setInputValue('')}
                    sx={{
                      color: theme => theme.components.autocompleteClearIcon.color,
                      position: 'absolute',
                      right: '2px',
                    }}>
                    <CloseIcon />
                  </IconButton>
                )}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export default SearchInput
