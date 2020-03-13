const express = require('express');
const projectDb = require('../data/helpers/projectModel');
const actionDb = require('../data/helpers/actionModel');

const router = express.Router();

// GET all projects
router.get('/', (req, res) => {
	projectDb
		.get()
		.then(projects => {
			res.status(200).json(projects);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue retrieving the projects.', err });
		});
}); // done

// GET a single project
router.get('/:id', validateProjectId, (req, res) => {
	const { id } = req.params;
	projectDb
		.get(id)
		.then(project => {
			res.status(200).json(project);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue retrieving the project', err });
		});
}); // done

// GET a project's actions
router.get('/:id/actions', validateProjectId, (req, res) => {
	const { id } = req.params;
	projectDb
		.getProjectActions(id)
		.then(actions => {
			res.status(200).json(actions);
		})
		.catch(err => {
			res.status(500).json({
				error: "There was an issue retrieving the project's actions",
				err
			});
		});
}); // done

// POST a new action to a project
router.post('/:id/actions', validateAction, (req, res) => {
	const actionInfo = req.body;
	actionDb
		.insert(actionInfo)
		.then(newAction => {
			res.status(201).json(newAction);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue creating the action.', err });
		});
}); // done

// POST a project
router.post('/', validateProject, (req, res) => {
	const projectInfo = req.body;
	projectDb
		.insert(projectInfo)
		.then(newProject => {
			res.status(201).json(newProject);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue creating the project', err });
		});
}); // done

// UPDATE a project
router.put('/:id', validateProjectId, validateProject, (req, res) => {
	// to do
});

// DELETE a project
router.delete('/:id', validateProjectId, (req, res) => {
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
				if (project === null) {
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
		res.status(400).json({ error: 'Missing required notes field.' });
	} else if (!desc || desc.length > 128) {
		res.status(400).json({
			error:
				'Missing required description field or description longer than 128 characters.'
		});
	} else if (!projectId) {
		res.status(400).json({ error: 'Must include project ID in request.' });
	} else {
		projectDb
			.get(projectId)
			.then(project => {
				if (project === null) {
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
