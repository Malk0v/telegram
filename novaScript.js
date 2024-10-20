// // Токен вашего Telegram-бота
// const botToken = "7891353623:AAHcw3UdOk4BgEoiB3HaIr4x0UhcDsJAXUs";
// // ID чата, куда отправлять сообщения
// const chatId = "-1002333743964";

// nova post 'b363d42c53225af708f436fa467c6c8c';
console.log(2);

document.getElementById("loadCities").addEventListener("click", function () {
  const data = {
    apiKey: "b363d42c53225af708f436fa467c6c8c", // Замените на ваш API-ключ
    modelName: "Address",
    calledMethod: "getCities",
    methodProperties: {},
  };

  fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      const citySelect = document.getElementById("cityRecipient");
      if (result.success) {
        const cities = result.data;
        console.log(cities);
        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.Description;
          option.text = `${city.Description} (Область: ${city.AreaDescription})`;
          citySelect.appendChild(option);
        });
      } else {
        alert(`Ошибка загрузки городов: ${result.errors.join(", ")}`);
      }
    })
    .catch((error) => {
      alert(`Произошла ошибка при загрузке городов: ${error.message}`);
    });
});

console.log(3);
// Обработка формы отправления
document
  .getElementById("shipmentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Останавливаем отправку формы по умолчанию

    // Собираем данные формы
    const sender = document.getElementById("sender").value;
    const phone = document.getElementById("phone").value;
    const recipient = document.getElementById("recipient").value;
    const recipientPhone = document.getElementById("recipientPhone").value;
    const cityRecipient = document.getElementById("cityRecipient").value;
    const cost = document.getElementById("cost").value;

    // Данные для отправки через API Новой Почты
    const data = {
      apiKey: "b363d42c53225af708f436fa467c6c8c",
      modelName: "InternetDocument",
      calledMethod: "save",
      methodProperties: {
        PayerType: "Sender",
        PaymentMethod: "Cash",
        DateTime: new Date().toLocaleDateString("uk-UA"),
        CargoType: "Cargo",
        VolumeGeneral: "0.1",
        Weight: "1",
        ServiceType: "WarehouseWarehouse",
        SeatsAmount: "1",
        Description: "Товары",
        Cost: cost,
        CitySender: "e7188a0d-4b33-11e4-ab6d-005056801329", // Пример города отправителя
        Sender: "f0fffe6d-4b33-11e4-ab6d-005056801329", // ID отправителя
        SenderAddress: "d4922d0f-4b33-11e4-ab6d-005056801329", // Адрес отправителя
        ContactSender: "f55fe6dd-4b33-11e4-ab6d-005056801329", // Контактное лицо отправителя
        SendersPhone: phone, // Телефон отправителя
        RecipientCityName: cityRecipient, // Город получателя
        RecipientName: recipient, // Имя получателя
        RecipientType: "PrivatePerson",
        RecipientsPhone: recipientPhone, // Телефон получателя
      },
    };

    // Отправляем запрос на сервер Новой Почты
    fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        const responseDiv = document.getElementById("response");
        if (result.success) {
          responseDiv.innerHTML = `<strong>Успешно создано отправление:</strong> ${JSON.stringify(
            result.data
          )}`;
          responseDiv.style.color = "green";

          // Отправляем данные в Telegram
          sendToTelegram(
            sender,
            phone,
            recipient,
            recipientPhone,
            cityRecipient,
            cost
          );
        } else {
          responseDiv.innerHTML = `<strong>Ошибка:</strong> ${result.errors.join(
            ", "
          )}`;
          responseDiv.style.color = "red";
        }
      })
      .catch((error) => {
        document.getElementById(
          "response"
        ).innerHTML = `<strong>Произошла ошибка:</strong> ${error.message}`;
        document.getElementById("response").style.color = "red";
      });
  });

// Функция для отправки данных в Telegram
function sendToTelegram(
  sender,
  phone,
  recipient,
  recipientPhone,
  cityRecipient,
  cost
) {
  const botToken = "7891353623:AAHcw3UdOk4BgEoiB3HaIr4x0UhcDsJAXUs";
  const chatId = "-1002333743964"; // Ваш ID чата

  const message = `
            Новая заявка:
            Отправитель: ${sender}, Телефон: ${phone}
            Получатель: ${recipient}, Телефон: ${recipientPhone}
            Город получателя: ${cityRecipient}
            Стоимость: ${cost} грн
        `;

  // Отправляем запрос на Telegram Bot API
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        console.log("Сообщение успешно отправлено в Telegram");
      } else {
        console.error("Ошибка отправки в Telegram:", data);
      }
    });
}
