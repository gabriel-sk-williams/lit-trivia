/* eslint-disable @next/next/no-img-element */

import { Box, HStack, Stack, Text } from '@chakra-ui/layout'
import { useDisclosure, Link } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavItem } from './NavItem'
import { NavFAQ } from './NavFAQ'
import styles from '../../styles/Home.module.css';

// @ts-ignore
import { SocialIcon } from 'react-social-icons'
import { stringify } from 'querystring';

export const Header = () => {

  return (
    <header>
      <Stack direction={['column', 'column', 'row']} px={2} py={4}>
        <HStack
          justifyContent={['space-between']}
          w={'full'}
          px={{ base: 0, lg: '2rem' }}
        >
          <div className={styles.buttonfont}>
            <Box fontWeight="bold" fontSize={[25, 25, 25]}>
                <Link 
                  href="https://twitter.com/wordcellabs" 
                  isExternal 
                  className="center flex gap-2"
                >
                  <span className="text-xl">sphinx game</span>
                </Link>
            </Box>
          </div>

          <HStack>
            <HStack
              px={[4, 4, 0]}
              display={['none', 'none', 'none', 'flex']}
              gap={{ lg: '0.4rem', xl: '1.5rem' }}
              mr={4}
            >
            
            <NavItem key='home' href='/'/>
            <NavFAQ key='faq' href='/faq'/>
            
            </HStack>

            <ConnectButton />
          </HStack>
        </HStack>
      </Stack>

    </header>
  )
}
