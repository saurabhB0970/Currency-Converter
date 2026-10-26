const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector('select[name="from"]');
const toCurr = document.querySelector('select[name="to"]');
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag when currency changes
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Update initial flags
updateFlag(fromCurr);
updateFlag(toCurr);

// Currency conversion
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    if (amount.value.trim() === "" || !Number.isFinite(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let fromCode = fromCurr.value.toLowerCase();
    let toCode = toCurr.value.toLowerCase();

    // If both currencies are the same
    if (fromCode === toCode) {
        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${amtVal.toFixed(2)} ${toCurr.value}`;
        return;
    }

    try {
        // Fetch exchange rates for the source currency
        const URL = `${BASE_URL}/${fromCode}.json`;

        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data = await response.json();

        // Get the target currency's exchange rate
        let rate = data[fromCode][toCode];

        if (typeof rate !== "number") {
            throw new Error("Exchange rate not found.");
        }

        // Calculate converted amount
        let finalAmt = amtVal * rate;

        // Display the result
        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmt.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Unable to get exchange rate. Please try again.";
    }
});