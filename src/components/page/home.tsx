'use client'
import CardHome from "@/components/cards/card_home";
import { Flex, Image } from "@chakra-ui/react";
import { JWTPayload } from "jose";

interface HomeProps {
    card : JWTPayload | null
}

export default function Home({card}:HomeProps) {
    return (
        <Flex
        w={"full"}
        h={{ base: "full", lg: "full" }}
        flexDir={'column'}
        alignItems={'center'}
        p={2}
        gap={2}
        >
          <CardHome data={card}/>

                      <Image
                      h={{base: '65%', lg:'50%'}}
                      w={{base:'100%', lg:'40%'}}
                        src="/NFEB.svg"
                        alt="Logo"
                        objectFit="cover"
                          />
</Flex>
    )
}