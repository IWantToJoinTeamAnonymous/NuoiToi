function fmtVND(n){
  return (n||0).toLocaleString("vi-VN") + " đ";
}
function daysBetween(aIso, bIso){
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.max(0, Math.floor((b-a)/(1000*60*60*24)));
}

async function main(){
  const res = await fetch("./data/ledger.json", { cache: "no-store" });
  const data = await res.json();

  // last updated
  const lu = new Date(data.lastUpdated);
  document.getElementById("lastUpdated").textContent =
    lu.toLocaleString("vi-VN", { hour12:false });

  // stats
  const donors = new Set((data.transactions||[]).map(t => (t.note||"").trim())).size;
  document.getElementById("donors").textContent = donors;

  document.getElementById("transparency").textContent = "100%";

  const now = new Date();
  document.getElementById("days").textContent = daysBetween(data.startedAt, now.toISOString());

  // goal
  const cur = data.goal?.current || 0;
  const tar = data.goal?.target || 1;
  const pct = Math.max(0, Math.min(100, Math.round(cur * 100 / tar)));
  document.getElementById("goalText").textContent = pct + "%";
  document.getElementById("goalBar").style.width = pct + "%";
  document.getElementById("statusText").textContent =
    pct >= 100 ? "Đã đạt mục tiêu 🎉" : (pct >= 75 ? "Sắp đạt rồi!" : "Đang phát triển");

  // categories
  const cats = document.getElementById("categories");
  cats.innerHTML = (data.categories||[]).map(c => `
    <div class="cat">
      <div class="name">${c.name}</div>
      <div class="pct">${c.pct}%</div>
    </div>
  `).join("");

  // transactions table
  const tb = document.getElementById("txBody");
  tb.innerHTML = (data.transactions||[]).slice(0, 30).map(t => `
    <tr>
      <td>${t.time}</td>
      <td>${t.note}</td>
      <td class="right">${fmtVND(t.amount)}</td>
    </tr>
  `).join("");
}

main().catch(err => {
  console.error(err);
  alert("Không tải được dữ liệu ledger.json");
});