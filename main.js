const currencyForm = document.getElementById("currency-form");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const currencyInput = document.getElementById("currency-input");
const resultModal = document.querySelector("#result-modal .modal-content");
const btnShowResults = document.getElementById("btn-show-results");
const MsgContainer = document.getElementById("msg-container");
const fromInput = document.getElementById("from-input");
const toInput = document.getElementById("to-input");
const factorInput = document.getElementById("factor-input");
const saveChanges = document.getElementById("save-changes");
const closeAdd = document.getElementById('close-add');
const addBtn = document.getElementById('add-btn');

const countriesList = countries;
// Initilization
window.addEventListener("DOMContentLoaded", init);
// Listen to submit form
currencyForm.addEventListener("submit", currencyConvertor);
// Save Changes
saveChanges.addEventListener("click",addFactors);

addBtn.addEventListener('click', loadCountries);



function init(){
    if (!getFactors()) {
        showMsg( "warning", "<strong>Warning : </strong> Please Add Currency conversion factors to the list", 3000);
      } else {
        loadSelect(fromSelect, "from");
        loadSelect(toSelect, "to");
        loadCountries(fromInput);
        loadCountries(toInput);
      }
}

function currencyConvertor(e){
    e.preventDefault();
    const from = fromSelect.value;
    const to = toSelect.value;
  
    if (isNaN(currencyInput.value)) {
      showMsg("danger", "<strong>Error: </Strong> Enter only numbers", 3000);
      return;
    }
  
    if (currencyInput.value === "") {
      showMsg( "danger", "<strong>Error: </Strong> Enter number of currency to convert", 3000);
      return;
    }
  
    if (from !== to) {
      const factor = getFactors();
      const selectedConv = factor.find( (item) => item.from === from && item.to === to);
      let result = selectedConv.factor * currencyInput.value;
      let temp = `    
          <div class="modal-header">
              <h5 class="modal-title text-center" id="add-model-header"> ${from} - ${to}</h5>
              <button type="button" class="close" data-dismiss="modal"> 
                  <span>&times;</span>
               </button>
          </div>
          <div class="modal-body text-center" >${result} ${to}</div>`;
  
      resultModal.innerHTML = temp;
      btnShowResults.click();
    } else {
      showMsg( "danger", "<strong>Error: </Strong> Please select two different currncies", 3000);
    }
}

function addFactors() {
  if(factorInput.value!=='' ){
    let factor = {
        from: fromInput.value,
        to: toInput.value,
        factor: factorInput.value,
      };
      
      let factors = getFactors();
      
      if (!factors) {
        factors = [];
      }
    
      factors.push(factor);
      setFactors(factors);
      loadSelect(fromSelect, "from");
      loadSelect(toSelect, "to");

      closeAdd.click();
      showMsg(
        "success",
        "<strong>SUCCESS: </Strong> Currency conversion Added to the system",
        3000
      );
  }

}

function setFactors(factors) {
  const currencyJSON = JSON.stringify(factors);
  localStorage.setItem("currency", currencyJSON);
}

function getFactors() {
  const currencyJSON = localStorage.getItem("currency");
  if (currencyJSON) {
    return (currency = JSON.parse(currencyJSON));
  }
}


function loadCountries(){

    let temp= ``;
    countriesList.forEach(country=>{
        temp += `<option value="${country.currency_code} - ${country.country}">${country.currency_code} - ${country.country}</option>`;
    });

    fromInput.innerHTML = temp;
    toInput.innerHTML = temp;

}
function loadSelect(el, type) {
  let temp = "";
  const factors = getFactors();
  if (type === "from") {
    let from = [];
    factors.forEach(item=>{ from.push(item.from)});
    let uniqueFactors = [...new Set(from)];

    uniqueFactors.forEach((item) => {
      temp += `<option value="${item}">${item}</option>`;
    });
  } else if (type === "to") {
    let to = [];
    factors.forEach(item=>{ to.push(item.to)});
    let uniqueFactors = [...new Set(to)];
    uniqueFactors.forEach((item) => {
      temp += `<option value="${item}">${item}</option>`;
    });
  }
  el.innerHTML = temp;
}

function showMsg(type, msg, time) {
  let temp = `
        <div class="alert alert-${type} alert-dismissible fade show hide">
       ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
  MsgContainer.innerHTML = temp;

  setTimeout(() => {
    MsgContainer.innerHTML = "";
  }, time);
}
