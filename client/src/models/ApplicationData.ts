import { Vehicle } from "../models/Vehicle"
import { Person } from "../models/Person"

export interface ApplicationData {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    street: string;
    city: string;
    state: string;
    zipCode?: number;
    vehicles: Vehicle[];
    additionalPeople: Person[];
}