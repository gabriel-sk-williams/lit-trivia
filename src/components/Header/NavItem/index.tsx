import { Text, Link } from '@chakra-ui/react'
import NextLink, { LinkProps } from 'next/link'
import { FC } from 'react'
import styles from '../../../styles/Home.module.css';


export const NavItem: FC<LinkProps> = ({ href }) => (

  <div className={styles.buttonfont}>
    <NextLink href={href} passHref>
      <Link style={{ color: '#BB86FC', cursor: 'pointer' }}>
        <Text
          color="#fff"
          fontSize={[16, 16, 16, 18]}
          fontWeight={600}
          display="block"
          width="auto"
        >
          home
        </Text>
      </Link>
    </NextLink>
  </div>
)
