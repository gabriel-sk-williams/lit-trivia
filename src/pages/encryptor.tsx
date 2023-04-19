import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { NextPage } from 'next';
import { Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { IoMdCheckmarkCircle } from "react-icons/io";
import styles from '../styles/Home.module.css';

import * as LitNodeClient from "@lit-protocol/lit-node-client-nodejs";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { checkAndSignAuthMessage } from "@lit-protocol/auth-browser";
//import sphinx from '../abi/sphinx.json';

const client = new LitNodeClient.LitNodeClientNodeJs({
    litNetwork: "serrano",
    defaultAuthCallback: checkAndSignAuthMessage,
});

//const client = new LitJsSdk.LitNodeClient({});
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

const timeLock = [
    {
        contractAddress: "",
        standardContractType: "timestamp",
        chain: "ethereum",
        method: "eth_getBlockByNumber",
        parameters: ["latest"],
        returnValueTest: {
            comparator: ">=",
            value: "1651276942"
        },
    },
];

const isWallet = [
    {
        contractAddress: '',
        standardContractType: '',
        chain,
        method: '',
        parameters: [
        ':userAddress',
        ],
        returnValueTest: {
        comparator: '=',
        value: '0xdD7c46F6307887386cEd9A441f1BB5BfF6D6bDC7'
        }
    }
]

const Lit: NextPage = () => {

    const encryptJSON = async () => {

        await client.connect();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: "ethereum",});

        const questionArray = [];
        const keyArray = [];

        //const pairs = sphinx.trivia;
        const pairs = [["test question", "answer"]]

        for (let i=0;i<pairs.length;i++) {
            let [que, ans] = pairs[i];

            const { encryptedString: eq, symmetricKey: kq } = await LitJsSdk.encryptString(que);
            
            const eskq = await client.saveEncryptionKey({
                accessControlConditions: hasEth,
                symmetricKey: kq,
                authSig,
                chain,
            });

            const { encryptedString: ea, symmetricKey: ka } = await LitJsSdk.encryptString(ans);

            const eska = await client.saveEncryptionKey({
                accessControlConditions: hasEth,
                symmetricKey: ka,
                authSig,
                chain,
            });
            
            const eqBase = await LitJsSdk.blobToBase64String(eq);
            const eaBase = await LitJsSdk.blobToBase64String(ea);

            const kqBase = LitJsSdk.uint8arrayToString(eskq, "base16");
            const kaBase = LitJsSdk.uint8arrayToString(eska, "base16");

            const quaPair = [eqBase, eaBase];
            const keyPair = [kqBase, kaBase];

            questionArray.push(quaPair);
            keyArray.push(keyPair);
        }

        const encryptedJSON = { "trivia": questionArray };
        const encryptedKeys = { "trivia": keyArray };

        //fs.writeFileSync("practice_questions.json", JSON.stringify(encryptedJSON, null, 4));
        //fs.writeFileSync("practice_keys.json", JSON.stringify(encryptedKeys, null, 4));

        console.log(encryptedJSON);
        console.log(encryptedKeys);
    }
    
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Flex
                // width="50%"
                height="100%"
                direction="column"
                justifyContent="space-between"
                gap="3rem"
                >    
                    <div className={styles.buttonfont}>
                        <Button
                            backgroundColor="#0c741d"
                            rightIcon={<IoMdCheckmarkCircle />}
                            _hover={{bg: '#121212'}}
                            _active={{bg: '#121212'}}
                            onClick={encryptJSON}
                        >
                        ENCRYPT
                        </Button>
                    </div>
                </Flex>
            </main>
        </div>
    )
}

export default Lit