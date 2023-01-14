import "../pages/index.css";

import {
  addCard,
  getCards,
  getUserInfo,
  setUserAvatar,
  setUserInfo,
} from "./api.js";

import {
  getFormInputValues,
  removeInputErrors,
  setButtonState,
  getPopupElement,
} from "../utils/utils.js";

import { openPopup, closePopup } from "./modal.js";

import { generateCardElement, renderCard } from "./card.js";

import {
  popupEditProfile,
  popupEditAvatar,
  popupAddCard,
  profileName,
  profileAbout,
  profileAvatar,
  cardsContainer,
  avatarInput,
  formEditProfile,
  formAddCard,
  formEditAvatar,
  btnOpenPopupEditProfile,
  nameInput,
  aboutInput,
  btnOpenPopupAddCard,
  avatarContainer,
} from "../utils/constants.js";

import { validationConfig } from "../utils/config.js";

import { enableValidation, isFormValid } from "./validate.js";

const updateUserInfo = (user) => {
  profileAbout.textContent = user.about;
  profileName.textContent = user.name;
  profileAvatar.src = user.avatar;
};

function renderUserInfo() {
  getUserInfo()
    .then(updateUserInfo)
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} загрузки данных пользователя: ${err.statusText}`
      );
    });
}

function renderCards() {
  getCards()
    .then((cards) => {
      cards.reverse().forEach((card) => {
        renderCard(generateCardElement(card), cardsContainer);
      });
    })
    .catch((err) => {
      console.log(`Ошибка ${err.status} загрузки карточек: ${err.statusText}`);
    });
}

//=============== Form events =====================================

const handleEditProfileSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  const { name, about } = getFormInputValues(form);

  setUserInfo({ name, about })
    .then((user) => {
      updateUserInfo(user);
      closePopup(popupEditProfile);
    })
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} редактирования профиля: ${err.statusText}`
      );
    });
};

const handleAddCardSubmit = (evt) => {
  evt.preventDefault();

  const { name, link } = getFormInputValues(formAddCard);
  addCard({ name, link })
    .then((card) => {
      const newCard = generateCardElement(card);
      renderCard(newCard, cardsContainer);
      formAddCard.reset();
      closePopup(popupAddCard);
    })
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} добавления карточки: ${err.statusText}`
      );
    });
};

const handleEditAvatarSubmit = (evt) => {
  evt.preventDefault();

  setUserAvatar(avatarInput.value)
    .then((user) => {
      updateUserInfo(user);
      profileAvatar.src = user.avatar;
      formEditAvatar.reset();
      closePopup(popupEditAvatar);
    })
    .catch((err) => {
      console.log(`Ошибка ${err.status} обновления аватара: ${err.statusText}`);
    });
};

formEditProfile.addEventListener("submit", handleEditProfileSubmit);
formAddCard.addEventListener("submit", handleAddCardSubmit);
formEditAvatar.addEventListener("submit", handleEditAvatarSubmit);

// ============== popup events ======================================
const handleOpenPopupWithForm = (evt) => {
  const popup = getPopupElement(evt.target);
  const form = popup.querySelector(validationConfig.formSelector);
  const submitButton = popup.querySelector(
    validationConfig.submitButtonSelector
  );

  removeInputErrors(form);
  openPopup(popup);
  setButtonState(submitButton, isFormValid(form));
};

btnOpenPopupEditProfile.addEventListener("click", (evt) => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileAbout.textContent;

  handleOpenPopupWithForm(evt);
});

btnOpenPopupAddCard.addEventListener("click", handleOpenPopupWithForm);

avatarContainer.addEventListener("click", handleOpenPopupWithForm);

// ====================================

renderUserInfo();
renderCards();
enableValidation(validationConfig);
