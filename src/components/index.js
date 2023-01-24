import '../pages/index.css';

import {
  addCard,
  deleteLike,
  getCards,
  getUserInfo,
  setLike,
  setUserAvatar,
  setUserInfo,
} from './api.js';

import {
  getFormInputValues,
  removeInputErrors,
  setButtonState,
  getPopupElement,
  loadImage,
  showButtonLoadingEllipsis,
  hideButtonLoadingEllipsis,
} from '../utils/utils.js';

import { openPopup, closeAllPopups } from './modal.js';

import { changeLike, createCardElement, renderCard } from './card.js';

import {
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
  submitButtonSelector,
} from '../utils/constants.js';

import { validationConfig } from '../utils/config.js';

import { enableValidation, isFormValid } from './validate.js';

export let userId;

function renderInitialPage() {
  getUserInfo()
    .then((user) => {
      updateUserInfo(user);
      renderInitialCards();
    })
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} загрузки данных пользователя: ${err.statusText}`
      );
    });
}

function updateUserInfo(user) {
  profileAbout.textContent = user.about;
  profileName.textContent = user.name;
  profileAvatar.src = user.avatar;

  userId = user._id;
}

function handleLikeCard(card, isLiked) {
  isLiked
    ? deleteLike(card._id)
        .then((card) => {
          changeLike(card);
        })
        .catch((err) => {
          console.log(
            `Ошибка ${err.status} удаления лайка карточки: ${err.statusText}`
          );
        })
    : setLike(card._id)
        .then((card) => {
          changeLike(card);
        })
        .catch((err) => {
          console.log(`Ошибка ${err.status} лайка карточки: ${err.statusText}`);
        });
}

function renderInitialCards() {
  getCards()
    .then((cards) => {
      cards.reverse().forEach((card) => {
        renderCard(
          createCardElement(card, userId, handleLikeCard),
          cardsContainer
        );
      });
    })
    .catch((err) => {
      console.log(`Ошибка ${err.status} загрузки карточек: ${err.statusText}`);
    });
}

//=============== Form events =====================================

const handleEditProfileSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(submitButtonSelector);
  showButtonLoadingEllipsis(submitButton, 'Сохранение');

  const form = evt.target;
  const { name, about } = getFormInputValues(form);

  setUserInfo({ name, about })
    .then((user) => {
      updateUserInfo(user);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} редактирования профиля: ${err.statusText}`
      );
    })
    .finally(() => {
      hideButtonLoadingEllipsis(submitButton, 'Сохранить');
    });
};

const handleAddCardSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(submitButtonSelector);
  showButtonLoadingEllipsis(submitButton, 'Создание');

  const { name, link } = getFormInputValues(formAddCard);
  addCard({ name, link })
    .then((card) => {
      const newCard = createCardElement(card);
      renderCard(newCard, cardsContainer);
      formAddCard.reset();
      closeAllPopups();
    })
    .catch((err) => {
      console.log(
        `Ошибка ${err.status} добавления карточки: ${err.statusText}`
      );
    })
    .finally(() => {
      hideButtonLoadingEllipsis(submitButton, 'Создать');
    });
};

const handleEditAvatarSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(submitButtonSelector);
  showButtonLoadingEllipsis(submitButton, 'Сохранение');

  loadImage(avatarInput.value)
    .then((url) => {
      setUserAvatar(url)
        .then((user) => {
          updateUserInfo(user);
          formEditAvatar.reset();
          closeAllPopups();
        })
        .catch((err) => {
          console.log(
            `Ошибка загрузки аватара ${err.status}: ${err.statusText}`
          );
        });
    })
    .catch((url) => {
      console.log(`image not found for url ${url}`);
    })
    .finally(() => {
      hideButtonLoadingEllipsis(submitButton, 'Сохранить');
    });
};

formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formAddCard.addEventListener('submit', handleAddCardSubmit);
formEditAvatar.addEventListener('submit', handleEditAvatarSubmit);

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

btnOpenPopupEditProfile.addEventListener('click', (evt) => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileAbout.textContent;

  handleOpenPopupWithForm(evt);
});

btnOpenPopupAddCard.addEventListener('click', handleOpenPopupWithForm);

avatarContainer.addEventListener('click', handleOpenPopupWithForm);

// ====================================

renderInitialPage();
enableValidation(validationConfig);