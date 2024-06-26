import { Search2Icon } from "@chakra-ui/icons"
import { InputGroup, InputRightElement, Input } from "@chakra-ui/react"
import { useState } from "react"
import { api } from "~/utils/api"

const Search = () => {
    const [searchedLocation, setSearchedLocation] = useState<string>("")
    const searchLocationQuery = api.searchLocation.getLocation.useQuery(
      {locationQuery: searchedLocation},
      {enabled: false}
    )

    // const handleInputSubmit = async (event: KeyboardEvent): Promise<void> => { // yes I know
    //     if (event.key === 'Enter') {
    //       const results = await searchLocationQuery.refetch()
    //       console.log(results.data)
    //     }
    //   }
    
    return (
        <InputGroup>
        <Input 
          placeholder="Search location..."
          variant="outline"
          bg='white'
          onChange={
            (event) => setSearchedLocation(event?.target.value)
          }
        />
                <InputRightElement pointerEvents='none'>
          <Search2Icon/>
        </InputRightElement>
      </InputGroup>
    )
}

export default Search