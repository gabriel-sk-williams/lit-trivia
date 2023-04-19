//import { useAccount, useConnect, useDisconnect } from 'wagmi' //useSigner
//import { useSignMessage } from 'wagmi'
import styles from '../styles/Home.module.css';
import React, { useRef, useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from "next/router";
import { Box, Button, Text, Flex, Input, VStack, CircularProgress } from '@chakra-ui/react';
import { Stack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { IoIosArrowDropleftCircle, IoMdCheckmarkCircle } from "react-icons/io";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { RecordTable } from '../components/Page/recordTable';

import * as LitNodeClient from "@lit-protocol/lit-node-client-nodejs";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { checkAndSignAuthMessage } from "@lit-protocol/auth-browser";
import { disconnectWeb3 } from '@lit-protocol/auth-browser/src/lib/chains/eth';
import keys from '../abi/practice_keys.json';
import pairs from '../abi/practice_pairs.json';
import { ethers } from 'ethers';

import {
    useAccount,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
   } from 'wagmi';


const client = new LitNodeClient.LitNodeClientNodeJs({
    litNetwork: "serrano",
    defaultAuthCallback: checkAndSignAuthMessage,
});

// const client = new LitJsSdk.LitNodeClient({});

const chain = "ethereum";

// Must possess at least 0.00001 ETH
const hasEth = [
    {
      contractAddress: '',
      standardContractType: '',
      chain,
      method: 'eth_getBalance',
      parameters: [
        ':userAddress',
        'latest'
      ],
      returnValueTest: {
        comparator: '>=',
        value: '10000000000000'
      }
    }
]

/*
const inputABI = {
    "inputs": [
      {
        "internalType": "string",
        "name": "newValue",
        "type": "string"
      }
    ],
    "name": "pushToResults",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}
*/

const payableABI = {
    "inputs": [
      {
        "internalType": "string",
        "name": "newValue",
        "type": "string"
      }
    ],
    "name": "pushToResults",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
}

const signTime = `
    const currentTime = new Date().getTime();
    const endTime = currentTime + 120000;
    LitActions.setResponse({response: JSON.stringify({ 
        startTime: currentTime, endTime
    })});
`;

type JsonAuthSig = {
    "sig": string;
    "derivedVia": string;
    "signedMessage": string;
    "address": string;
}

const Trivia: NextPage = () => {

    const router = useRouter();

    //const noq = 10;
    const duration = 120;
    const noq = 525; // may come automatically from Lit
    //const contractAddress = process.env.NEXT_PUBLIC_TEST_CONTRACT!;
    const contractAddress = "68C64B65f5960E28BeD8eaf364D37c2e440f8fa0";
    const [key, setKey] = useState(0);
    const [active, setActive] = useState<boolean>(false);
    const [played, setPlayed] = useState<boolean>(false);
    
    const [library, setLibrary] = useState<Array<Array<string>> | null>(null); //<Array<string>>
    const [index, setIndex] = useState<null | number>(null);
    const [question, setQuestion] = useState('Welcome to the Doom Tomb');
    const [record, setRecord] = useState<Array<boolean>>([]);
    const [userAnswer, setUserAnswer] = useState<string>('get fucking ready'); // display answers
    const [entry, setEntry] = useState<string>('');
    const [stakeError, setStakeError] = useState(false);

    const inputAnswer = useRef<string>(''); // holds user answer for comparison
    const answer = useRef<string>(''); // holds encrypted correct answer
    const authSignature = useRef<JsonAuthSig | undefined>(undefined);
    const log = useRef<Array<number>>([]); // holds generated indeces
    
    // entry variables
    const { address, isConnecting, isDisconnected } = useAccount();
    const [ correctAnswers, setCorrectAnswers ] = useState<number>(0);
    const [ stake, setStake ] = useState("0.005");
    const [ quizEnds, setQuizEnds ] = useState<number>(new Date().getTime());
    const [ enableHook, setEnableHook ] = useState<boolean>(false);

    const { config, isSuccess } = usePrepareContractWrite({
        address: `0x${contractAddress}`,
        abi: [ payableABI ],  
        functionName: 'pushToResults',
        enabled: enableHook,
        args: [ entry ],
            overrides: { 
            value: ethers.utils.parseEther(stake)
            }
        })
    
    const { data: writeData, error: prepError, write, reset } = useContractWrite(config);

    const { data: waitData, isLoading: waitLoading } = useWaitForTransaction({
        hash: writeData?.hash,
        onSuccess(data: any) {
            console.log('Success', data)
        },
    })

    const getSignedTime = async () => {
        await client.connect();

        const authSig = await checkAndSignAuthMessage({ chain: "ethereum" });
        authSignature.current = authSig;

        const results = await client.executeJs({
            code: signTime,
            authSig,
            jsParams: {
                conditions: hasEth
            }
        });

        const res = JSON.stringify(results.response);
        const { startTime, endTime } = JSON.parse(res);
        setQuizEnds(endTime);
        
        await loadQuestions(); 
        startQuiz();
    }

    const loadQuestions = async () => {
        setLibrary(pairs.trivia);
    }

    const startQuiz = () => {
        log.current = [];
        setPlayed(true);
        setRecord([]);
        setActive(true);
        setUserAnswer('');
        inputAnswer.current = '';
        getQuestion();
        setKey(prevKey => prevKey + 1); // resets clock
    }

    const endQuiz = async (reason: string) => {
        setActive(false);
        setQuestion(reason);
        setEnableHook(true);
    }

    const getQuestion = async () => {

        const genIndex = (noq: number) : number => {
            const ndx = Math.floor(Math.random()*noq);
            return (
                log.current.includes(ndx) ? genIndex(noq) : ndx
            );
        }

        if (log.current.length === noq) return endQuiz("All questions exhausted.");

        if (library !== null && active) {
            const chosen = genIndex(noq);
            const [q,a] = library[chosen];
            const [kq, ka] = keys.trivia[chosen];
            setIndex(chosen);

            const dq = await decryptString(q, kq);
            setQuestion(dq);

            // will happen on checkAnswer (asynchronously)
            const da = await decryptString(a, ka);
            answer.current = da.trim().toLowerCase()
        }
    }

    const handleSubmit = async () => {
        const result = checkAnswer();
        const newRecord = record;
        newRecord.push(result);
        setRecord([...newRecord]);

        const correctAnswers = newRecord.filter((result)=> result).length;
        setCorrectAnswers(correctAnswers);

        setUserAnswer('');  
        inputAnswer.current = '';
        getQuestion();
    }

    const handleStake = (num: string) => {
        const number = parseFloat(num);
        if (typeof number === 'number' && !isNaN(number) && number >= 0.005 && number <= 0.2) {
          setStakeError(false);
          setStake(num);
        }else{
          setStakeError(true);
        }
      }

    const checkAnswer = () => {
        const level = inputAnswer.current.trim().toLowerCase();
        return ( level === answer.current );
    }

    const decryptString = async (eString: string, eKey: string) => {

        const esBlob = LitNodeClient.base64StringToBlob(eString);

        const symmetricKey = await client.getEncryptionKey({
          accessControlConditions: hasEth,
          toDecrypt: eKey,
          chain,
          authSig: authSignature.current
        });

        const decryptedString = await LitJsSdk.decryptString(
            esBlob,
            symmetricKey
        );
        
        return decryptedString;
    }
    
    const test = () => {
        console.log(config);
        console.log(entry);
        console.log(authSignature);
    }
    
    // 
    // useEffect() Hooks
    //

    useEffect(() => {
        const currentEntry = {
            address: address,
            score: correctAnswers,
            stake: stake,
            timestamp: quizEnds,
            signature: authSignature.current ? authSignature.current.sig : "none",
        }
        setEntry(JSON.stringify(currentEntry));
    }, [address, correctAnswers, stake, quizEnds]);

    useEffect(() => {
        getQuestion();
    }, [library]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (index !== null && !log.current.includes(index)) {
            const newLog = log.current;
            newLog.push(index);
            log.current = newLog;
        }
    }, [log, index])

    useEffect(() => {
        const updateTimer = setInterval(() => {
            var now = new Date().getTime();

            if (now < quizEnds) {
                //console.log("tick");
            } else if (active && now > quizEnds) {
                clearInterval(updateTimer);
                endQuiz("Time's up!")
            }
        }, 1000)

        return () => {
            clearInterval(updateTimer);
            disconnectWeb3();
        }
    }, [quizEnds, active]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const keyDownHandler = (e: any) => {
            const code = e.which;
            if (active) {
                if (code <= 90 && code >= 48 || code === 190) {
                    setUserAnswer(prevState => prevState+e.key)
                    inputAnswer.current += e.key;
                } else if (code === 13) { // enter
                    handleSubmit()
                } else if (code === 8) { // backspace
                    setUserAnswer(prevState => prevState.slice(0, prevState.length-1))
                    inputAnswer.current = inputAnswer.current.slice(0, inputAnswer.current.length-1)
                } else if (code === 32) { // space
                    console.log("space");
                }
            }
        }

        document.addEventListener("keydown", keyDownHandler);
        return () => { document.removeEventListener("keydown", keyDownHandler); };
    }, [active, log]); // eslint-disable-line react-hooks/exhaustive-deps

    const displayQuestion = (q: string) => { return q.replace("&apos;", "'") }
    const displayInput = (i: string) => { 
        return i.length 
            ? <Text fontSize={28} color="#BB86FC">{i}</Text>
            : active
            ? <Text fontSize={28} color="#999999">{"type your answer"}</Text> 
            : <Text fontSize={28} color="#999999">{""}</Text> 
    }

    if (waitLoading) {
        return (
          <div className={styles.container}>
            <main className={styles.main}>
              <Flex
              width="100%"
              height="90%"
              direction="column"
              alignItems="center"
              padding="2rem"
              >
                <div className={styles.buttonfont}>
                  <Text fontSize={30} paddingBottom={5}> 
                   verifying your answers on-chain
                  </Text>
                </div>
    
                <CircularProgress isIndeterminate color='purple.300' />
    
                <div className={styles.buttonfont}>
                  <Text fontSize={30} paddingBottom={5} paddingTop={5}> 
                    dont leave this screen
                  </Text>
                </div>
    
                <div className={styles.buttonfont}>
                  <Text fontSize={18} paddingBottom={5}> 
                    this may take a moment
                  </Text>
                </div>
            </Flex>
          </main>
        </div>
        )
      }

    if (waitData) {
        const correctAnswers = record.filter((result)=> result).length;
        //@ts-ignore
        router.push({pathname: "/confirmscreen", query: {score: correctAnswers}});
    }
    
    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <Flex
                    height="100%"
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="4rem"
                >   

                    <CountdownCircleTimer
                        key={key}
                        isPlaying={active}
                        duration={duration}
                        colors={['#BB86FC', '#c790c7', '#F7B801', '#A30000']}
                        colorsTime={[120, 30, 10, 0]}
                        strokeWidth={10} //12
                        size={180} //180
                        onComplete={() => {[true, 1000]}}
                    >
                        {({ remainingTime }) => remainingTime}
                    </CountdownCircleTimer>

                    {<RecordTable record={record}/>}

                    <Flex direction="column" gap="1rem" textAlign="center">
                        <Text className="noselect" fontSize={29}>{displayQuestion(question)}</Text>
                        <Box height={"2rem"}>
                        {displayInput(userAnswer)}
                        </Box>
                    </Flex>

                    <Flex direction="column">
                        <VStack>
                            {active && played
                            ?   <Box width="60%">
                                    <Text fontSize={13} color="#999999" textAlign="center">
                                    Answers are one word. Don&apos;t worry about case. Numerical answers are acceptable only in numerical (“99”) form. For famous people, just enter the last name.
                                    </Text>
                                </Box>
                            :   !active && !played
                            ?   <Button
                                    backgroundColor="#4bd166"
                                    rightIcon={<IoMdCheckmarkCircle />}
                                    _hover={{bg: '#121212'}}
                                    _active={{bg: '#121212'}}
                                    onClick={getSignedTime}
                                >
                                START
                                </Button>
                            :   <VStack>
                                    <Text > Input your ETH stake (0.005 min, max 0.2): </Text>
                                    <Text > a higher stake breaks ties </Text>
                                    <Flex direction="column">
                                    <Input 
                                        // value={stake}
                                        onChange={(e) => handleStake(e.target.value)}
                                        placeholder='0.005'
                                        width='6.2rem'
                                        size='md' 
                                        isRequired={true}
                                        variant='outline'
                                    />
                                    <Text paddingBottom={3}></Text>
                                        <Button
                                            backgroundColor="#4bd166"
                                            rightIcon={<IoMdCheckmarkCircle />}
                                            _hover={{bg: '#121212'}}
                                            _active={{bg: '#121212'}}
                                            onClick={write}
                                        >
                                        SUBMIT
                                        </Button>
                                    </Flex>
                                </VStack>
                            }
                            { prepError ? 
                                            <Stack>
                                                <Alert colorScheme={"#8b0000"} status="error">
                                                <AlertIcon />
                                                <Box flex='1'>
                                                    <AlertTitle>Error!</AlertTitle>
                                                    <AlertDescription display='block'>
                                                    Error preparing contract write
                                                    </AlertDescription>
                                                </Box>
                                                </Alert>
                                            </Stack>
                                            :
                                            <Stack></Stack>
                                        }
                            { stakeError ? 
                                            <Stack>
                                                <Alert colorScheme={"#8b0000"} status="error">
                                                <AlertIcon />
                                                <Box flex='1'>
                                                    <AlertTitle>Error!</AlertTitle>
                                                    <AlertDescription display='block'>
                                                    ETH is not within the correct range
                                                    </AlertDescription>
                                                </Box>
                                                </Alert>
                                            </Stack>
                                            :
                                            <Stack></Stack>
                            }
                            {/*
                            <Button
                                    backgroundColor="#BB86FC"
                                    rightIcon={<IoMdCheckmarkCircle />}
                                    _hover={{bg: '#121212'}}
                                    _active={{bg: '#121212'}}
                                    onClick={test}
                                >
                                TEST
                            </Button>
                            */}       
                        </VStack>
                    </Flex>

                </Flex>
            </main>
        </div>
    )
}

export default Trivia