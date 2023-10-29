// Get references to the form elements
const form = document.getElementById("tip-calculator-form");
const billTotalInput = document.getElementById("bill-total");
const tipRangeInput = document.getElementById("tip-range");
const tipPercentageInput = document.getElementById("disabled-tip-percentage");
const tipAmountInput = document.getElementById("disabled-tip-amount");
const totalBillInput = document.getElementById("disabled-total-bill");
const errorMessage = document.getElementById("error-message");

// Add event listeners to the form for "input" and "change" events
form.addEventListener("input", updateTip);
form.addEventListener("change", updateTip);

// Function to update the tip-related fields
function updateTip() {
  // Clear any previous error messages
  errorMessage.textContent = "";

  // Get the values from the Bill Total and Tip Percentage inputs
  const billTotal = parseFloat(billTotalInput.value);
  const tipPercentage = parseFloat(tipRangeInput.value);

  // Validate the Bill Total input
  if (isNaN(billTotal)) {
    errorMessage.textContent = "enter valid number";
    return;
  }

  // Calculate Tip Amount and Total Bill with Tip
  const tipAmount = (billTotal * tipPercentage) / 100;
  const totalBill = billTotal + tipAmount;

  // Update the disabled fields with the calculated values
  tipPercentageInput.value = tipPercentage.toFixed(2) + "%";
  tipAmountInput.value = "$" + tipAmount.toFixed(2);
  totalBillInput.value = "$" + totalBill.toFixed(2);
}
