const API_KEY = "b363d42c53225af708f436fa467c6c8c"; // Замените на ваш API-ключ

// Функция для поиска города
function searchCity(inputElement, listElement) {
  const query = inputElement.value;

  if (query.length < 2) {
    listElement.innerHTML = ""; // Очищаем подсказки, если введено меньше 2 символов
    return;
  }

  const data = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getCities",
    methodProperties: {
      FindByString: query,
    },
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
      listElement.innerHTML = ""; // Очищаем подсказки
      if (result.success) {
        result.data.forEach((city) => {
          const cityItem = document.createElement("div");
          cityItem.textContent = city.Description;
          cityItem.dataset.cityRef = city.Ref; // Сохраняем Ref города для последующего использования
          cityItem.onclick = function () {
            inputElement.value = city.Description;
            inputElement.dataset.cityRef = city.Ref; // Сохраняем Ref в поле ввода
            listElement.innerHTML = ""; // Очищаем список после выбора
            loadWarehouses(
              city.Ref,
              inputElement === document.getElementById("citySender")
                ? document.getElementById("warehouseSender")
                : document.getElementById("warehouseRecipient")
            );
          };
          listElement.appendChild(cityItem);
        });
      } else {
        listElement.innerHTML = `<div>Города не найдены</div>`;
      }
    })
    .catch((error) => {
      console.error("Ошибка поиска города:", error);
    });
}

// Функция для загрузки отделений
function loadWarehouses(cityRef, selectElement) {
  const data = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityRef,
    },
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
      selectElement.innerHTML = '<option value="">Выберите отделение</option>';
      if (result.success) {
        result.data.forEach((warehouse) => {
          const option = document.createElement("option");
          option.value = warehouse.Ref;
          option.text = warehouse.Description;
          selectElement.appendChild(option);
        });
      } else {
        alert(`Ошибка загрузки отделений: ${result.errors.join(", ")}`);
      }
    })
    .catch((error) => {
      alert(`Произошла ошибка при загрузке отделений: ${error.message}`);
    });
}

// События на ввод текста для поиска городов
document.getElementById("citySender").addEventListener("input", function () {
  searchCity(this, document.getElementById("citySenderList"));
});

document.getElementById("cityRecipient").addEventListener("input", function () {
  searchCity(this, document.getElementById("cityRecipientList"));
});

// Обработка формы отправления
document
  .getElementById("shipmentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Останавливаем отправку формы по умолчанию

    // Собираем данные формы
    const citySenderRef = document.getElementById("citySender").dataset.cityRef;
    const warehouseSender = document.getElementById("warehouseSender").value;
    const cityRecipientRef =
      document.getElementById("cityRecipient").dataset.cityRef;
    const warehouseRecipient =
      document.getElementById("warehouseRecipient").value;
    const sender = document.getElementById("sender").value;
    const phone = document.getElementById("phone").value;
    const recipient = document.getElementById("recipient").value;
    const recipientPhone = document.getElementById("recipientPhone").value;
    const cost = document.getElementById("cost").value;

    // Проверка на заполнение всех полей
    if (
      !citySenderRef ||
      !warehouseSender ||
      !cityRecipientRef ||
      !warehouseRecipient
    ) {
      alert("Пожалуйста, выберите город и отделение отправителя и получателя.");
      return;
    }

    // Данные для отправки через API Новой Почты
    const data = {
      apiKey: API_KEY,
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
        CitySender: citySenderRef,
        SenderAddress: warehouseSender,
        ContactSender: sender,
        SendersPhone: phone,
        RecipientCityName: cityRecipientRef,
        RecipientAddress: warehouseRecipient,
        ContactRecipient: recipient,
        RecipientsPhone: recipientPhone,
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

// const name = document.getElementById("name");

// console.log(name.value);

// const data = {
//   //   apiKey: "b363d42c53225af708f436fa467c6c8c",
//   //   modelName: "Address",
//   //   calledMethod: "getCities",
//   //   methodProperties: {},

//   apiKey: "b363d42c53225af708f436fa467c6c8c",
//   modelName: "AddressGeneral",
//   calledMethod: "getSettlements",
//   methodProperties: {
//     Page: "1",
//     Warehouse: "1",
//     FindByString: "Харків",
//     Limit: "20",
//   },
// };

// function fetchCitys() {
//   return fetch("https://api.novaposhta.ua/v2.0/json/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((e) => console.log(e));
// }

// console.log(
//   fetchCitys().then((e) =>
//     console.log(e.data[0].SettlementTypeDescription, e.data[0].Description)
//   )
// );
