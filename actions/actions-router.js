const express = require('express');
const actionDb = require('../data/helpers/actionModel');
const projectDb = require('../data/helpers/projectModel');

const router = express.Router();

// GET all actions
router.get('/', (req, res) => {
	actionDb
		.get()
		.then(actions => {
			res.status(200).json(actions);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue retrieving the actions', err });
		});
}); // done

// GET a single action
router.get('/:id', validateActionId, (req, res) => {
	const { id } = req.params;

	actionDb
		.get(id)
		.then(action => {
			res.status(200).json(action);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue retrieving the action', err });
		});
}); // done

// UPDATE an action
router.put('/:id', validateActionId, validateAction, (req, res) => {
	const actionInfo = req.body;
	const { id } = req.params;
	actionDb
		.update(id, actionInfo)
		.then(updatedAction => {
			res.status(201).json(updatedAction);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue updating the action', err });
		});
}); // done

// DELETE an action
router.delete('/:id', validateActionId, (req, res) => {
	const { id } = req.params;

	actionDb
		.remove(id)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The action has been deleted' });
			} else {
				res.status(404).json({ message: 'The action could not be found' });
			}
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an issue deleting the action.', err });
		});
}); // done

// action middleware
function validateActionId(req, res, next) {
	const id = req.params.id;

	if (!id) {
		res.status(400).json({ error: 'Must include action ID in URL.' });
	} else {
		actionDb
			.get(id)
			.then(action => {
				if (action === null) {
					res.status(400).json({ error: 'Action does not exist.' });
				} else {
					next();
				}
			})
			.catch(err => {
				res.status(500).json({
					error: 'There was an issue with retrieving the action ID.',
					err
				});
			});
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
