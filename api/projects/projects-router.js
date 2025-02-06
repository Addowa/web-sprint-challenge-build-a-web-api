const express = require('express')
const Projects = require('./projects-model.js')

const router = express.Router()

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving projects",
            })
        })
})
router.get('/:id', (req, res) => {
    const { id } = req.params
    Projects.get(id)
        .then(project => {
            if (project) {
                res.status(200).json(project)
            } else {
                res.status(404).json({ 
                    message: "Project not found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving projects",
            })
        })
})
router.post('/', (req, res) => {
    const newProject = req.body
    if (!newProject.name || !newProject.description) {
        return res.status(400).json({
            message: "Name and description required",
        })
    }
    Projects.insert(newProject)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error creating project",
            })
        })
})
router.put('/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body

    if (!changes || Object.keys(changes).length === 0) {
        return res.status(400).json({
            message: "Request body is required",
        })
    }

    const requiredFields = ['name', 'description', 'completed']
    const missingFields = requiredFields.filter(field => changes[field] === undefined);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(', ')}`,
        })
    }

    Projects.update(id, changes)
        .then(updatedProject => {
            if (updatedProject) {
                res.status(200).json(updatedProject)
            } else {
                res.status(404).json({
                    message: "Project not found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating project",
            })
        })
})
router.delete('/:id', (req, res) => {
    const { id } = req.params
    Projects.remove(id)
     .then(deleted => {
        if (deleted) {
            res.status(204).end()
        } else {
            res.status(404).json({
                message: "Project not found",
            })
        }
     })
     .catch(err => {
        res.status(500).json({
            message: "Error deleting project",
        })
    })
})
router.get('/:id/actions', (req, res) => {
    const { id } = req.params
    Projects.getProjectActions(id)
        .then(actions => {
            if (actions) {
                res.status(200).json(actions)
            } else {
                res.status(404).json({
                    message: "Project not found",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving project actions",
            })
        })
})

module.exports = router