document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      const error = document.getElementById("error-msg");
      if (user === "admin" && pass === "password") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
      } else {
        error.textContent = "Invalid credentials";
      }
    });
  }

  if (window.location.pathname.includes("dashboard.html")) {
    if (localStorage.getItem("loggedIn") !== "true") {
      window.location.href = "index.html";
    }
    const table = document.getElementById("inventory-table");
    if (table) {
      table.innerHTML = `<tr>
        <th>Reagent</th><th>Vendor</th><th>Catalogue</th><th>Lot</th><th>Exp Date</th><th>Days Left</th>
      </tr>` + reagents.map(r => `
        <tr>
          <td>${r.reagent}</td>
          <td>${r.vendor}</td>
          <td>${r.catalog}</td>
          <td>${r.lot}</td>
          <td>${r.exp}</td>
          <td>${r.days}</td>
        </tr>`).join('');
    }

    const lotBoxDiv = document.getElementById("lot-box-grid");
    if (lotBoxDiv) {
      lotBox.forEach(slot => {
        const div = document.createElement("div");
        div.textContent = slot.label;
        div.style.background = slot.filled ? "#aee1ff" : "#eee";
        lotBoxDiv.appendChild(div);
      });
    }

    renderSampleTable(samples);
  }

  const sampleForm = document.getElementById("sampleForm");
  if (sampleForm) {
    sampleForm.onsubmit = function (e) {
      e.preventDefault();
      const newSample = Object.fromEntries(new FormData(sampleForm).entries());
      newSample.quantity = parseFloat(newSample.quantity);
      samples.push(newSample);
      alert("Sample added.");
      window.location.href = "dashboard.html";
    };
  }
});

function renderSampleTable(data) {
  const tbody = document.querySelector("#sample-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(s => {
    const row = `<tr>
      <td>${s.sample_id}</td><td>${s.status}</td><td>${s.category}</td>
      <td>${s.parent_id}</td><td>${s.barcode}</td><td>${s.custodian}</td>
      <td>${s.subject_id}</td><td>${s.storage}</td><td>${s.quantity} ${s.unit}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function filterSamples() {
  const type = document.getElementById("sampleTypeFilter").value;
  if (type === "all") {
    renderSampleTable(samples);
  } else {
    const filtered = samples.filter(s => s.type === type);
    renderSampleTable(filtered);
  }
}