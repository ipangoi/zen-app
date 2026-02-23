package service

import (
	"errors"
	"zen/internal/model"
	"zen/internal/repository"
)

type SessionServiceImpl struct {
	sessionRepo repository.SessionRepository
	taskRepo    repository.TaskRepository
}

func NewSessionServiceImpl(sRepo repository.SessionRepository, tRepo repository.TaskRepository) SessionService {
	return &SessionServiceImpl{
		sessionRepo: sRepo,
		taskRepo:    tRepo,
	}
}

// CreateSession implements [SessionService].
func (s *SessionServiceImpl) CreateSession(session *model.Session, userID uint) error {
	if session.TaskID == nil {
		return errors.New("Must Include Task ID")
	}

	task, err := s.taskRepo.GetTaskByID(*session.TaskID)
	if err != nil {
		return errors.New("Not Found")
	}

	if task.UserID != userID {
		return errors.New("Unauthorized")
	}

	return s.sessionRepo.CreateSession(session)

}

// GetSessionsByTaskID implements [SessionService].
func (s *SessionServiceImpl) GetSessionsByTaskID(taskID uint, userID uint) ([]model.Session, error) {
	task, err := s.taskRepo.GetTaskByID(taskID)
	if err != nil {
		return nil, err
	}

	if task.UserID != userID {
		return nil, errors.New("Unauthorized")
	}

	return s.sessionRepo.GetSessionByTaskID(taskID)
}

// GetSessionsByTaskID implements [SessionService].
func (s *SessionServiceImpl) GetAllSession(userID uint) ([]model.Session, error) {

	return s.sessionRepo.GetAllSession(userID)
}

// GetSessionByID implements [SessionService].
func (s *SessionServiceImpl) GetSessionByID(sessionID uint, userID uint) (*model.Session, error) {
	session, err := s.sessionRepo.GetSessionByID(sessionID)
	if err != nil {
		return nil, err
	}

	if session.UserID != userID {
		return nil, errors.New("Unauthorized")
	}

	return session, nil
}

// UpdateSession implements [SessionService].
func (s *SessionServiceImpl) UpdateSession(session *model.Session, userID uint) error {
	existingSession, err := s.sessionRepo.GetSessionByID(session.ID)
	if err != nil {
		return errors.New("Not Found")
	}

	if existingSession.UserID != userID {
		return errors.New("Unauthorized")
	}

	return s.sessionRepo.UpdateSession(session)
}

// DeleteSession implements [SessionService].
func (s *SessionServiceImpl) DeleteSession(sessionID uint, userID uint) error {
	session, err := s.sessionRepo.GetSessionByID(sessionID)
	if err != nil {
		return errors.New("Not Found")
	}

	if session.UserID != userID {
		return errors.New("Unauthorized")
	}

	return s.sessionRepo.DeleteSession(sessionID)
}
