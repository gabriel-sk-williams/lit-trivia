/* eslint-disable @next/next/no-img-element */

import { Grid, GridItem, Box, HStack, Stack, Text } from '@chakra-ui/layout'
import { useDisclosure, Link } from '@chakra-ui/react'
import { IoMdCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";


// export const RecordTable = (record: Array<boolean>) => {

export const RecordTable = (props: {record: boolean[]}) => {

  const defaultSize = 32;
  const temp = [false, true, true, true, false, false, true, true, true,];

  return (
    <Grid templateColumns='repeat(7, 1fr)' gap={6}>
      {props.record.map((item, i) =>(
        <GridItem key ={i}w='100%' h='100%'>
          {item
            ? <IoMdCheckmarkCircle font-size={defaultSize} color="#00ff00"/>
            : <IoIosCloseCircle font-size={defaultSize} color="#ff0000"/>
          }
        </GridItem>
        ))
      }


    </Grid>
  )
}

/*

*/

/*
  <GridItem w='100%' h='100%'>
    <IoMdCheckmarkCircle font-size={defaultSize} color="#00ff00"/>
  </GridItem>
  <GridItem w='100%' h='100%'>
  <IoMdCheckmarkCircle font-size={defaultSize} color="#00ff00"/>
  </GridItem>
  <GridItem w='100%' h='100%'>
  <IoIosCloseCircle font-size={defaultSize} color="#ff0000"/>
  </GridItem>
  <GridItem w='100%' h='100%'>
  <IoMdCheckmarkCircle font-size={defaultSize} color="#00ff00"/>
  </GridItem>
*/
