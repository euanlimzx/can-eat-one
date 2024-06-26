import React, { useState } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { api } from "~/utils/api";

const SearchComponent = () => {
  const [searchedLocation, setSearchedLocation] = useState("");
  const searchLocationQuery = api.search.getLocation.useQuery(
    { locationQuery: searchedLocation },
    { enabled: false }
  );

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const results = await searchLocationQuery.refetch();
      console.log(results.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <InputGroup>
        <Input
          placeholder="Search location..."
          variant="outline"
          bg="white"
          value={searchedLocation}
          onChange={(event) => setSearchedLocation(event.target.value)}
        />
        <InputRightElement pointerEvents="none">
          <Search2Icon />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default SearchComponent;
