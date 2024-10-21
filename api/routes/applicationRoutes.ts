import { Router, Request, Response } from 'express';
import { validateApplicationFields, validateIdParam } from '../middlewares/applicationValidators';
import { createApplication, getApplication, updateApplication, submitApplication } from '../controllers/applicationController';

const routes = Router();

// POST: Start a new insurance application (fields optional)
routes.post(
  '/',
  validateApplicationFields(true),
  async (req: Request, res: Response) => {
    try {
      const app = await createApplication(req.body);
      console.log(`Application created with ID: ${app.id}`);
      res.json({ 'id': app.id });
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({ error: `Failed to create application: ${(error as Error).message}` });
    }
  }
);

// GET: Retrieve an existing insurance application by ID
routes.get(
  '/:id',
  validateIdParam,
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
      const app = await getApplication(id);
      if (app) {
        console.log(`Application retrieved with ID: ${id}`);
        res.json(app);
      } else {
        console.warn(`Application with ID: ${id} not found`);
        res.status(404).json({ error: 'Application not found' });
      }
    } catch (error) {
      console.error(`Error retrieving application with ID: ${id}`, error);
      res.status(500).json({ error: `Failed to retrieve application: ${(error as Error).message}` });
    }
  }
);

// PUT: Update an existing insurance application (fields optional)
routes.put(
  '/:id',
  validateIdParam,
  validateApplicationFields(true),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
      const app = await updateApplication(id, req.body);
      console.log(`Application with ID: ${id} updated successfully`);
      res.json(app);
    } catch (error) {
      console.error(`Error updating application with ID: ${id}`, error);
      res.status(500).json({ error: `Failed to update application: ${(error as Error).message}` });
    }
  }
);

// POST: Submit the insurance application (all fields required)
routes.post(
  '/:id/submit',
  validateIdParam,
  validateApplicationFields(false),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await submitApplication(id);
      console.log(`Application with ID: ${id} submitted successfully`);
      res.json(result);
    } catch (error) {
      console.error(`Error submitting application with ID: ${id}`, error);
      res.status(500).json({ error: `Failed to submit application: ${(error as Error).message}` });
    }
  }
);

export default routes;
