package repository

import "zen/internal/model"

type TaskRepository interface {
	CreateTask(task *model.Task) error
	GetAllTask(userID uint) ([]model.Task, error)
	GetTaskByID(taskID uint) (*model.Task, error)
	UpdateTask(task *model.Task) error
	DeleteTask(taskID uint) error
}
