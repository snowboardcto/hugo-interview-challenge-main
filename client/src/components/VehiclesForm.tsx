import React, { useEffect, useState } from 'react';
import { Vehicle } from '../models/Vehicle';

interface VehiclesFormProps {
    vehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>; // Accept setVehicles as a prop
}

const VehiclesForm: React.FC<VehiclesFormProps> = ({ vehicles, setVehicles }) => {
    const [localVehicles, setLocalVehicles] = useState<Vehicle[]>([]);

    // Sync the local state with the props when the vehicles prop changes
    useEffect(() => {
        if (vehicles.length === 0) {
            setLocalVehicles([{ vin: '', year: '', make: '', model: '' }]); // Ensure at least one empty vehicle
            setVehicles([{ vin: '', year: '', make: '', model: '' }]); // Update parent state
        } else {
            setLocalVehicles(vehicles);
        }
    }, [vehicles, setVehicles]);

    const handleVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedVehicles = [...localVehicles];
        updatedVehicles[index] = { ...updatedVehicles[index], [e.target.name]: e.target.value };
        setLocalVehicles(updatedVehicles);
        setVehicles(updatedVehicles); // Update the parent state
    };

    const addVehicle = () => {
        const newVehicle: Vehicle = { vin: '', year: '', make: '', model: '' };
        setLocalVehicles([...localVehicles, newVehicle]);
        setVehicles([...localVehicles, newVehicle]); // Add a new vehicle and update parent state
    };

    const removeVehicle = (index: number) => {
        const updatedVehicles = localVehicles.filter((_, i) => i !== index);
        setLocalVehicles(updatedVehicles);
        setVehicles(updatedVehicles); // Remove the vehicle and update parent state
    };

    return (
        <div>
            <h2>Vehicles</h2>
            {localVehicles.map((vehicle, index) => (
                <div key={index}>
                    <h4>Vehicle {index + 1}</h4>
                    <input
                        type="text"
                        name="vin"
                        placeholder="VIN"
                        value={vehicle.vin}
                        onChange={(e) => handleVehicleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={vehicle.year}
                        onChange={(e) => handleVehicleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="make"
                        placeholder="Make"
                        value={vehicle.make}
                        onChange={(e) => handleVehicleChange(index, e)}
                    />
                    <input
                        type="text"
                        name="model"
                        placeholder="Model"
                        value={vehicle.model}
                        onChange={(e) => handleVehicleChange(index, e)}
                    />
                    {localVehicles.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeVehicle(index)}>
                            Remove Vehicle
                        </button>
                    )}
                </div>
            ))}
            {localVehicles.length < 3 && (
                <button type="button" className="add-btn" onClick={addVehicle}>
                    Add Vehicle
                </button>
            )}
        </div>
    );
};

export default VehiclesForm;
