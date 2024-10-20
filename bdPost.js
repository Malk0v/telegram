console.log("hello");

const name = document.getElementById("name");
console.log(name.value);

const data = {
  //   apiKey: "b363d42c53225af708f436fa467c6c8c",
  //   modelName: "Address",
  //   calledMethod: "getCities",
  //   methodProperties: {},

  apiKey: "b363d42c53225af708f436fa467c6c8c",
  modelName: "AddressGeneral",
  calledMethod: "getSettlements",
  methodProperties: {
    Page: "1",
    Warehouse: "1",
    FindByString: "Харків",
    Limit: "20",
  },
};

function fetchCitys() {
  return fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((e) => console.log(e));
}

console.log(
  fetchCitys().then((e) =>
    console.log(e.data[0].SettlementTypeDescription, e.data[0].Description)
  )
);

console.log(1);
