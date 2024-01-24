import type { NextPage } from "next";
import { Box, Button, Container, Flex, Input, SimpleGrid, Stack, Text, Image } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { HERO_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import LotteryStatus from "../components/Status";
import { ethers } from "ethers";
import PrizeNFT from "../components/PrizeNFT";
import { useState } from "react";
import CurrentEntries from "../components/CurrentEntries";
import RaffleWinner from "../components/RaffleWinner";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract
  } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const {
    data: lotteryStatus
  } = useContractRead(contract, "lotteryStatus");

  const {
    data: ticketCost,
    isLoading: ticketCostLoading
  } = useContractRead(contract, "ticketCost");
  const ticketCostInEther = ticketCost ? ethers.utils.formatEther(ticketCost) : "0";

  const {
    data: totalEntries,
    isLoading: totalEntriesLoading
  } = useContractRead(contract, "totalEntries");

  const [ticketAmount, setTicketAmount] = useState(1);
  const ticketCostSubmit = parseFloat(ticketCostInEther) * ticketAmount;

  function increaseTicketAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseTicketAmount() {
    if (ticketAmount > 1) {
      setTicketAmount(ticketAmount - 1);
    }
  }

  return (
    <Flex direction="column" position="relative">
      <Image
        src="/savinglogo.png"
        alt="Logo"
        boxSize="95px"
        position="absolute"
        zIndex="2"
        top="-130px"
        left="10px"
      />
      <Container maxW={"1480px"}>
        <SimpleGrid columns={2} spacing={4} minH={"60vh"}>
          <Flex justifyContent={"center"} alignItems={"center"}>
            {lotteryStatus ? (
              <PrizeNFT />
            ) : (
              <MediaRenderer
                src= "/cajaregalonft.jpg"
                width="75%"
                height="75%"
              />
            )}
          </Flex>
          <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
            <Stack spacing={10}>
              <Box>
                <Text fontSize={"5xl"} fontWeight={"bold"}>Saving nft box game</Text>
                <Text fontSize={"2xl"} fontWeight={"bold"}>Buy a ticket to win the NFT!</Text>
              </Box>
              
              <Text fontSize={"xl"}>Buy entries for a chance to win the NFT! Winner will be selected and transferred the NFT. The more entries the higher chance you have of winning the prize.
              When the game status starts, we compete for the nft, you buy your tickets, when the game status closes, then nft box selects a random winner and sends them the nft.
              Remember that: 1- You can exchange this nft for a percentage of the total raised. 2- Stake with official nft. 3- Trading in market place</Text>
              
              <LotteryStatus status={lotteryStatus}/>
              {!ticketCostLoading && (
                <Text fontSize={"2xl"} fontWeight={"bold"}>Cost Per Ticket: {ticketCostInEther} EXP</Text>                
              )}
              {address ? (
                <Flex flexDirection={"row"}>
                  <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
  <Button onClick={decreaseTicketAmount}>-</Button>
  <Input
  value={ticketAmount}
  type="number" // Change the type to "number"
  onChange={(e) => setTicketAmount(parseInt(e.target.value))}
  textAlign="center"
  mx={2}
  style={{ color: "black" }}
/>
  <Button onClick={increaseTicketAmount}>+</Button>
</Flex>
                  
                  <Web3Button
  contractAddress={LOTTERY_CONTRACT_ADDRESS}
  action={(contract) =>
    contract.call(
      "buyTicket",
      [ticketAmount],
      {
        value: ethers.utils.parseEther(ticketCostSubmit.toString()),
      }
    )
  }
  isDisabled={!lotteryStatus}
  style={{ color: "black" }} // Add this style property
>
  Buy Ticket(s)
</Web3Button>
                </Flex>
              ) : (
                <Text>Connect wallet to buy ticket.</Text>
              )}
              {!totalEntriesLoading && (
                <Text>Total Entries: {totalEntries.toString()}</Text>
              )}
            </Stack>
          </Flex>
        </SimpleGrid>
        <Stack mt={"40px"} textAlign={"center"}>
          <Text fontSize={"xl"}>Current Participants:</Text>
          <CurrentEntries/>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Home;
