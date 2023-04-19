// theme.js
import { extendTheme } from '@chakra-ui/react'

// Version 1: Using objects
export const theme = extendTheme({
  colors: {
    backgroundDark: '#000000',
  },
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white'
      }
    }
  }
})
