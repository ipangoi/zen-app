package repository

import "zen/internal/model"

type SessionRepository interface {
	CreateSession(session *model.Session) error
	GetSessionByTaskID(taskID uint) ([]model.Session, error)
	GetAllSession(userID uint) ([]model.Session, error)
	GetSessionByID(sessionID uint) (*model.Session, error)
	UpdateSession(session *model.Session) error
	DeleteSession(sessionID uint) error
}
