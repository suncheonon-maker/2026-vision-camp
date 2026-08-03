// 배포한 Google Apps Script 웹 앱 URL을 여기에 붙여넣으세요.
// (설정 방법은 DEPLOY.md 참고)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLrd1t-2oeHd1JRCyF_0Rep83QyECNtL5eEUKspyBE_tR36yOB61VqOfaub7wG4Lc2/exec";

const form = document.getElementById("regForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn.querySelector(".btn-text");
const btnSpinner = submitBtn.querySelector(".btn-spinner");
const successPanel = document.getElementById("successPanel");
const errorPanel = document.getElementById("errorPanel");
const resetBtn = document.getElementById("resetBtn");
const gradeOtherInput = document.getElementById("gradeOther");

// "기타" 학번 선택 시 직접 입력창 표시
document.querySelectorAll('input[name="grade"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const isOther = radio.value === "기타" && radio.checked;
    gradeOtherInput.hidden = !isOther;
    if (isOther) gradeOtherInput.focus();
  });
});

function setFieldValid(fieldEl, isValid) {
  fieldEl.classList.toggle("invalid", !isValid);
}

function validate() {
  let valid = true;

  const nameField = document.getElementById("name").closest(".field");
  const nameValue = document.getElementById("name").value.trim();
  const nameOk = nameValue.length > 0;
  setFieldValid(nameField, nameOk);
  valid = valid && nameOk;

  const campusField = document.getElementById("campusGroup").closest(".field");
  const campusOk = !!form.querySelector('input[name="campus"]:checked');
  setFieldValid(campusField, campusOk);
  valid = valid && campusOk;

  const gradeField = document.getElementById("gradeGroup").closest(".field");
  const gradeChecked = form.querySelector('input[name="grade"]:checked');
  let gradeOk = !!gradeChecked;
  if (gradeChecked && gradeChecked.value === "기타") {
    gradeOk = gradeOtherInput.value.trim().length > 0;
  }
  setFieldValid(gradeField, gradeOk);
  valid = valid && gradeOk;

  const phoneField = document.getElementById("phone").closest(".field");
  const phoneOk = document.getElementById("phone").value.trim().length > 0;
  setFieldValid(phoneField, phoneOk);
  valid = valid && phoneOk;

  return valid;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnSpinner.hidden = !isLoading;
  btnText.textContent = isLoading ? "제출 중..." : "등록 완료하기";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorPanel.hidden = true;

  if (!validate()) return;

  const campus = form.querySelector('input[name="campus"]:checked').value;
  const gradeChecked = form.querySelector('input[name="grade"]:checked').value;
  const grade = gradeChecked === "기타" ? gradeOtherInput.value.trim() : gradeChecked;

  const payload = {
    이름: document.getElementById("name").value.trim(),
    캠퍼스: campus,
    학번: grade,
    연락처: document.getElementById("phone").value.trim(),
  };

  if (SCRIPT_URL === "YOUR_DEPLOYED_WEB_APP_URL_HERE") {
    alert("아직 Google Apps Script 웹 앱 URL이 연결되지 않았습니다. script.js의 SCRIPT_URL을 설정해주세요.");
    return;
  }

  setLoading(true);
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    form.hidden = true;
    successPanel.hidden = false;
  } catch (err) {
    errorPanel.hidden = false;
  } finally {
    setLoading(false);
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  gradeOtherInput.hidden = true;
  document.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
  form.hidden = false;
  successPanel.hidden = true;
});
