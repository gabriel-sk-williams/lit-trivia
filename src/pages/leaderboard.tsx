import React, { useState, useEffect, KeyboardEvent } from 'react';
import styles from '../styles/Home.module.css';
import type { NextPage } from 'next';
import { Input, Button, Box, Link, Image, Text, Flex, HStack, VStack } from '@chakra-ui/react';
import { Stack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

//var hash = require('hash.js');

import {
    useContractRead,
    useBalance,
   } from 'wagmi';

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

    const readABI = {
        "inputs": [],
        "name": "getResults",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    };

const Leaderboard: NextPage = () => {

    //const contractAddress = process.env.NEXT_PUBLIC_TEST_CONTRACT!;
    const contractAddress = "68C64B65f5960E28BeD8eaf364D37c2e440f8fa0";

    const [board, setBoard] = useState<Array<object>>([]);

    const { data, isLoading, error: readError } = useContractRead(
        {
          address: `0x${contractAddress}`,
          abi: [ readABI ],
          functionName: 'getResults',
          cacheOnBlock: true,
        })
    
    // sees balance on contract
    const { data: balance, isError: balanceError, isLoading: balanceLoading } = useBalance({
        address: `0x${contractAddress}`,
    })

    const isJSON = (val: string) => {
        try {
            JSON.parse(val);
        } catch (e) {
            return false
        }
        return true
    }

    const isValid = (string: string) => {
        const json = JSON.parse(string);

        return (
            json.hasOwnProperty("address") &&
            json.hasOwnProperty("score") &&
            json.hasOwnProperty("stake") &&
            json.hasOwnProperty("timestamp") &&
            typeof json['score'] === "number" &&
            typeof json['stake'] === "string" &&
            typeof json['timestamp'] === "number"
        );
    }

    useEffect(() => {
        if (Array.isArray(data)) {
            const fList = data.filter(isJSON)
            const vList = fList.filter(isValid)
            const jlist = vList.map(item => JSON.parse(item))
            setBoard(jlist);
        } else {
            setBoard([])
        }
    }, [data])
    

    const logData = () => {
        console.log(data);
        //console.log(board);
    }

    const leaders = [
        {address: '0x863478', score: 12, stake: 0.1, timestamp: 510003 },
        {address: '0x02a6ff', score: 5, stake: 0.01, timestamp: 5100548 },
        {address: '0xce9391', score: 5, stake: 0.01, timestamp: 5100725 },
        {address: '0xce9391', score: 5, stake: 0.01, timestamp: 5100724 },
        {address: '0x8bb5ca', score: 19, stake: 0.011, timestamp: 5100 },
        {address: '0x055c36', score: 22, stake: 0.01, timestamp: 5100975 },
        {address: '0xd54cf0', score: 22, stake: 0.012, timestamp: 5101113 },
        {address: '0xf46b3e', score: 26, stake: 0.01, timestamp: 510124},
        {address: '0x73ca2d', score: 25, stake: 0.01, timestamp: 5101368 },
        {address: '0xb11183', score: 19, stake: 0.013, timestamp: 510000 },
        {address: '0x69f626', score: 11, stake: 0.016, timestamp: 510162 },
    ]

    // score -> stake -> earliest timestamp
    const sorted = (arr: any) : Array<object> => {
        return arr.sort((a:any, b:any) => {
            if (a.score > b.score) return -1
            if (a.score < b.score) return 1
            if (a.stake > b.stake) return -1
            if (a.stake < b.stake) return 1
            if (a.timestamp > b.timestamp) return 1
            if (a.timestamp < b.timestamp) return -1
            return 0
        })
    }

    const row = (entry: any, index: number) => {
        return (
            <Tr>   
                <Td>{index+1}</Td>
                <Td>{entry.address.slice(0,8)}</Td>
                <Td isNumeric>{entry.score}</Td>
                <Td isNumeric>{entry.stake}</Td>
                <Td>{entry.timestamp.toString().slice(0,10)}</Td>
            </Tr>
        );
    }
    
    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <Flex
                    height="100%"
                    direction="column"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="1rem"
                >   
                    <Text fontSize={24}> you will submit </Text>
                    <Image src='/Logo_dithered.gif' alt='Sphinx' width={'45%'} height={'45%'} />

                    <Link href='/trivia'>
                        <Button
                            backgroundColor="#BB86FC"
                            _hover={{bg: '#121212'}}
                            _active={{bg: '#121212'}}
                        >
                        AGAIN
                        </Button>
                    </Link>

                    {/*
                    <Button
                        backgroundColor="#BB86FC"
                        _hover={{bg: '#121212'}}
                        _active={{bg: '#121212'}}
                        onClick={logData}
                    >
                    TEST
                    </Button>
                    */}

                    { readError ? 
                        <Stack>
                            <Alert colorScheme={"#8b0000"} status="error">
                            <AlertIcon />
                            <Box flex='1'>
                                <AlertTitle>Error!</AlertTitle>
                                <AlertDescription display='block'>
                                Contract Data is missing
                                </AlertDescription>
                            </Box>
                            </Alert>
                        </Stack>
                        :
                        <Stack></Stack>
                    }

                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>get smarter</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>rank</Th>
                                    <Th>address</Th>
                                    <Th isNumeric>score</Th>
                                    <Th isNumeric>stake</Th>
                                    <Th isNumeric>timestamp</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {sorted(board).map((entry, index) => row(entry, index))}
                            </Tbody>

                        </Table>
                    </TableContainer>
                </Flex>
            </main>
        </div>
    )
}

export default Leaderboard