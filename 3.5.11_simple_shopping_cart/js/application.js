var updateSubTotal = function (index) {
  var price = document.querySelectorAll('.price');
  var qty = document.querySelectorAll('.quantity');
  var subTotal = document.querySelectorAll('.subTotal');
  var priceInNumber = Number(price[index].innerText.replace(/\$/, ''));
  var qtyInNumber = Number(qty[index].getAttribute('value'));
  var subTotalInNumber = priceInNumber * qtyInNumber;
  subTotal[index].innerHTML = subTotalInNumber.toLocaleString('en');
  return subTotalInNumber;
};

var updateTotal = function () {
  var total = [];
  var price = document.querySelectorAll('.price');
  for (var i = 0; i < price.length; i++) {
    total.push(updateSubTotal(i));
  };
  var totalPrice = total.reduce(function (acc, currentValue) {
    return acc + currentValue;
  });

  document.querySelector('#total').innerHTML = totalPrice.toLocaleString('en');
};

document.addEventListener('DOMContentLoaded', function () {
  var tbody = document.querySelector('tbody');

  tbody.addEventListener('click', function (event) {
    if (event.target.className == 'remove') {
      this.removeChild(event.target.parentElement.parentElement);
      updateTotal();
    }
  });

  var timeout;
  tbody.addEventListener('input', function (event) {
    if (event.target.type == 'number') {
      event.target.setAttribute('value', event.target.value);
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        updateTotal();
      }, 500)
    }
  });

  var form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name = this[0].value;
    var price = this[1].value;
    var newTr = document.createElement('tr');
    newTr.innerHTML =
      '<td class="name">' + name + '</td>' +
      '<td class="price">$' + Number(price).toFixed(2) + '</td>' +
      '<td><b>QTY</b><input class="quantity" type="number" /></td>' +
      '<td><button class="remove">Remove</button></td>' +
      '<td>$<span class="subTotal">--.--</span></td>';
    tbody.appendChild(newTr);
    this[0].value = '';
    this[1].value = '';
  });
});
