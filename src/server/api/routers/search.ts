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
                        key: GOOGLE_MAPS_API_KEY,
                        region: "sg"
                    },
                    timeout: 1000,
                });
                return response.data.results;
            } catch (error) {
                console.error("Error in Google Maps API call:", error);
                return { error: "An error occurred while searching for locations" };
            }
    }),
});
  