package repository

import (
	"zen/internal/database"
	"zen/internal/model"
)

type SessionRepositoryImpl struct{}

func NewSessionRepositoryImpl() SessionRepository {
	return &SessionRepositoryImpl{}
}

// CreateSession implements [SessionRepository].
func (s *SessionRepositoryImpl) CreateSession(session *model.Session) error {
	var db = database.GetDB()

	err := db.Debug().Create(session).Error

	return err
}

// GetSessionByTaskID implements [SessionRepository].
func (s *SessionRepositoryImpl) GetSessionByTaskID(taskID uint) ([]model.Session, error) {
	var session []model.Session

	var db = database.GetDB()

	err := db.Debug().Preload("Task").Where("task_id = ?", taskID).Find(&session).Error
	if err != nil {
		return nil, err
	}

	return session, err

}

// GetSessionByTaskID implements [SessionRepository].
func (s *SessionRepositoryImpl) GetAllSession(userID uint) ([]model.Session, error) {
	var session []model.Session

	var db = database.GetDB()

	err := db.Debug().Preload("Task").Where("user_id = ?", userID).Find(&session).Error
	if err != nil {
		return nil, err
	}

	return session, err

}

// GetSessionByID implements [SessionRepository].
func (s *SessionRepositoryImpl) GetSessionByID(sessionID uint) (*model.Session, error) {
	var db = database.GetDB()

	var session model.Session

	err := db.Debug().Preload("Task").Where("id = ?", sessionID).First(&session).Error
	if err != nil {
		return nil, err
	}

	return &session, err

}

// UpdateSession implements [SessionRepository].
func (s *SessionRepositoryImpl) UpdateSession(session *model.Session) error {
	var db = database.GetDB()

	err := db.Model(&model.Session{}).Where("id = ?", session.ID).Updates(session).Error

	return err
}

// DeleteSession implements [SessionRepository].
func (s *SessionRepositoryImpl) DeleteSession(sessionID uint) error {
	var db = database.GetDB()

	err := db.Model(&model.Session{}).Where("id = ?", sessionID).Delete(&model.Session{}).Error

	return err
}
