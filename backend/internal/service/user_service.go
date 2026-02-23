package service

import "zen/internal/model"

type UserService interface {
	Register(user *model.RegisterForm) (*model.User, error)
	Login(email, password string) (string, error)
	GetProfile(id uint) (*model.User, error)
	UpdateUser(username *model.UpdateProfileRequest, userID uint) error
	// DeleteUser(id uint) error
}
