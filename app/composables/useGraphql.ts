import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://countries.trevorblades.com/graphql");

export interface Country {
    code: string;
    name: string;
    emoji: string;
    continent: { name: string };
}

export interface CountryDetail {
    code: string;
    name: string;
    emoji: string;
    capital: string | null;
    currency: string | null;
    languages: { name: string }[];
    continent: { name: string; countries: Country[] };
}

export interface Continent {
    code: string;
    name: string;
}

export function useGraphql() {
    async function getCountries(): Promise<Country[]> {
        const query = gql`
            query {
                countries {
                    code
                    name
                    emoji
                    continent {
                        name
                    }
                }
            }
        `;
        const data = await client.request<{ countries: Country[] }>(query);
        return data.countries;
    }

    async function getContinents(): Promise<Continent[]> {
        const query = gql`
            query {
                continents {
                    code
                    name
                }
            }
        `;
        const data = await client.request<{ continents: Continent[] }>(query);
        return data.continents;
    }

    async function getCountryByCode(code: string): Promise<CountryDetail> {
        const query = gql`
            query GetCountry($code: ID!) {
                country(code: $code) {
                    code
                    name
                    emoji
                    capital
                    currency
                    languages {
                        name
                    }
                    continent {
                        name
                        countries {
                            code
                            name
                            emoji
                            continent {
                                name
                            }
                        }
                    }
                }
            }
        `;
        const data = await client.request<{ country: CountryDetail }>(query, { code });
        return data.country;
    }

    return { getCountries, getContinents, getCountryByCode };
}
