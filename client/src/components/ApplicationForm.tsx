import React, { useEffect, useState } from 'react';
import { ApplicationData } from '../models/ApplicationData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ApplicationFormProps {
    applicationData: ApplicationData;
    onApplicationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange: (date: Date | null) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ applicationData, onApplicationChange, onDateChange }) => {
    const [localData, setLocalData] = useState<ApplicationData>(applicationData);

    useEffect(() => {
        setLocalData(applicationData);
    }, [applicationData]);

    return (
        <div>
            <h2>Applicant Information</h2>
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={localData.firstName}
                onChange={onApplicationChange}
            />
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={localData.lastName}
                onChange={onApplicationChange}
            />
            <DatePicker
                selected={localData.dateOfBirth ? new Date(localData.dateOfBirth) : null}
                onChange={(date: Date | null) => onDateChange(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date of Birth"
            />
            <input
                type="text"
                name="street"
                placeholder="Street"
                value={localData.street}
                onChange={onApplicationChange}
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={localData.city}
                onChange={onApplicationChange}
            />
            <input
                type="text"
                name="state"
                placeholder="State"
                value={localData.state}
                onChange={onApplicationChange}
            />
            <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={localData.zipCode}
                onChange={onApplicationChange}
            />
        </div>
    );
};

export default ApplicationForm;
