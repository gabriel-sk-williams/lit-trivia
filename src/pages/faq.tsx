import type { NextPage } from 'next'

import { Heading, Flex, Text } from '@chakra-ui/layout'
import { 
  Divider, 
  useDisclosure,
  Collapse
 } from '@chakra-ui/react'
// import { IoCaretDownCircleOutline } from "react-icons/io5";

const FAQ: NextPage = () => {

  const { isOpen: q1, onToggle: q1OT } = useDisclosure();
  const { isOpen: q2, onToggle: q2OT } = useDisclosure();
  const { isOpen: q3, onToggle: q3OT } = useDisclosure();
  const { isOpen: q4, onToggle: q4OT } = useDisclosure();
  const { isOpen: q5, onToggle: q5OT } = useDisclosure();
  const { isOpen: q6, onToggle: q6OT } = useDisclosure();

  return (
    <Flex
      width="100%"
      height="90%"
      direction="column"
      alignItems="center"
      padding="2rem"
    >
      <Flex
        width="66%"
        height="100%"
        direction="column"
        justifyContent="space-between"
        gap="2rem"
      >

          <Flex
            direction="column"
              gap="1rem"
          >
                <Heading onClick={q1OT}  as='h3' size='lg' cursor='pointer'>
                  what are the rules?  
                </Heading>

              <Collapse in={q1} animateOpacity>
                <Text>
                Sphinx Game Trivia is a session-based trivia game where you answer as many questions as you can perfectly in 120 seconds. Unlimited attempts. It’s .005 ETH to put your score on the leaderboard, and puts your wallet in the running for daily and weekly prizes.
                <br/><br/>

                The top score will receive the top prize (obviously), however, if there are any ties, they will be broken by the amount of ETH staked, and then by earliest timestamp, in that order.
                <br/><br/>

                </Text>
              </Collapse>

          </Flex>

          <Divider orientation='horizontal' />

          <Flex
            direction="column"
            gap="1rem"
          >

              <Heading onClick={q2OT} as='h3' size='lg' cursor='pointer'>
                how do i play?
              </Heading>

              <Collapse in={q2} animateOpacity>
                <Text>
                  You will need some ETH in your wallet in order to decrypt questions, and at least 0.005 + gas fees to verify your score on the leaderboard.
                </Text>
            </Collapse>

          </Flex>

          <Divider orientation='horizontal' />

          <Flex
            direction="column"
            gap="1rem"
          >
              <Heading onClick={q3OT} as='h3' size='lg' cursor='pointer'>
                when does it start?
              </Heading>

              <Collapse in={q3} animateOpacity>
                <Text>
                The game opens Thursday, April 6th. The games will go for one week.
                </Text>
            </Collapse>
          </Flex>

          <Divider orientation='horizontal' />

          <Flex
            direction="column"
            gap="1rem"
          >

              <Heading onClick={q4OT} as='h3' size='lg' cursor='pointer'>
                what steps have you taken to ensure trust?
              </Heading>

              <Collapse in={q4} animateOpacity>
                <Text>
                The questions as well as the answers are encrypted using Lit Protocol. They can only be decrypted for a limited window while the trivia game is being played. Your answers will be verified on-chain, and if you choose, posted on the leaderboard to be eligible for daily and weekly prizes.
                </Text>
              </Collapse>

          </Flex>

          <Divider orientation='horizontal' />

          <Flex
            direction="column"
            gap="1rem"
          >

            <Heading onClick={q5OT} as='h3' size='lg' cursor='pointer'>
              who is behind this project?
            </Heading>

            <Collapse in={q5} animateOpacity>
              <Text>
                We are former crypto VCs and software developers turned game-makers.
              </Text>
            </Collapse>

          </Flex>

          <Divider orientation='horizontal' />

          <Flex
            direction="column"
            gap="1rem"
          >

            <Heading onClick={q6OT} as='h3' size='lg' cursor='pointer'>
              what is the roadmap?
            </Heading>

            <Collapse in={q6} animateOpacity>
              <Text>
              The roadmap is to make the best on-chain games. We want to keep innovating on truly intellectual games that cannot be done without crypto.
              <br/><br/>
              <br/><br/>
              <br/><br/>
              <br/><br/>
              <br/><br/>
              </Text>
            </Collapse>

          </Flex>

      </Flex>
    </Flex>
  )
}

export default FAQ
