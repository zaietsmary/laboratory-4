const posts = [
  {
    title: "Як обрати ідеальну книгу",
    description: "Поради для тих, хто шукає щось нове та захоплююче для читання.",
    fullText: `Обрати ідеальну книгу – це як знайти хорошого друга. Вона має відповідати вашим інтересам, настрою та навіть етапу життя. Якщо ви любите пригоди — зверніть увагу на фантастику чи трилери. Хочете чогось глибшого? Спробуйте сучасну чи класичну прозу. Важливо не боятися експериментувати. Часто книга, яку ви обрали випадково, може змінити ваш світогляд. Не менш важливо — читайте відгуки, заглядайте в перші сторінки, і, звичайно, довіряйте своїй інтуїції.`,  image: "images/bl1.jpeg",
    date: "20 квітня 2025"
  },
  {
    title: "Чому ми любимо паперові книжки",
    description: "Коротко про магію паперу та запах друку.",
    fullText:`Паперові книжки — це більше, ніж просто носії тексту. Вони викликають ностальгію, емоції, асоціюються з домашнім затишком. Дослідження показують, що читання з паперу краще впливає на запам’ятовування та розуміння тексту. Крім того, запах друкарської фарби, шелест сторінок, закладки і навіть записки на полях — усе це створює унікальний досвід, який важко замінити електронним аналогом. Книжка в руках — це відчуття справжності, яке не зникає.`,
    image: "images/bl2.jpeg",
    date: "18 березня 2025"
  },
  {
    title: "Філософи, яких варто знати (і читати) сьогодні",
    description: "Короткий гід по мислителям, які формували та формують світогляд людства.",
    fullText: `Філософія — не лише для професорів. Це інструмент, що допомагає краще розуміти світ і себе. Якщо ви хочете заглибитись у думки великих, почніть з Платона, Арістотеля, Канта та Ніцше. Далі — Ганна Арендт, Мішель Фуко, Славой Жижек, Альбер Камю, Жан-Поль Сартр. Кожен із них торкався питань свободи, моралі, політики чи сенсу життя. Їхні ідеї досі актуальні — у часи інформаційного перевантаження та екзистенційної тривоги. Читайте і мисліть критично.`,
    image: "images/bl3.jpeg",
    date: "1 березня 2025"
  },
  {
    title: "Чому корисно читати книги",
    description: "Читання покращує пам’ять, розширює кругозір і знижує стрес — і це тільки початок.",
    fullText: "Читання — це не лише приємний відпочинок. Воно тренує мозок, розвиває уяву та покращує концентрацію. Дослідження доводять, що регулярне читання знижує рівень стресу, покращує емпатію та навіть сприяє довголіттю. Крім того, книжки — це джерело знань, досвіду інших людей, нових ідей. У добу соцмереж і коротких повідомлень глибоке занурення в текст — справжня суперсила. Варто лиш почати — і вам захочеться ще.",
    image: "images/bl4.jpeg",
    date: "25 лютого 2025"
  }
];

const postsPerPage = 2;
let currentIndex = 0;

function renderPosts() {
  const container = document.getElementById("blog-container");
  const slicedPosts = posts.slice(currentIndex, currentIndex + postsPerPage);

  slicedPosts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.className = "blog-post";

    postEl.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <div class="post-content">
        <p class="post-date">${post.date}</p>
        <h2>${post.title}</h2>
        <p class="short-text">${post.description}</p>
        <p class="full-text" style="display: none;">${post.fullText}</p>
        <a href="#" class="read-more">Читати далі</a>
      </div>
    `;

    container.appendChild(postEl);
  });

  currentIndex += postsPerPage;

  if (currentIndex >= posts.length) {
    document.getElementById("loadMoreBtn").style.display = "none";
  }

  attachReadMoreListeners();
}

function attachReadMoreListeners() {
  const readMoreLinks = document.querySelectorAll(".read-more");

  readMoreLinks.forEach(link => {
    link.removeEventListener("click", toggleText); // очищення попередніх слухачів
    link.addEventListener("click", toggleText);
  });
}

function toggleText(e) {
  e.preventDefault();
  const postContent = e.target.closest(".post-content");
  const shortText = postContent.querySelector(".short-text");
  const fullText = postContent.querySelector(".full-text");

  const isExpanded = fullText.style.display === "block";
  fullText.style.display = isExpanded ? "none" : "block";
  shortText.style.display = isExpanded ? "block" : "none";
  e.target.textContent = isExpanded ? "Читати далі" : "Згорнути";
}

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      renderPosts();
    });
  }
});
