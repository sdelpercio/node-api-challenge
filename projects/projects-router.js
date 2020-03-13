const express = require('express');
const projectDb = require('../data/helpers/projectModel');

const router = express.Router();

// GET all projects
router.get('/', (req, res) => {
	// to do
});

// GET a single project
router.get('/:id', (req, res) => {
	// to do
});

// GET a project's actions
router.get('/:id/actions', (req, res) => {
	// to do
});

// POST a new action to a project
router.post('/:id/actions', (req, res) => {
	// to do
});

// POST a project
router.post('/', (req, res) => {
	// to do
});

// UPDATE a project
router.put('/:id', (req, res) => {
	// to do
});

// DELETE a project
router.delete('/:id', (req, res) => {
	// to do
});

// Project Middleware
function validateProjectId(req, res, next) {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({ error: 'Must include project ID in URL.' });
	} else {
		projectDb
			.get(id)
			.then(project => {
				if (project === undefined) {
					res.status(400).json({ error: 'Project does not exist.' });
				} else {
					next();
				}
			})
			.catch(err => {
				res.status(500).json({
					error: 'There was an issue with retrieving the project ID.',
					err
				});
			});
	}
}

function validateProject(req, res, next) {
	const body = req.body;
	const name = req.body.name;
	const desc = req.body.description;

	if (Object.keys(body).length === 0) {
		res.status(400).json({ error: 'Missing project data.' });
	} else if (!name) {
		res.status(400).json({ error: 'Missing required name field.' });
	} else if (!desc) {
		res.status(400).json({ error: 'Missing required description field.' });
	} else {
		next();
	}
}
function validateAction(req, res, next) {
	const body = req.body;
	const desc = req.body.description;
	const notes = req.body.notes;
	const projectId = req.body.project_id;

	if (Object.keys(body).length === 0) {
		res.status(400).json({ error: 'Missing action data.' });
	} else if (!notes) {
		res.status(400).json({ error: 'Missing required name field.' });
	} else if (!desc || desc.length > 128) {
		res
			.status(400)
			.json({
				error:
					'Missing required description field or description longer than 128 characters.'
			});
	} else if (!projectId) {
		res.status(400).json({ error: 'Must include project ID in request.' });
	} else {
		projectDb
			.get(projectId)
			.then(project => {
				if (project === undefined) {
					res.status(400).json({ error: 'Project does not exist.' });
				} else {
					next();
				}
			})
			.catch(err => {
				res.status(500).json({
					error: 'There was an issue with retrieving the project ID.',
					err
				});
			});
	}
}

module.exports = router;
