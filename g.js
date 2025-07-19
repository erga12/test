document.addEventListener("DOMContentLoaded", () => {
  const statusBarTimeEl = document.getElementById("status-bar-time");
  const widgetTimeEl = document.getElementById("widget-time");
  const widgetDateEl = document.getElementById("widget-date");

  function updateClock() {
    const now = new Date();

    const timeString = now
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\./g, ":");

    const dateString = now.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    statusBarTimeEl.textContent = timeString;
    widgetTimeEl.textContent = timeString;
    widgetDateEl.textContent = dateString;
  }

  setInterval(updateClock, 1000);
  updateClock();

  const appView = document.querySelector(".app-view");
  const appTitle = appView.querySelector(".app-title");
  const appContent = appView.querySelector(".app-content");
  const backButton = appView.querySelector(".back-button");

  function openApp(appName, iconRect) {
    const mobileScreenRect = appView.parentElement.getBoundingClientRect();

    const iconCenterX =
      iconRect.left - mobileScreenRect.left + iconRect.width / 2;
    const iconCenterY =
      iconRect.top - mobileScreenRect.top + iconRect.height / 2;
    const screenCenterX = mobileScreenRect.width / 2;
    const screenCenterY = mobileScreenRect.height / 2;

    const startX = iconCenterX - screenCenterX;
    const startY = iconCenterY - screenCenterY;

    const scaleX = iconRect.width / mobileScreenRect.width;
    const scaleY = iconRect.height / mobileScreenRect.height;

    appView.style.setProperty("--start-x", `${startX}px`);
    appView.style.setProperty("--start-y", `${startY}px`);
    appView.style.setProperty("--start-scale-x", scaleX);
    appView.style.setProperty("--start-scale-y", scaleY);

    appTitle.textContent = appName;

    let contentHTML = "";
    switch (appName) {
      case "Kamera":
        contentHTML = `<div style="width:100%; height: 80%; background: #000; display:flex; justify-content:center; align-items:center; border-radius: 10px; flex-direction: column;">
                                        <i class="fa-solid fa-camera" style="font-size: 80px; color: #444;"></i>
                                        <div style="width: 60px; height: 60px; background: white; border-radius: 50%; margin-top: 40px; border: 4px solid #ccc;"></div>
                                     </div>`;
        break;
      case "Galeri":
        contentHTML = `<h2>Album Anda</h2><p>Tidak ada foto untuk ditampilkan.</p><i class="fa-solid fa-image" style="font-size: 100px; color: #ccc; text-align: center; width: 100%; margin-top: 20px;"></i>`;
        break;
      case "Setelan":
        contentHTML = `<h2>Setelan</h2><p>Wi-Fi, Bluetooth, Tampilan, Suara, dll.</p>`;
        break;
      default:
        contentHTML = `<h2>Selamat Datang di ${appName}</h2><p>Konten aplikasi akan muncul di sini.</p>`;
    }
    appContent.innerHTML = contentHTML;

    appView.classList.add("active");
  }

  function closeApp() {
    appView.classList.remove("active");
  }

  backButton.addEventListener("click", closeApp);

  const appIcons = document.querySelectorAll(".app-icon");
  appIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const appName = icon.dataset.app;
      if (!appName) return;
      icon.classList.add("pressed");

      const iconRect = icon.getBoundingClientRect();

      setTimeout(() => {
        icon.classList.remove("pressed");
        openApp(appName, iconRect);
      }, 200);
    });
  });

  const screenContainer = document.querySelector(".screen-container");
  const dots = document.querySelectorAll(".dot");
  let currentPage = 0;
  let startX;
  let isDragging = false;

  function handleSwipe(e) {
    if (!isDragging) return;
    const currentX = e.type.includes("mouse")
      ? e.pageX
      : e.changedTouches[0].clientX;
    const diffX = currentX - startX;

    if (diffX < -50 && currentPage === 0) {
      currentPage = 1;
    } else if (diffX > 50 && currentPage === 1) {
      currentPage = 0;
    }

    screenContainer.style.transform = `translateX(-${currentPage * 50}%)`;
    updateDots();
    isDragging = false;
  }

  function updateDots() {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentPage].classList.add("active");
  }

  screenContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
  });
  screenContainer.addEventListener("mouseup", handleSwipe);
  screenContainer.addEventListener("mouseleave", () => (isDragging = false));

  screenContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });
  screenContainer.addEventListener("touchend", handleSwipe);

  const framePhone = document.querySelector(".frame-phone");

  function scalePhone() {
    const phoneBaseWidth = 375 + 15 * 2;
    const phoneBaseHeight = 812 + 15 * 2;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scaleX = screenWidth / phoneBaseWidth;
    const scaleY = screenHeight / phoneBaseHeight;

    const scale = Math.min(scaleX, scaleY) * 0.9;

    framePhone.style.transform = `scale(${scale})`;
  }

  window.addEventListener("resize", scalePhone);
  scalePhone();
});
