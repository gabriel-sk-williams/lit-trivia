import { Button, Link, VStack, HStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { TwitterShareButton } from 'react-twitter-embed';
import { useRouter } from "next/router";
import { Text } from '@chakra-ui/layout'


const Confirm: NextPage = () => {

  const router = useRouter();
  const { score }= router.query;

  const parsedScore = typeof score === 'string' ? parseInt(score) : 0;
  const lowline = parsedScore > 24
    ? 'godlike'
    : parsedScore > 16
    ? 'finally, someone smart'
    : parsedScore > 8
    ? 'nice'
    : parsedScore > 4
    ? 'i am not entirely disappointed'
    : parsedScore > 2
    ? 'kinda sad honestly'
    : 'pathetic';

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        
            <VStack gap="1rem">

              <h3 className={styles.title}>
              You scored:
              </h3>
              
              <h2 className={styles.title}>
                {parsedScore}
              </h2>

              <Text fontSize={16} >
                {lowline}
              </Text>
              
              <HStack>
                <Link href='/trivia'>
                    <Button
                    backgroundColor="#BB86FC"
                    _hover={{
                        bg: '#121212'
                    }}
                    _active={{
                        bg: '#121212'
                    }}
                    >
                    Try Again
                    </Button>
                </Link>
                {
                  <Link href='/leaderboard'>
                    <Button
                    backgroundColor="#ccad8f"
                    _hover={{
                        bg: '#121212'
                    }}
                    _active={{
                        bg: '#121212'
                    }}
                    >
                    Leaderboard
                    </Button>
                  </Link>
                }
              </HStack>

              <TwitterShareButton
                url={'https://sphinxgame.wtf'}
                options={{ 
                    text: `I just scored ${parsedScore} in the Doom Tomb:`, 
                    via: 'wordcellabs',
                    size: "large"
                }}
              />

            </VStack>
      </main>
    </div>
  )
}

export default Confirm