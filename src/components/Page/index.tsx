import { Flex } from '@chakra-ui/layout'
import { Header } from '../Header'

const Page = (props: any) => {
  const { children } = props;
  return (
    <div>
      <Flex direction="column" backgroundColor="#000000">
        <Header />
        <main>{children}</main>
        <Footer />
      </Flex>
    </div>
  )
}

const Footer = () => {
  return <Flex height="10%"></Flex>
}

export default Page;

