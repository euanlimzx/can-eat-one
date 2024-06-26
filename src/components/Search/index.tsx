import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Search2Icon, SmallCloseIcon } from "@chakra-ui/icons";
import type { LatLngTuple } from "leaflet";
import { api } from "~/utils/api";
import type { PlaceData } from "@googlemaps/google-maps-services-js";

const SearchComponent = ({
  flyToLocation,
}: {
  flyToLocation: (location: LatLngTuple) => void;
}) => {
  const [searchedLocation, setSearchedLocation] = useState("");
  const [searchResults, setSearchResults] = useState<Partial<PlaceData>[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const searchLocationQuery = api.search.getLocation.useQuery(
    { locationQuery: searchedLocation },
    { enabled: false }
  );
  const resetSearch = ({ clearBar = true }: { clearBar?: boolean }) => {
    setSearchResults([]);
    setShowSearchResults(false);
    if (clearBar) {
      setSearchedLocation("");
    }
  };

  useEffect(() => {
    resetSearch({ clearBar: false });
  }, [searchedLocation]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoadingResults(true)
    try {
      const result = await searchLocationQuery.refetch();
      // Check if the result has a data property and is an array
      if (result && Array.isArray(result.data)) {
        setSearchResults(result.data);
        setShowSearchResults(true)
      } else {
        throw Error("Incorrect results retured by Google")
    }
    } catch (error) {
      setSearchResults([]);
      console.error("Search failed:", error);
    }
    setIsLoadingResults(false)
  };

  const handleSelect = (location: { lat: number; lng: number }) => {
    resetSearch({});
    flyToLocation([location.lat, location.lng]);
  };

  return (
    <Box
      borderRadius="0.5rem"
      bg="white"
      w={{ base: "90vw", sm: "70vw", md: "50vw" }}
    >
      <form onSubmit={handleSearch}>
        <InputGroup shadow="lg">
          <InputLeftElement pointerEvents="none">
            <Search2Icon />
          </InputLeftElement>
          <Box cursor="pointer" onClick={() => resetSearch({})}>
            <InputRightElement onClick={() => resetSearch({})}>
              {
                isLoadingResults? <Spinner size="sm"/> :  <SmallCloseIcon />
              }
             </InputRightElement>
          </Box>
          <Input
            w="100%"
            placeholder="Where are you headed?"
            variant="outline"
            bg="white"
            borderRadius="0.5rem"
            borderBottomRadius={showSearchResults ? "0rem" : "0.5rem"}
            value={searchedLocation}
            onChange={(event) => setSearchedLocation(event.target.value)}
          />
        </InputGroup>
      </form>
      {showSearchResults && (
        <Box maxH="50vh" overflowY="auto">
          {searchResults.length > 0 ? (
            searchResults
              .filter((result) => result.geometry)
              .map((result) => (
                <Flex
                  key={result.place_id} // It's a good practice to use a key when rendering lists
                  alignItems="start"
                  justifyContent="center"
                  flexDir="column"
                  h="4rem"
                  px="1rem"
                  cursor="pointer"
                  _hover={{ bg: "#f7f8f8" }}
                  onClick={() => handleSelect(result.geometry!.location)}
                >
                  <Text noOfLines={1} fontSize="sm">
                    {result.name}
                  </Text>
                  <Text noOfLines={1} color="grey" fontSize="sm">
                    &nbsp;{result.formatted_address}
                  </Text>
                </Flex>
              ))
          ) : (
            <Flex
              alignItems="center"
              h="2.5rem"
              pl="2rem"
              _hover={{ bg: "#f7f8f8" }}
            >
              <Text fontSize="sm">No results found</Text>{" "}
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchComponent;
