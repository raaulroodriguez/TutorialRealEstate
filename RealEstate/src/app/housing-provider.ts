import {HousingLocationInfo} from "./housinglocation";

export interface HousingProvider {

    getAllHousingLocations(): Promise<HousingLocationInfo[]>;
}
