package service

import "zen/internal/model"

type SessionService interface {
	CreateSession(session *model.Session, userID uint) error
	GetSessionsByTaskID(taskID, userID uint) ([]model.Session, error)
	GetAllSession(userID uint) ([]model.Session, error)
	GetSessionByID(sessionID, userID uint) (*model.Session, error)
	UpdateSession(session *model.Session, userID uint) error
	DeleteSession(sessionID, userID uint) error
}
