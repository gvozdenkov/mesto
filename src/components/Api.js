export class Api {
  #baseUrl = null;
  #headers = null;

  constructor(config) {
    this.#baseUrl = config.baseUrl;
    this.#headers = config.headers;
  }

  async #request(endpoint, options = {}) {
    const url = `${this.#baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      headers: this.#headers,
      ...options,
    });
    const json = await res.json();

    return res.ok ? json : Promise.reject(JSON.parse(JSON.stringify(json)));
  }

  getUser() {
    return this.#request(`users/me`);
  }

  updateUser({ name, about }) {
    return this.#request(`users/me`, {
      method: 'PATCH',
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  updateUserAvatar(avatar) {
    return this.#request(`users/me/avatar`, {
      method: 'PATCH',
      body: JSON.stringify({ avatar }),
    });
  }

  getCards() {
    return this.#request(`cards`);
  }

  addCard({ name, link }) {
    return this.#request('cards', {
      method: 'POST',
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  deleteCard(cardId) {
    return this.#request(`cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  toggleLike(cardId, isLiked) {
    return this.#request(`cards/likes/${cardId}`, {
      method: isLiked ? 'DELETE' : 'PUT',
    });
  }

  getAppData() {
    return Promise.all([this.getUser(), this.getCards()]);
  }
}
