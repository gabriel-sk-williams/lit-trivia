/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, } from 'react'
import { Input, Button, Link, Image, Text, Flex, HStack } from '@chakra-ui/react'
import { IoIosLink, IoMdCheckmarkCircle } from "react-icons/io";
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import emailjs from "@emailjs/browser";

const Home: NextPage = () => {

  const [emailAddress, setEmailAddress] = useState('');
  const [subStatus, setSubStatus] = useState(false);

  // remaining: check if email is valid / exists
  async function handleEmailSignup() {
    //const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID!;
    //const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAIL_ID!;
    //const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

    const SERVICE_ID="service_jfsp3zk";
    const TEMPLATE_ID="template_tvruy4b";
    const PUBLIC_KEY="pwczb0kU0-RoKAl5G";

    var params = {
      emailAddress: emailAddress,
    };

    emailjs.send(SERVICE_ID,TEMPLATE_ID, params, PUBLIC_KEY)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSubStatus(true);
      }, (err) => {
        console.log('FAILED...', err);
      });
  }

  return (
    <div className={styles.container}>

      <Head>
        <title>Sphinx Game</title>
        <meta name="web3 riddles" content="sphinx game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
        <Flex
          width="100%"
          height="100%"
          direction="column"
          alignItems="center"
          gap="2rem"
          padding="2rem"
        >

          <div className={styles.buttonfont}>
            <Text fontSize={25} align="center">
            Of course it's trivial,
            </Text>
            <Text fontSize={25} align="center">
            but then most things are...
            </Text>
          </div>
  
          {/*<Image src='/Logo.png' alt='Sphinx Logo' width={'30%'} height={'30%'} />*/}
          <Image src='/Logo_dithered.gif' alt='Dark Sarcophagus' width={'40%'} height={'40%'} />

            <HStack>
              <Link href='/trivia'>
                <Button
                  backgroundColor="#BB86FC"
                  _hover={{ bg: '#121212' }}
                  _active={{ bg: '#121212' }}
                >
                  PLAY
                </Button>
              </Link>
              <Link href='/leaderboard'>
              <Button
                backgroundColor="#ccad8fFC"
                _hover={{ bg: '#121212' }}
                _active={{ bg: '#121212' }}
              >
                LEADERBOARD
              </Button>
            </Link>
          </HStack>

          <Text> get notified about our next launch: </Text>
          <HStack>
            <Input 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder = 'your email'
              size='md' 
              isRequired={true} 
              variant='flushed'
            />
          </HStack>

          {subStatus ? 
            <Button
              backgroundColor="#121212"
              rightIcon={<IoMdCheckmarkCircle />}
              _hover={{bg: '#121212'}}
              _active={{bg: '#121212'}}
            >
              SENT
            </Button> :
            <Button
              backgroundColor="#4bd166"
              rightIcon={<IoMdCheckmarkCircle />}
              _hover={{bg: '#121212'}}
              _active={{bg: '#121212'}}
              onClick={handleEmailSignup}
            >
              SUBMIT
            </Button>
          }

        </Flex>
      </main>
    </div>
  )
}

export default Home
