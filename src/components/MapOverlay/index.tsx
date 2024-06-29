import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Text,
  Icon,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BiCurrentLocation } from "react-icons/bi";
import { FaAngleDown, FaMapPin } from "react-icons/fa";
import Search from "../Search";
import type { LatLngTuple } from "leaflet";

const MapOverlay = ({
  flyToLocation,
  homePosition,
}: {
  flyToLocation: (location: LatLngTuple) => void;
  homePosition: LatLngTuple;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex
        position="fixed"
        top="50"
        zIndex={99}
        w="100vw"
        justifyContent="center"
      >
        <Search flyToLocation={flyToLocation} />
      </Flex>
      <Flex
        position="fixed"
        bottom="8"
        right="3"
        zIndex={99}
        flexDirection="column"
      >
        <VStack>
          <Flex justifyContent="end" w="100%">
            <Button
              variant="solid"
              colorScheme="red"
              boxShadow="lg"
              h="3rem"
              w="3rem"
              onClick={() => flyToLocation(homePosition)}
            >
              <Icon as={BiCurrentLocation} boxSize="2rem" />
            </Button>
          </Flex>

          <Button
            variant="outline"
            colorScheme="red"
            bg="white"
            boxShadow="lg"
            size="lg"
            onClick={onOpen}
          >
            SHOW ME GOOD FOOD!!
          </Button>
          <Drawer placement="bottom" onClose={onClose} isOpen={isOpen} trapFocus={false}>
            {/* <DrawerOverlay /> */}
            <DrawerContent h="40vh" borderRadius="0.5rem">
              <DrawerHeader borderBottomWidth="1px" onClick={onClose} _hover={{bg:"gray.50"}} cursor="pointer">
                <Flex justifyContent="space-between">
                  <Flex alignItems="center">
                    📍
                    &nbsp;Nearest to you
                  </Flex>
                  <Flex alignItems="center">
                    <Icon as={FaAngleDown} />
                  </Flex>
                </Flex>
              </DrawerHeader>
              <DrawerBody></DrawerBody>
            </DrawerContent>
          </Drawer>
        </VStack>
      </Flex>
    </>
  );
};

export default MapOverlay;
