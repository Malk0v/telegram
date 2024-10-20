// Корзина
let cartItems = [];
let totalPrice = 0;
let cartCount = 0;

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const productName = this.getAttribute("data-name");
    const productPrice = parseInt(this.getAttribute("data-price"));
    const quantityInput = this.previousElementSibling.previousElementSibling; // Поле для выбора количества
    const quantity = parseInt(quantityInput.value) || 1;
    const productElem = this.nextElementSibling; // Элемент с текстом "Товар добавлен в корзину"

    // Проверяем, добавлен ли уже товар
    const existingItem = cartItems.find((item) => item.name === productName);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: quantity,
      });
    }

    totalPrice += productPrice * quantity;
    cartCount += quantity;

    updateCart();
    //  productElem.style.display = "block"; // Показываем сообщение, что товар в корзине
  });
});

// Обновление корзины
function updateCart() {
  const cartItemsList = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  const cartCountElem = document.getElementById("cart-count");

  cartItemsList.innerHTML = "";
  cartItems.forEach((item, index) => {
    const totalItemPrice = item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.price} грн. x ${item.quantity} = ${totalItemPrice} грн. 
        <button class="remove-item" data-index="${index}">Удалить</button>`;
    cartItemsList.appendChild(li);
  });

  totalPriceElem.textContent = totalPrice;
  cartCountElem.textContent = cartCount;
  cartCountElem.style.display = cartCount > 0 ? "block" : "none";

  // Обработчик для кнопок удаления товаров из корзины
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      removeItemFromCart(index);
    });
  });
}

// Удаление товара из корзины
function removeItemFromCart(index) {
  const removedItem = cartItems[index];
  totalPrice -= removedItem.price * removedItem.quantity;
  cartCount -= removedItem.quantity;

  cartItems.splice(index, 1);
  updateCart();
}

// Открытие и закрытие модального окна корзины
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeBtn = document.querySelector(".modal-content .close");

cartIcon.addEventListener("click", function () {
  cartModal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
});

// Сброс корзины и формы после отправки
function resetCartAndForm() {
  // Очистить корзину
  cartItems = [];
  totalPrice = 0;
  cartCount = 0;

  // Обновить отображение корзины
  updateCart();

  // Очистить поля формы
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
}

// Отправка формы заказа в Telegram
document
  .getElementById("cart-order-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Остановить стандартное поведение формы

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Собираем информацию о заказе
    let orderDetails = `Заявка с сайта!\n
      Отравитель: ${name}\n
      Телефон: ${phone}\n
      Адрес: ${address}\n
      \n Товары:\n`;

    cartItems.forEach((item) => {
      orderDetails += `${item.name} - ${item.price} грн. x ${
        item.quantity
      } шт. = ${item.price * item.quantity} грн.\n`;
    });

    orderDetails += `\nИтого: ${totalPrice} грн.`;

    // Токен вашего Telegram-бота
    const botToken = "7891353623:AAHcw3UdOk4BgEoiB3HaIr4x0UhcDsJAXUs";
    // ID чата, куда отправлять сообщения
    const chatId = "-1002333743964";

    // URL для отправки запроса
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      orderDetails
    )}`;

    console.log(orderDetails);

    // Отправляем запрос в Telegram
    fetch(telegramUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          document.getElementById("order-status").textContent =
            "Ваш заказ успешно отправлен!";

          // Очистить поля формы и корзину после успешной отправки
          resetCartAndForm();
        } else {
          document.getElementById("order-status").textContent =
            "Ошибка при отправке заказа. Попробуйте снова.";
        }
      })
      .catch((error) => {
        document.getElementById("order-status").textContent =
          "Ошибка: " + error;
      });

    // Закрыть модальное окно после отправки заказа
    cartModal.style.display = "none";
  });

// // Токен вашего Telegram-бота
// const botToken = "7891353623:AAHcw3UdOk4BgEoiB3HaIr4x0UhcDsJAXUs";
// // ID чата, куда отправлять сообщения
// const chatId = "-1002333743964";
