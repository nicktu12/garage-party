/* eslint-disable no-undef */

const appendItem = (item) => {
  const appendableItem =
    `<div>
      <h3>${item.item_name}</h3>
      <p>${item.reason}</p>
      <p>${item.cleanliness}</p>
    </div>`;

  $('.garage').append(appendableItem);
};

const fetchItems = () => {
  fetch('/api/v1/garage_items')
    .then(response => response.json())
    .then((items) => {
      items.forEach((item) => {
        appendItem(item);
      });
    });
};


$(document).ready(() => {
  fetchItems();
});
