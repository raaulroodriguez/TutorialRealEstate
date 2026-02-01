export interface HousingLocationInfo {
    id: number;
    name: string;
    city: string;
    state: string;
    photo: string;
    availableUnits: number;
    wifi: boolean;
    laundry: boolean;
    coordinate:
        {
            latitude: number;
            longitude: number;
        }[];
    price: string;
    available: boolean;
}