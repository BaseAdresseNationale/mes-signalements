export enum APIAdressePropertyType {
  HOUSE_NUMBER = "housenumber",
  STREET = "street",
  LOCALITY = "locality",
}

export type APIAdresseResult = {
  features: {
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      label: string;
      citycode: string;
      context: string;
      city: string;
      name: string;
      postcode: string;
      score: number;
      id: string;
      type: APIAdressePropertyType;
      importance: number;
      street: string;
    };
  }[];
};
