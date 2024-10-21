import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import ApplicationForm from './components/ApplicationForm';
import VehiclesForm from './components/VehiclesForm';
import AdditionalPeopleForm from './components/AdditionalPeopleForm';
import { ApplicationData } from './models/ApplicationData';
import { Vehicle } from './models/Vehicle';
import { Person } from './models/Person';
import { fetchApplicationData, createApplication, saveApplicationData, submitApplication } from './services/apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Utility function to handle and show errors in a single line
const showErrorToast = (error: any) => {
    try {
        const formattedError = JSON.stringify(error?.response?.data || error, null, 2);
        toast.error(formattedError, { closeOnClick: true });
    } catch (e) {
        toast.error("An unexpected error occurred.", { closeOnClick: true });
    }
};

const App: React.FC = () => {
    const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([{ vin: '', year: undefined, make: '', model: '' }]);
    const [people, setPeople] = useState<Person[]>([]);

    const id = Number(useParams<{ id: string }>().id);
    const navigate = useNavigate();

    useEffect(() => {
        let creationInProgress = false;

        const loadApplication = async () => {
            try {
                if (id) {
                    const appData = await fetchApplicationData(id);
                    setApplicationData(appData);
                    setVehicles(appData.vehicles || []);
                    setPeople(appData.additionalPeople || []);
                } else if (!creationInProgress) {
                    creationInProgress = true;
                    const appData = await createApplication();
                    setApplicationData(appData);
                    setVehicles(appData.vehicles || []);
                    setPeople(appData.additionalPeople || []);
                    navigate(`/${appData.id}`);
                }
            } catch (error) {
                console.error("Failed to fetch or create application", error);
                showErrorToast(error);
            } finally {
                creationInProgress = false;
            }
        };

        loadApplication();

        return () => {
            creationInProgress = false; // Cleanup on unmount
        };
    }, [id, navigate]);

    const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApplicationData(prevData => prevData ? { ...prevData, [e.target.name]: e.target.value } : null);
    };

    const handleApplicationDateChange = (date: Date | null) => {
        if (date && applicationData) {
            setApplicationData(prevData => ({
                ...prevData!,
                dateOfBirth: date
            }));
        }
    };

    const handlePersonDateChange = (index: number, date: Date | null) => {
        const updatedPeople = [...people];
        updatedPeople[index] = { ...updatedPeople[index], dateOfBirth: date ? date : undefined};
        setPeople(updatedPeople);
    };

    const handleSave = async () => {
        if (applicationData) {
            try {
                applicationData.vehicles = vehicles;
                applicationData.additionalPeople = people;
                await saveApplicationData(applicationData.id, applicationData);
                toast.success("Application saved successfully");
                return true;
            } catch (error) {
                console.error("Save operation failed", error);
                showErrorToast(error);
                return false;
            }
        }
        return false;
    };
    
    const handleSubmit = async () => {
        if (applicationData) {
            try {
                const saveSuccess = await handleSave();
                if (saveSuccess) {
                    const result = await submitApplication(applicationData.id);
                    toast.success(`Application submitted successfully. Quoted Price: ${result.quotedPrice}`);
                }
            } catch (error) {
                console.error("Submit operation failed", error);
                showErrorToast(error);
            }
        }
    };

    if (!applicationData) return <div>Loading...</div>;

    return (
        <div>
            <ToastContainer />
            <h1>Insurance Application</h1>
            <form>
                <ApplicationForm
                    applicationData={applicationData}
                    onApplicationChange={handleApplicationChange}
                    onDateChange={handleApplicationDateChange}
                />
                <VehiclesForm vehicles={vehicles} setVehicles={setVehicles} />
                <AdditionalPeopleForm
                    people={people}
                    setPeople={setPeople}
                    onPersonDateChange={handlePersonDateChange}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button type="button" className="add-btn" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="add-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function AppWrapper() {
    return (
        <Router>
            <Routes>
                <Route path="/:id?" element={<App />} />
            </Routes>
        </Router>
    );
}
