package service

import (
	"errors"
	"strconv"
	"time"
	"zen/internal/model"
	"zen/internal/repository"
	"zen/internal/utils"
)

type UserServiceImpl struct {
	userRepo repository.UserRepository
}

func NewUserServiceImpl(repo repository.UserRepository) UserService {
	return &UserServiceImpl{
		userRepo: repo,
	}
}

// Register implements [UserService].
func (s *UserServiceImpl) Register(user *model.RegisterForm) (*model.User, error) {
	findUser, _ := s.userRepo.GetUserByEmail(user.Email)
	if findUser != nil {
		return nil, errors.New("Email Already Registered")
	}

	hash, err := utils.HashPassword(user.Password)
	if err != nil {
		return nil, err
	}

	tempUsername := "user_" + strconv.FormatInt(time.Now().Unix(), 10)

	newUser := model.User{Username: tempUsername, Email: user.Email, Password: hash}

	err = s.userRepo.CreateUser(&newUser)
	if err != nil {
		return nil, err
	}

	return &newUser, nil
}

// Login implements [UserService].
func (s *UserServiceImpl) Login(email, password string) (string, error) {

	findUser, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return "", err
	}

	userTrue := utils.ComparePass(findUser.Password, password)
	if !userTrue {
		return "", errors.New("Wrong Email/Password")
	}

	token, err := utils.GenerateToken(findUser.ID, findUser.Email)

	return token, err
}

// GetProfile implements [UserService].
func (s *UserServiceImpl) GetProfile(id uint) (*model.User, error) {

	findUser, err := s.userRepo.GetUserByID(id)
	if err != nil {
		return nil, err
	}

	return findUser, nil

}

// UpdateUser implements [UserService].
func (s *UserServiceImpl) UpdateUser(username *model.UpdateProfileRequest, userID uint) error {
	_, err := s.userRepo.GetUserByID(userID)
	if err != nil {
		return errors.New("Not Found")
	}

	return s.userRepo.UpdateUser(username, userID)
}

// // DeleteUser implements [UserService].
// func (s *UserServiceImpl) DeleteUser(id uint) error {
// 	panic("unimplemented")
// }
