window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true; // Allows real-time transcription

// Get the textarea where the recognized text will appear
const InputArea = document.querySelector(".from-text");

// Speech recognition event listeners
recognition.addEventListener("result", (e) => {
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");
  InputArea.value = text;
});

// Restart recognition when speech ends
recognition.addEventListener("end", () => {
  recognition.start();
});

const countries = {
  "en-GB": "English",
  "tl-PH": "Tagalog",
  "ceb-PH": "Cebuano"
};

// Language selection, text areas, and buttons
const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".row i"),
  recognitionBtn = document.getElementById("start-recognition"),
  translateBtn = document.getElementById("translate");

// Populate language dropdowns
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected = id == 0 ? (country_code == "en-GB" ? "selected" : "") : "";
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Exchange languages and text between input and output
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// Clear translation if input is empty
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

// Start speech recognition on clicking 'Start Recognition' button
recognitionBtn.addEventListener("click", () => {
  recognition.start();
});

// Translation logic on clicking the 'Translate' button
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    })
    .catch((err) => {
      toText.value = "Error in translation. Please try again.";
    });
});

// Handle copying text and text-to-speech functionality
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});

$(function() {

  var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	var siteDropdown = function() {

		$('nav .dropdown').hover(function(){
			var $this = $(this);
			$this.addClass('show');
			$this.find('> a').attr('aria-expanded', true);
			$this.find('.dropdown-menu').addClass('show');
		}, function(){
			var $this = $(this);
				$this.removeClass('show');
				$this.find('> a').attr('aria-expanded', false);
				$this.find('.dropdown-menu').removeClass('show');
		});


		$('#dropdown04').on('show.bs.dropdown', function () {
		  console.log('show');
		});

	  $('.navbar .dropdown > a').click(function(){
	    location.href = this.href;
	  });
	}; 
	siteDropdown();

});