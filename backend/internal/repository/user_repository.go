package repository

import (
	"zen/internal/model"
)

type UserRepository interface {
	CreateUser(user *model.User) error
	GetUserByEmail(email string) (*model.User, error)
	GetUserByID(id uint) (*model.User, error)
	UpdateUser(update *model.UpdateProfileRequest, userID uint) error
	// DeleteUserByID(id uint) error
}
