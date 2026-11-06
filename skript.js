
// IBROHIM O'QUV MARKAZI

const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

// Mobil menyu
menu.addEventListener("click", () => {
  nav.classList.toggle("show");
  menu.textContent = nav.classList.contains("show") ? "✕" : "☰";
});

// Menyu havolalarini bosganda yopish
document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("show");
    menu.textContent = "☰";
  });
});

// Animatsiya
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".course-card, .steps > div")
  .forEach(item => observer.observe(item));

// Ro'yxatdan o'tish va Telegram
const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const course = document.getElementById("course").value;

  if (!name || !phone || !course) {
    message.textContent = "Barcha maydonlarni to'ldiring!";
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Yuborilmoqda...";

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone, course })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Xatolik");
    }

    message.textContent = "✓ Ma'lumotlaringiz Telegramga yuborildi!";
    form.reset();

  } catch (error) {
    message.textContent =
      "Xabar yuborilmadi. Server va Telegram sozlamalarini tekshiring.";
    console.error(error);

  } finally {
    button.disabled = false;
    button.textContent = "Ma'lumot yuborish ↗";
  }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { name, phone, course } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof course !== "string" ||
    !name.trim() || !phone.trim() || !course.trim() ||
    name.length > 80 || phone.length > 30 || course.length > 80
  ) {
    return res.status(400).json({
      success: false,
      message: "Ma'lumotlarni tekshiring"
    });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ success: false });
  }

  const text = [
    "🎓 IBROHIM O'QUV MARKAZI",
    "",
    "👤 Ism: " + name.trim(),
    "📞 Telefon: " + phone.trim(),
    "📚 Kurs: " + course.trim()
  ].join("\n");

  try {
    const telegram = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      }
    );

    const data = await telegram.json();

    if (!telegram.ok || !data.ok) {
      throw new Error("Telegram error");
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Telegram xatoligi"
    });
  }
}
