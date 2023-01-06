const content = document.querySelector(".content");
const cardsContainer = content.querySelector(".photo-grid");
const cardTemplate = document.querySelector("#card-template").content;

// DOM elements
const avatarContainer = content.querySelector(".profile__avatar");
const avatarImage = content.querySelector(".profile__avatar-img");
const btnOpenPopupEditProfile = content.querySelector(".profile__edit-btn");
const btnOpenPopupAddCard = content.querySelector(".profile__add-btn");
const profileName = content.querySelector(".profile__name");
const profileAbout = content.querySelector(".profile__about");

// popups
const popupEditAvatar = document.querySelector(".popup_edit-avatar");
const popupEditProfile = document.querySelector(".popup_edit-profile");
const popupAddCard = document.querySelector(".popup_add-card");
const popupCard = document.querySelector(".popup_type_image");
const cardPopupImage = popupCard.querySelector(".popup__image");
const cardPopupTitle = popupCard.querySelector(".popup__image-title");

// forms
const formAddCard = document.forms.addCardForm;

const formEditProfile = document.forms.editProfileForm;
const nameInput = formEditProfile.elements.name;
const aboutInput = formEditProfile.elements.about;

const formEditAvatar = document.forms.editAvatarForm;
const avatarInput = formEditAvatar.elements.avatarLink;

// ============== Popup functions =============================================
const openPopup = (popup) => {
  popup.classList.add("popup_opened");
};

const closePopup = (popup) => {
  popup.classList.remove("popup_opened");
};

const setPopupCloseListeners = () => {
  document.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("popup__close-btn")) {
      const openedPopup = evt.currentTarget.querySelector(".popup_opened");
      closePopup(openedPopup);
    }
  });

  document.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("popup_opened")) {
      closePopup(evt.target);
    }
  });

  document.addEventListener("keydown", (evt) => {
    const openedPopup = document.querySelector(".popup_opened");

    if (openedPopup && evt.key === "Escape") {
      closePopup(openedPopup);
    }
  });
};

const getFormInputValues = (form) => {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);
  return formProps;
};

// //=============== Card functions ==========================================
const generateCardElement = (data) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  cardElement.querySelector(".card__img").src = data.link;
  cardElement.querySelector(".card__img").alt = `${data.name}.`;
  cardElement.querySelector(".card__title").textContent = data.name;

  return cardElement;
};

const setCardListeners = () => {
  cardsContainer.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("card__like-btn")) {
      evt.target.classList.toggle("card__like-btn_active");
    }

    if (evt.target.classList.contains("card__delete-btn")) {
      evt.target.closest(".card").remove();
    }

    if (evt.target.classList.contains("card__img")) {
      const cardImageElement = evt.target;
      const cardElement = evt.target.closest(".card");
      const cardTitle = cardElement.querySelector(".card__title");

      cardPopupImage.src = cardImageElement.src;
      cardPopupImage.alt = `${cardTitle.textContent}.`;
      cardPopupTitle.textContent = cardTitle.textContent;

      openPopup(popupCard);
    }
  });
};

const renderCard = (cardElement, cardsContainer) => {
  cardsContainer.prepend(cardElement);
};

//=============== Form functions ==============================================
function resetFormAndClosePopup(evt) {
  evt.target.reset();
  closePopup(evt.target.closest(".popup_opened"));
}

const handleEditProfileSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  const { name, about } = getFormInputValues(form);

  profileName.textContent = name;
  profileAbout.textContent = about;

  closePopup(popupEditProfile);
};

const handleAddCardSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  const data = getFormInputValues(form);
  const card = generateCardElement(data);

  renderCard(card, cardsContainer);
  resetFormAndClosePopup(evt);
};

const handleEditAvatarSubmit = (evt) => {
  evt.preventDefault();

  avatarImage.src = avatarInput.value;
  resetFormAndClosePopup(evt);
};

// ============== form submit listeners =======================================
formEditProfile.addEventListener("submit", handleEditProfileSubmit);
formAddCard.addEventListener("submit", handleAddCardSubmit);
formEditAvatar.addEventListener("submit", handleEditAvatarSubmit);

// ============== popup button listeners ======================================
btnOpenPopupEditProfile.addEventListener("click", () => {
  openPopup(popupEditProfile);

  nameInput.value = profileName.textContent;
  aboutInput.value = profileAbout.textContent;
});

btnOpenPopupAddCard.addEventListener("click", () => {
  openPopup(popupAddCard);
});

avatarContainer.addEventListener("click", () => {
  openPopup(popupEditAvatar);
});

// ============== Render Initial cards =======================================
initialCards.forEach((data) =>
  renderCard(generateCardElement(data), cardsContainer)
);

setCardListeners();
setPopupCloseListeners();