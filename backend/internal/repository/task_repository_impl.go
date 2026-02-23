package repository

import (
	"zen/internal/database"
	"zen/internal/model"
)

type TaskRepositoryImpl struct{}

func NewTaskRepositoryImpl() TaskRepository {
	return &TaskRepositoryImpl{}
}

// CreateTask implements [TaskRepository].
func (t *TaskRepositoryImpl) CreateTask(task *model.Task) error {
	var db = database.GetDB()

	err := db.Debug().Create(task).Error

	return err
}

// GetAllTask implements [TaskRepository].
func (t *TaskRepositoryImpl) GetAllTask(userID uint) ([]model.Task, error) {
	var task []model.Task
	var db = database.GetDB()

	err := db.Debug().Where("user_id = ?", userID).Find(&task).Error
	if err != nil {
		return nil, err
	}

	return task, err
}

// GetTaskByID implements [TaskRepository].
func (t *TaskRepositoryImpl) GetTaskByID(taskID uint) (*model.Task, error) {
	var db = database.GetDB()

	var task model.Task

	err := db.Debug().Where("id = ?", taskID).First(&task).Error
	if err != nil {
		return nil, err
	}

	return &task, err

}

// UpdateTask implements [TaskRepository].
func (t *TaskRepositoryImpl) UpdateTask(task *model.Task) error {
	var db = database.GetDB()

	err := db.Model(&model.Task{}).Where("id = ?", task.ID).Updates(task).Error

	return err
}

// DeleteTask implements [TaskRepository].
func (t *TaskRepositoryImpl) DeleteTask(taskID uint) error {
	var db = database.GetDB()

	err := db.Model(&model.Task{}).Where("id = ?", taskID).Delete(&model.Task{}).Error

	return err
}
