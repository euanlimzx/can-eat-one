import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
if (!GOOGLE_MAPS_API_KEY) {
    console.log("No gmaps API key, please set it")
}
export const searchRouter = createTRPCRouter({
    getLocation: publicProcedure
        .input(z.object({ locationQuery: z.string() }))
        .query(async ({ input }) => {
            try {
                const response = await client.textSearch({
                    params: {
                        query: input.locationQuery,
                        key: GOOGLE_MAPS_API_KEY
                    },
                    timeout: 1000,
                });
                return response.data.results;
                // if (results.length === 0) {
                //     return { error: "No results found" };
                // } else if (results.length === 1) {
                //     const place = results[0];
                //     return {
                //         location: place!.formatted_address,
                //         latitude: place!.geometry!.location.lat,
                //         longitude: place!.geometry!.location.lng,
                //         placeId: place!.place_id,
                //         name: place!.name,
                //     };
                // } else {
                //     return {
                //         locations: results.map(place => ({
                //             name: place.name,
                //             latitude: place!.geometry!.location.lat,
                //             longitude: place!.geometry!.location.lng,
                //             address: place.formatted_address,
                //             placeId: place.place_id,
                //         })),
                //     };
                // }
            } catch (error) {
                console.error("Error in Google Maps API call:", error);
                return { error: "An error occurred while searching for locations" };
            }
    }),
});
  