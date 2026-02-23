package service

import (
	"errors"
	"zen/internal/model"
	"zen/internal/repository"
)

type TaskServiceImpl struct {
	taskRepo repository.TaskRepository
}

func NewTaskServiceImpl(repo repository.TaskRepository) TaskService {
	return &TaskServiceImpl{
		taskRepo: repo,
	}
}

// CreateTask implements [TaskService].
func (t *TaskServiceImpl) CreateTask(task *model.Task) error {

	return t.taskRepo.CreateTask(task)
}

// GetAllTask implements [TaskService].
func (t *TaskServiceImpl) GetAllTask(userID uint) ([]model.Task, error) {
	return t.taskRepo.GetAllTask(userID)
}

// GetTaskByID implements [TaskService].
func (t *TaskServiceImpl) GetTaskByID(taskID uint, userID uint) (*model.Task, error) {
	task, err := t.taskRepo.GetTaskByID(taskID)
	if err != nil {
		return nil, err
	}
	if task.UserID != userID {
		return nil, errors.New("Nope")
	}

	return task, nil
}

// UpdateTask implements [TaskService].
func (t *TaskServiceImpl) UpdateTask(task *model.Task, userID uint) error {
	real, err := t.taskRepo.GetTaskByID(task.ID)
	if err != nil {
		return err
	}
	if real.UserID != userID {
		return errors.New("Nope")
	}

	return t.taskRepo.UpdateTask(task)

}

// DeleteTask implements [TaskService].
func (t *TaskServiceImpl) DeleteTask(taskID uint, userID uint) error {
	real, err := t.taskRepo.GetTaskByID(taskID)
	if err != nil {
		return err
	}
	if real.UserID != userID {
		return errors.New("Nope")
	}

	return t.taskRepo.DeleteTask(taskID)
}
