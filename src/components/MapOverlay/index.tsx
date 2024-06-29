import { Button, Flex, Icon } from "@chakra-ui/react";
import { BiCurrentLocation } from "react-icons/bi";
import Search from "../Search";
import type { LatLngTuple } from "leaflet";

const MapOverlay = ({
  flyToLocation: flyToLocation,
}: {
  flyToLocation: (location: LatLngTuple) => void;
}) => {
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
        bottom="50"
        right="50"
        zIndex={99}
        w="100vw"
        justifyContent="end"
      >
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
    </>
  );
};

export default MapOverlay;
