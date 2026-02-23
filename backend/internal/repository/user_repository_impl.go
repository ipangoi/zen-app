package repository

import (
	"zen/internal/database"
	"zen/internal/model"
)

type UserRepositoryImpl struct{}

func NewUserRepositoryImpl() UserRepository {
	return &UserRepositoryImpl{}
}

var (
	appJSON = "application/json"
)

// UserRegister implements [UserHandler].
func (u *UserRepositoryImpl) CreateUser(user *model.User) error {
	var db = database.GetDB()

	err := db.Debug().Create(user).Error

	return err
}

// GetUserByEmail implements [UserRepository].
func (u *UserRepositoryImpl) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	var db = database.GetDB()

	err := db.Debug().Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, err
}

func (u *UserRepositoryImpl) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	var db = database.GetDB()

	err := db.Debug().Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, err
}

// UpdateUser implements [UserRepository].
func (u *UserRepositoryImpl) UpdateUser(username *model.UpdateProfileRequest, userID uint) error {
	var db = database.GetDB()

	err := db.Debug().Model(&model.User{}).Where("id = ?", userID).Updates(username).Error

	return err

}

// // DeleteUserByID implements [UserRepository].
// func (u *UserRepositoryImpl) DeleteUserByID(id uint) error {
// 	panic("unimplemented")
// }
