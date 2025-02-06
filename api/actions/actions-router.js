const express = require('express')
const Actions = require('./actions-model.js')

const router = express.Router()

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving actions",
            })
        })
})
router.get('/:id', (req, res) => {
    const { id } = req.params
    Actions.get(id)
        .then(action => {
            if (action) {
                res.status(200).json(action)
            } else {
                res.status(404).json({
                    message: "Acion not found",
                })
            }
        }) 
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving action",
            })
        })
})
router.post('/', (req, res) => {
    const newAction = req.body
    if (!newAction.project_id || !newAction.description || !newAction.notes) {
        return res.status(400).json({ 
            message: 'Project ID, description, and notes are required', 
        })
    }
    Actions.get(newAction.project_id)
        .then(project => {
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                })
            }
            Actions.insert(newAction)
                .then(action => {
                    res.status(201).json(action)
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Error creating action",
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                message: "Error checking project existence",
            })
        })
})
router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    if (!changes.description || !changes.notes) {
        return res.status(400).json({
            message: "Description and notes are required",
        })
    }
    Actions.update(id, changes)
        .then(updatedAction => {
            if (updatedAction) {
                res.status(200).json(updatedAction)
            } else {
                res.status(404).json({
                    message: "Action not found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating action",
            })
        })
})
router.delete('/:id', (req, res) => {
    const { id } = req.params
    Actions.remove(id) 
        .then(deleted => {
            if (deleted) {
                res.status(204).end()
            } else {
                res.status(404).json({
                    message: "Action not found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error deleting action",
            })
        })
})

module.exports = router