/* eslint-disable no-undef, camelcase, arrow-body-style, consistent-return */

const optionFinder = (selectedOption) => {
  const possibleOptions = ['sparkling', 'dusty', 'rancid'];

  return possibleOptions.filter((option) => {
    return option !== selectedOption;
  });
};

const appendItem = (item) => {
  const appendableItem =
    `<div>
      <h3>${item.item_name}</h3>
      <p>${item.reason}</p>
      <select class="appended-selector">
        <option selected value=${item.cleanliness}>${item.cleanliness}</option>
        <option>${optionFinder(item.cleanliness)[0]}</option>
        <option>${optionFinder(item.cleanliness)[1]}</option>
      </select>
    </div>`;

  $('.garage').append(appendableItem);
};

const fetchItems = () => {
  $('.garage').html('');
  fetch('/api/v1/garage_items')
    .then(response => response.json())
    .then((items) => {
      items.forEach((item) => {
        appendItem(item);
      });
    });
};

const newItem = (event) => {
  event.preventDefault();
  const item_name = $('.item-name').val();
  const reason = $('.reason').val();
  const cleanliness = $('.cleanliness').val();

  fetch('/api/v1/garage_items', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      item_name, reason, cleanliness,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(() => {
      $('.item-name').val('');
      $('.reason').val('');
      $('.cleanliness').val('');
      fetchItems();
    })
    .catch((error) => { throw error; });
};

// const updateCleanliness = (item) => {
//   console.log(item);
// };

$(document).ready(() => {
  fetchItems();
});

$('.submit-item').on('click', newItem);
