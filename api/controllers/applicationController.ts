import db from '../db';

// Create a new application with optional fields, handling vehicles and people
export async function createApplication(data: any) {
    const app = await db.application.create({
        data: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth : '',
            street: data.street || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || undefined,
            vehicles: {
                create: data.vehicles?.map((vehicle: any) => ({
                    vin: vehicle.vin,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model,
                })) || [],
            },
            additionalPeople: {
                create: data.additionalPeople?.map((person: any) => ({
                    firstName: person.firstName,
                    lastName: person.lastName,
                    dateOfBirth: person.dateOfBirth ? person.dateOfBirth : '',
                    relationship: person.relationship,
                })) || [],
            }
        }
    });

    return app;
}

// Update an existing application (partial updates allowed)
export async function updateApplication(id: number, data: any) {
    const app = await db.application.update({
        where: { id },
        data: {
            firstName: data.firstName !== undefined ? data.firstName : undefined,
            lastName: data.lastName !== undefined ? data.lastName : undefined,
            dateOfBirth: data.dateOfBirth !== undefined ? data.dateOfBirth : '',
            street: data.street !== undefined ? data.street : undefined,
            city: data.city !== undefined ? data.city : undefined,
            state: data.state !== undefined ? data.state : undefined,
            zipCode: data.zipCode !== undefined ? Number(data.zipCode) : undefined,
            vehicles: data.vehicles
                ? {
                      deleteMany: {}, // Clear previous vehicles
                      create: data.vehicles.map((vehicle: any) => ({
                          vin: vehicle.vin,
                          year: Number(vehicle.year),
                          make: vehicle.make,
                          model: vehicle.model,
                      })),
                  }
                : undefined,
            additionalPeople: data.additionalPeople
                ? {
                      deleteMany: {}, // Clear previous people
                      create: data.additionalPeople.map((person: any) => ({
                          firstName: person.firstName,
                          lastName: person.lastName,
                          dateOfBirth: person.dateOfBirth ? person.dateOfBirth : '',
                          relationship: person.relationship,
                      })),
                  }
                : undefined,
        },
    });

    return app;
}

// Fetch a single application by its ID
export async function getApplication(id: number) {
    const app = await db.application.findUnique({
        where: { id },
        include: {
            vehicles: true,
            additionalPeople: true,
        },
    });

    if (!app) {
        throw new Error('Application not found');
    }

    return app;
}

export async function submitApplication(id: number) {
    const app = await db.application.findUnique({
        where: { id },
        include: {
            vehicles: true,
            additionalPeople: true,
        }
    });
    if (!app) {
        throw new Error('Application not found');
    }
    if (
        !app.firstName ||
        !app.lastName ||
        !app.dateOfBirth ||
        !app.street ||
        !app.city ||
        !app.state ||
        !app.zipCode ||
        app.vehicles.length === 0
    ) {
        throw new Error('Incomplete application');
    }
    for (const vehicle of app.vehicles) {
        if (!vehicle.vin || !vehicle.year || !vehicle.make || !vehicle.model) {
            throw new Error('Incomplete vehicle information');
        }
    }
    for (const person of app.additionalPeople) {
        if (!person.firstName || !person.lastName || !person.dateOfBirth || !person.relationship) {
            throw new Error('Incomplete additional person information');
        }
    }
    return {
        message: 'Application submitted successfully',
        applicationId: app.id,
        quotedPrice: Math.floor(Math.random() * 1000) + 500,
    };
}