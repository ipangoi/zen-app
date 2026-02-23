package service

import "zen/internal/model"

type TaskService interface {
	CreateTask(task *model.Task) error
	GetAllTask(userID uint) ([]model.Task, error)
	GetTaskByID(taskID, userID uint) (*model.Task, error)
	UpdateTask(task *model.Task, userID uint) error
	DeleteTask(taskID, userID uint) error
}
