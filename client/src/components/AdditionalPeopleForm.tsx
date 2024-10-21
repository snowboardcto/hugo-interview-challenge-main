import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Person } from '../models/Person';

interface AdditionalPeopleFormProps {
    people: Person[];
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    onPersonDateChange: (index: number, date: Date | null) => void;  
}

const AdditionalPeopleForm: React.FC<AdditionalPeopleFormProps> = ({ people, setPeople }) => {
    const handlePersonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedPeople = [...people];
        updatedPeople[index] = { ...updatedPeople[index], [e.target.name]: e.target.value };
        setPeople(updatedPeople);
    };

    const handleDateChange = (index: number, date: Date | null) => {
        const updatedPeople = [...people];
        updatedPeople[index] = { ...updatedPeople[index], dateOfBirth: date ? date : undefined };
        setPeople(updatedPeople);
    };

    const addPerson = () => {
        setPeople([...people, { firstName: '', lastName: '', dateOfBirth: undefined, relationship: 'Spouse' }]);
    };

    const removePerson = (index: number) => {
        setPeople(people.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2>Additional People</h2>

            {people.length > 0 && people.map((person, index) => (
                <div key={index}>
                    <h4>Person {index + 1}</h4>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={person.firstName}
                        onChange={(e) => handlePersonChange(index, e)}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={person.lastName}
                        onChange={(e) => handlePersonChange(index, e)}
                    />
                    <DatePicker
                        selected={person.dateOfBirth ? new Date(person.dateOfBirth) : null}
                        onChange={(date) => handleDateChange(index, date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select Date of Birth"
                    />
                    <select
                        name="relationship"
                        value={person.relationship}
                        onChange={(e) => handlePersonChange(index, e)}
                    >
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Parent">Parent</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="button" className="remove-btn" onClick={() => removePerson(index)}>
                        Remove Person
                    </button>
                </div>
            ))}

            <button type="button" className="add-btn" onClick={addPerson}>
                Add Person
            </button>
        </div>
    );
};

export default AdditionalPeopleForm;
