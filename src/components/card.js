import {
  cardTemplate,
  cardPopupImage,
  cardPopupTitle,
  popupCard,
  cardSelector,
  cardImageSelector,
  cardTitleSelector,
  cardLikeSelector,
  cardLikeActiveClass,
  cardDeleteSelector,
  cardLikeWithCountClass,
  cardLikeCountSelector,
  formConfirmDelete,
  popupConfirmDelete,
} from "../utils/constants.js";
import {
  hideButtonLoadingEllipsis,
  showButtonLoadingEllipsis,
} from "../utils/utils.js";

import { deleteCard, toggleLike } from "./api.js";
import { userId } from "./index.js";

import {
  closeConfirmPopup,
  openConfirmPopup,
  openPopup,
} from "./modal.js";

function isOwnerLiked(card) {
  return card.likes.some((like) => like._id === userId);
}

function isHasLikes(card) {
  return card.likes.length > 0;
}

function generateCardElement(card) {
  const cardElement = cardTemplate.querySelector(cardSelector).cloneNode(true);

  cardElement.setAttribute("data-card-id", card._id);

  const cardImage = cardElement.querySelector(cardImageSelector);
  cardImage.src = card.link;
  cardImage.alt = `${card.name}.`;
  cardElement.querySelector(cardTitleSelector).textContent = card.name;

  // card popup with image listener
  cardImage.addEventListener("click", (evt) => {
    const cardImage = evt.target;
    const cardElement = evt.target.closest(cardSelector);
    const cardTitle = cardElement.querySelector(cardTitleSelector);

    cardPopupImage.src = cardImage.src;
    cardPopupImage.alt = `${cardTitle.textContent}.`;
    cardPopupTitle.textContent = cardTitle.textContent;

    openPopup(popupCard);
  });

  // like button
  const cardLikeBtn = cardElement.querySelector(cardLikeSelector);
  const cardLikeCount = cardElement.querySelector(cardLikeCountSelector);
  const cardDeleteBtn = cardElement.querySelector(cardDeleteSelector);

  function renderLikeCount(card) {
    card.likes.length !== 0
      ? (cardLikeCount.textContent = card.likes.length)
      : (cardLikeCount.textContent = "");
  }

  if (isHasLikes(card)) {
    renderLikeCount(card);
    cardLikeBtn.classList.add(cardLikeWithCountClass);
  }

  isOwnerLiked(card) ? cardLikeBtn.classList.add(cardLikeActiveClass) : null;

  const handleLikeClick = (evt) => {
    toggleLike(card._id, isOwnerLiked(card))
      .then((data) => {
        card = data;
        const likeButton = evt.target;
        likeButton.classList.toggle(cardLikeActiveClass);

        card.likes.length !== 0
          ? likeButton.classList.add(cardLikeWithCountClass)
          : likeButton.classList.remove(cardLikeWithCountClass);

        renderLikeCount(card);
      })
      .catch((err) => {
        console.log(`Ошибка ${err.status} лайка карточки: ${err.statusText}`);
      });
  };

  cardLikeBtn.addEventListener("click", handleLikeClick);

  // delete button
  const handleConfirmDeleteSubmit = (evt) => {
    evt.preventDefault();

    const submitButton = evt.submitter;
    const deletedCardElement = document.querySelector(
      `[data-card-id="${card._id}"]`
    );
    showButtonLoadingEllipsis(submitButton, "Удаление");

    deleteCard(card._id)
      .then(() => {
        deletedCardElement.remove();
        closeConfirmPopup(popupConfirmDelete, handleConfirmDeleteSubmit);
        hideButtonLoadingEllipsis(submitButton, "Да");
      })
      .catch((err) => {
        console.log(
          `Ошибка ${err.status} удаления карточки: ${err.statusText}`
        );
      });
  };

  // check card owner === account owner to display delete button
  card.owner._id === userId
    ? cardDeleteBtn.addEventListener("click", () => {
        formConfirmDelete.addEventListener(
          "submit",
          handleConfirmDeleteSubmit,
          { once: true }
        );
        openConfirmPopup(popupConfirmDelete, handleConfirmDeleteSubmit);
      })
    : cardDeleteBtn.remove();

  return cardElement;
}

function renderCard(cardElement, cardsContainer) {
  cardsContainer.prepend(cardElement);
}

export { generateCardElement, renderCard };
