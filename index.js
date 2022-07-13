const optionsLists = [...document.querySelectorAll("[data-options-list]")];

const deliveryDates = [],
  pickupDates = [];
const year = new Date().getFullYear(),
  month = new Date().getMonth(), // Current month of the year
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekday = new Date().getDay(); //Current day of the week
// Loop variables
let dayCount = 0,
  maxDays = 5; //The amount of days to choose from for either pickup or delivery

// A loop to generate dates and store them in 2 arrays which then are gonna be used to populate the custom selects' dropdowns.
while (dayCount < maxDays) {
  // Both pickup and delivery days are gonna increment by the dayCount variable
  // except delivery days are gonna be further apart by whatever value maxDays variable is set to.
  let pickupDay = dayCount,
    deliveryDay = dayCount + maxDays;
  // Function returning a date as a string.
  const dateFormat = function (dayIncrement) {
    // With current maxDays value will only need 2 conditionals.
    let weeklyLimit;
    if (weekday + dayIncrement >= weekdays.length)
      weeklyLimit = weekdays.length;
    if (weekday + dayIncrement >= weekdays.length * 2)
      weeklyLimit = weekdays.length * 2;
    return `${
      weekdays[
        // Ternary operator to start week over
        weekday + dayIncrement >= weekdays.length
          ? weekday + dayIncrement - weeklyLimit
          : weekday + dayIncrement
      ]
    } ${new Date().getDate() + dayIncrement} ${
      months[month]
    } <span class="year">${year}</span>`;
  };
  deliveryDates.push(dateFormat(deliveryDay));
  pickupDates.push(dateFormat(pickupDay));
  dayCount++;
}

optionsLists.forEach((list) => {
  // Date options
  // Function returning a template literal containing HTML to populate individual pickup or delivery dropdown items with it's argument being the date from the respective arrays.
  const optionEntry = (dateStr) => `
  <div class="option">
    <div class="date">
      <i class="fa-solid fa-calendar"></i>
      <span data-option-text>${dateStr}</span>
    </div>
  </div>
  `;
  if (list.id === "pickup") {
    pickupDates.forEach((date) => (list.innerHTML += optionEntry(date)));
  }
  if (list.id === "delivery") {
    deliveryDates.forEach((date) => (list.innerHTML += optionEntry(date)));
  }
  // Time options
  let hourCount = 0;
  let minuteCount = 0;
  if (list.id === "pickup_hours" || list.id === "delivery_hours") {
    while (hourCount < 24) {
      list.innerHTML += `
      <div class="option">
      <div class="time">
      <i class="fa-solid fa-calendar"></i> 
      <span data-option-text>${
        hourCount <= 9 ? "0" + hourCount : hourCount
      }</span>
    </div>
      </div>
      `;
      hourCount++;
    }
  }
  if (list.id === "pickup_minutes" || list.id === "delivery_minutes") {
    while (minuteCount < 60) {
      list.innerHTML += `
        <div class="option">
          <div class="time">
          <span data-option-text>${
            minuteCount <= 9 ? "0" + minuteCount : minuteCount
          }</span>
          </div>
        </div>
      `;
      minuteCount++;
    }
  }

  const selectedOption = list.parentElement.querySelector(".option.selected");
  const selectedOptionText = selectedOption.querySelector(
    "[data-selected-text]"
  ); //Inner text of the default selected item
  const optionSelection = [...list.querySelectorAll(".option")]; //Available options from the dropdown
  // Setting the date of the default selected items to the date of the first options of the lists
  if (list.id === "pickup") selectedOptionText.innerHTML = pickupDates[0];
  if (list.id === "delivery") selectedOptionText.innerHTML = deliveryDates[0];
  selectedOption.addEventListener("click", () => {
    document.addEventListener("click", (e) => {
      if (!selectedOption.contains(e.target)) {
        list.classList.remove("show");
        list.classList.add("close");
      }
    });
    if (list.classList.contains("close")) {
      list.classList.remove("close");
      list.classList.add("show");
      optionSelection.forEach((option, i, arr) => {
        const optionText = option.querySelector("[data-option-text]");
        if (selectedOptionText.innerHTML === optionText.textContent)
          option.classList.add("current");
        option.addEventListener("click", (e) => {
          /* Replace default selected option value with new one from available options,
          also highlight the new option in the list with background color (current class) */
          selectedOptionText.innerHTML = optionText.textContent;
          arr.forEach((item) => item.classList.remove("current"));
          option.classList.add("current");
        });
      });
    } else {
      list.classList.remove("show");
      list.classList.add("close");
    }
  });
});
